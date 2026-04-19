import { NextResponse } from "next/server";
import { verifyCronBearer } from "@/lib/auth";
import { runCouncil } from "@/lib/council";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Weekly digest — Monday 08:00 UTC.
 *
 * Phase A/B: Council drafts "last week wins / open blockers / next week focus"
 * and persists to the council log. Phase C posts it to Discord via the
 * Eliza Discord bot (DISCORD_TOKEN already scaffolded in .env).
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!verifyCronBearer(auth)) {
    console.warn("[/api/cron/weekly-digest] unauthorized");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const t0 = Date.now();
    const run = await runCouncil({
      trigger: "weekly-digest",
      topic:
        "Weekly digest — summarise last week's wins, open blockers, and the top 3 things to push on this week.",
    });
    const ms = Date.now() - t0;
    console.log(
      `[/api/cron/weekly-digest] ok actions=${run.actions.length} provider=${run.provider} in ${ms}ms`,
    );
    return NextResponse.json({ ok: true, run });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/cron/weekly-digest] error:", msg);
    return NextResponse.json({ error: "digest_failed", detail: msg }, { status: 500 });
  }
}
