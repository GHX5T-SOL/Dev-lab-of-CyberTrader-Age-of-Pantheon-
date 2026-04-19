import { NextResponse } from "next/server";
import { verifyCronBearer } from "@/lib/auth";
import { runCouncil } from "@/lib/council";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60; // Fluid Compute — give the model room to respond

/**
 * Daily Council standup. Triggered by Vercel Cron at 09:00 UTC.
 * Picks the top stale task, rotates agents, and writes a structured entry
 * to memory/council-log.jsonl.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!verifyCronBearer(auth)) {
    console.warn("[/api/cron/council-standup] unauthorized");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const t0 = Date.now();
    const run = await runCouncil({ trigger: "standup" });
    const ms = Date.now() - t0;
    console.log(
      `[/api/cron/council-standup] ok participants=${run.participants.length} provider=${run.provider} in ${ms}ms`,
    );
    return NextResponse.json({ ok: true, run });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/cron/council-standup] error:", msg);
    return NextResponse.json({ error: "council_failed", detail: msg }, { status: 500 });
  }
}
