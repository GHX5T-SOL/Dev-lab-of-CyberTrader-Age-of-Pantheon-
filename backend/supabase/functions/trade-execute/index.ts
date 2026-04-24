import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";
import { getServerHeatDelta, getServerPrice } from "../_shared/market.ts";

type TradeSide = "BUY" | "SELL";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return json({ code: "method_not_allowed" }, 405);
  }

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

  let body: {
    playerId?: string;
    ticker?: string;
    side?: TradeSide;
    quantity?: number;
    tick?: number;
  };

  try {
    body = await req.json();
  } catch {
    return json({ code: "bad_request" }, 400);
  }

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

  const price = getServerPrice(ticker, tick);
  const heatDelta = getServerHeatDelta(ticker, side);
  const energyCost = getTradeEnergyCost(side, quantity);

  if (price === null || heatDelta === null) {
    return json({ code: "unknown_ticker" }, 400);
  }

  const { data, error } = await adminClient.rpc("execute_trade_atomic", {
    p_player_id: playerId,
    p_ticker: ticker,
    p_side: side,
    p_quantity: quantity,
    p_price: price,
    p_heat_delta: heatDelta,
    p_energy_cost: energyCost,
  });

  if (error || !data?.[0]) {
    return json(
      {
        code: "trade_rejected",
        message: error?.message ?? "execute_trade_atomic returned no result",
      },
      400,
    );
  }

  const result = data[0] as {
    trade_id: string;
    position_id: string;
    balance_after: number;
    energy_seconds: number;
    heat: number;
  };

  return json({
    tradeId: result.trade_id,
    positionId: result.position_id,
    filledPrice: price,
    heatDelta,
    energyCost,
    balanceAfter: Number(result.balance_after),
    energySeconds: result.energy_seconds,
    heat: result.heat,
  });
});

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
