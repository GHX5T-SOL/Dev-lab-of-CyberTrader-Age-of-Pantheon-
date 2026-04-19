import { NextResponse } from "next/server";
import { verifyCronBearer } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Synthetic market tick — Hydra's owned automation.
 *
 * Phase A: heartbeat only.
 * Phase B: spin up 3-5 ElizaOS synthetic traders, run a 5-minute tick,
 *          record price drift vs. the deterministic reference. Failures
 *          trigger a Council round.
 *
 * This route stays fast (<5s). Heavy sim work fires on Hydra's local
 * long-running process, not inside the Fluid Compute window.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!verifyCronBearer(auth)) {
    console.warn("[/api/cron/market-tick] unauthorized");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const now = new Date().toISOString();
    console.log(`[/api/cron/market-tick] heartbeat ${now}`);
    return NextResponse.json({
      ok: true,
      phase: "A",
      message: "market-tick heartbeat — Hydra's swarm picks this up in Phase B",
      at: now,
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/cron/market-tick] error:", msg);
    return NextResponse.json({ error: "market_tick_failed", detail: msg }, { status: 500 });
  }
}
