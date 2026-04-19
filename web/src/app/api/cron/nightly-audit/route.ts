import { NextResponse } from "next/server";
import { verifyCronBearer } from "@/lib/auth";
import { runCouncil } from "@/lib/council";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Nightly repo audit — Talon's owned automation.
 *
 * Phase A: runs a council round on the topic "overnight integrity check".
 * Phase B: actually scans /public/brand + docs for drift, palette violations,
 *          broken internal links, orphan tasks.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!verifyCronBearer(auth)) {
    console.warn("[/api/cron/nightly-audit] unauthorized");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const t0 = Date.now();
    // Phase A: surface findings via a Council round. Phase B does real IO.
    const run = await runCouncil({
      trigger: "nightly-audit",
      topic:
        "Overnight integrity check — flag brand-asset drift, broken internal links, orphan tasks, palette violations.",
    });
    const ms = Date.now() - t0;
    console.log(
      `[/api/cron/nightly-audit] ok actions=${run.actions.length} provider=${run.provider} in ${ms}ms`,
    );
    return NextResponse.json({ ok: true, run });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/cron/nightly-audit] error:", msg);
    return NextResponse.json({ error: "audit_failed", detail: msg }, { status: 500 });
  }
}
