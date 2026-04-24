import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "../_shared/cors.ts";

const ENERGY_COST_PER_HOUR = 1_500;

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

  let body: { playerId?: string; seconds?: number };
  try {
    body = await req.json();
  } catch {
    return json({ code: "bad_request" }, 400);
  }

  const playerId = body.playerId;
  const seconds = Math.max(60, Math.floor(Number(body.seconds ?? 0)));

  if (!playerId || !Number.isFinite(seconds)) {
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

  const cost = Math.round((seconds / 3600) * ENERGY_COST_PER_HOUR * 100) / 100;
  const { data, error } = await adminClient.rpc("purchase_energy_atomic", {
    p_player_id: playerId,
    p_seconds: seconds,
    p_cost: cost,
  });

  if (error || !data?.[0]) {
    return json(
      {
        code: "energy_purchase_rejected",
        message: error?.message ?? "purchase_energy_atomic returned no result",
      },
      400,
    );
  }

  const result = data[0] as {
    balance_after: number;
    energy_seconds: number;
  };

  return json({
    cost,
    balanceAfter: Number(result.balance_after),
    energySeconds: result.energy_seconds,
  });
});

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
