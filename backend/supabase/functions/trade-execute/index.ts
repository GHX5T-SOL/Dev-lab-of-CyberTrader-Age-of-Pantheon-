import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { getServerPrice } from "../_shared/market.ts";

type TradeSide = "BUY" | "SELL";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ code: "method_not_allowed" }, 405);
  }

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
    const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!supabaseUrl || !anonKey || !serviceRoleKey) {
      return json({ code: "missing_supabase_env" }, 500);
    }

    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const adminClient = createClient(supabaseUrl, serviceRoleKey);

    const {
      data: { user },
      error: userError,
    } = await userClient.auth.getUser();

    if (userError || !user) {
      return json({ code: "unauthorized" }, 401);
    }

    const body = await parseBody(req);
    const playerId = body.playerId;
    const ticker = body.ticker;
    const side = body.side;
    const quantity = Math.floor(Number(body.quantity ?? 0));
    const tick = Math.max(0, Math.floor(Number(body.tick ?? 0)));

    if (!playerId || !ticker || (side !== "BUY" && side !== "SELL") || quantity <= 0) {
      return json({ code: "missing_or_invalid_fields" }, 400);
    }

    const { data: player, error: playerError } = await adminClient
      .from("players")
      .select("id")
      .eq("id", playerId)
      .eq("auth_user_id", user.id)
      .single();

    if (playerError || !player) {
      return json({ code: "player_not_found" }, 403);
    }

    const currentPrice = await resolvePrice(adminClient, ticker, tick);
    if (!currentPrice) {
      return json({ code: "price_not_available" }, 400);
    }

    const cost = roundCurrency(quantity * currentPrice);
    const heatDelta = Math.ceil(cost / (ticker === "BLCK" || ticker === "AETH" ? 2500 : 5000));
    const energyCost = getTradeEnergyCost(side, quantity);

    const { data: tradeResult, error: tradeError } = await adminClient.rpc(
      "execute_trade_atomic",
      {
        p_player_id: playerId,
        p_ticker: ticker,
        p_side: side,
        p_quantity: quantity,
        p_price: currentPrice,
        p_heat_delta: heatDelta,
        p_energy_cost: energyCost,
      },
    );

    if (tradeError || !tradeResult?.[0]) {
      return json(
        {
          code: "trade_rejected",
          message: tradeError?.message ?? "execute_trade_atomic returned no result",
        },
        400,
      );
    }

    const result = tradeResult[0] as {
      trade_id: string;
      position_id: string;
      balance_after: number;
      energy_seconds: number;
      heat: number;
    };

    const [{ data: resources }, { data: ledgerRows }, { data: positions }] =
      await Promise.all([
        adminClient
          .from("resources")
          .select("energy_seconds, heat, integrity, stealth, influence")
          .eq("player_id", playerId)
          .single(),
        adminClient.rpc("get_ledger", { p_player_id: playerId }),
        adminClient
          .from("positions")
          .select("*")
          .eq("player_id", playerId)
          .gt("quantity", 0),
      ]);

    const ledger = normalizeLedger(ledgerRows);
    const mappedResources = {
      energySeconds: Number(resources?.energy_seconds ?? result.energy_seconds),
      energyHours: Number(resources?.energy_seconds ?? result.energy_seconds) / 3600,
      heat: Number(resources?.heat ?? result.heat),
      integrity: Number(resources?.integrity ?? 100),
      stealth: Number(resources?.stealth ?? 0),
      influence: Number(resources?.influence ?? 0),
    };

    return json({
      tradeId: result.trade_id,
      positionId: result.position_id,
      filledPrice: currentPrice,
      commission: 0,
      heatDelta,
      energyCost,
      balanceAfter: Number(result.balance_after),
      energySeconds: result.energy_seconds,
      heat: result.heat,
      positions: positions ?? [],
      ledger,
      resources: mappedResources,
    });
  } catch (error) {
    return json(
      {
        code: "server_error",
        message: error instanceof Error ? error.message : "Unknown trade error",
      },
      500,
    );
  }
});

async function parseBody(req: Request): Promise<{
  playerId?: string;
  ticker?: string;
  side?: TradeSide;
  quantity?: number;
  tick?: number;
}> {
  try {
    return await req.json();
  } catch {
    throw new Error("Bad request body");
  }
}

async function resolvePrice(
  adminClient: ReturnType<typeof createClient>,
  ticker: string,
  tick: number,
): Promise<number | null> {
  const { data } = await adminClient
    .from("market_prices")
    .select("price")
    .eq("ticker", ticker)
    .lte("tick", tick)
    .order("tick", { ascending: false })
    .limit(1);

  const dbPrice = Number(data?.[0]?.price ?? 0);
  return dbPrice > 0 ? dbPrice : getServerPrice(ticker, tick);
}

function normalizeLedger(rows: unknown): { zeroBol: number; obolToken: number } {
  const row = Array.isArray(rows) ? rows[0] : rows;
  const ledger = row as { zero_bol?: number | string; obol_token?: number | string } | undefined;

  return {
    zeroBol: Number(ledger?.zero_bol ?? 0),
    obolToken: Number(ledger?.obol_token ?? 0),
  };
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

function getTradeEnergyCost(side: TradeSide, quantity: number): number {
  const baseCost = side === "BUY" ? 90 : 75;
  return Math.max(15, Math.round((baseCost * quantity) / 10));
}

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}
