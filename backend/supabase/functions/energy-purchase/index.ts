import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const ENERGY_COST_PER_HOUR = 1_000;

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
    const secondsFromHours = Number(body.amountHours ?? 0) * 3600;
    const seconds = Math.max(60, Math.floor(Number(body.seconds ?? secondsFromHours)));

    if (!playerId || !Number.isFinite(seconds) || seconds <= 0) {
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

    const cost = roundCurrency((seconds / 3600) * ENERGY_COST_PER_HOUR);
    const { data: purchaseResult, error: purchaseError } = await adminClient.rpc(
      "purchase_energy_atomic",
      {
        p_player_id: playerId,
        p_seconds: seconds,
        p_cost: cost,
      },
    );

    if (purchaseError || !purchaseResult?.[0]) {
      return json(
        {
          code: "energy_purchase_rejected",
          message: purchaseError?.message ?? "purchase_energy_atomic returned no result",
        },
        400,
      );
    }

    const result = purchaseResult[0] as {
      balance_after: number;
      energy_seconds: number;
    };

    const [{ data: resources }, { data: ledgerRows }] = await Promise.all([
      adminClient
        .from("resources")
        .select("energy_seconds, heat, integrity, stealth, influence")
        .eq("player_id", playerId)
        .single(),
      adminClient.rpc("get_ledger", { p_player_id: playerId }),
    ]);

    const ledger = normalizeLedger(ledgerRows);
    const mappedResources = {
      energySeconds: Number(resources?.energy_seconds ?? result.energy_seconds),
      energyHours: Number(resources?.energy_seconds ?? result.energy_seconds) / 3600,
      heat: Number(resources?.heat ?? 0),
      integrity: Number(resources?.integrity ?? 100),
      stealth: Number(resources?.stealth ?? 0),
      influence: Number(resources?.influence ?? 0),
    };

    return json({
      cost,
      balanceAfter: Number(result.balance_after),
      energySeconds: result.energy_seconds,
      newLedger: ledger,
      newResources: mappedResources,
    });
  } catch (error) {
    return json(
      {
        code: "server_error",
        message: error instanceof Error ? error.message : "Unknown energy error",
      },
      500,
    );
  }
});

async function parseBody(req: Request): Promise<{
  playerId?: string;
  seconds?: number;
  amountHours?: number;
}> {
  try {
    return await req.json();
  } catch {
    throw new Error("Bad request body");
  }
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

function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}
