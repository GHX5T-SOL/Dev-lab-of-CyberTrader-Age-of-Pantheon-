import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { runCouncil } from "@/lib/council";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * POST /api/council/run
 * Body: { topic?: string }
 *
 * Runs a Council round immediately. Gate-protected so only logged-in
 * Ghost/Zoro can fire it from the Council Hall UI.
 */
export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const body = (await req.json().catch(() => ({}))) as { topic?: string };
    const t0 = Date.now();
    const run = await runCouncil({ trigger: "manual", topic: body.topic });
    const ms = Date.now() - t0;
    console.log(
      `[/api/council/run] ok participants=${run.participants.length} provider=${run.provider} in ${ms}ms`,
    );
    return NextResponse.json({ ok: true, run });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/council/run] error:", msg);
    return NextResponse.json({ error: "council_failed", detail: msg }, { status: 500 });
  }
}
