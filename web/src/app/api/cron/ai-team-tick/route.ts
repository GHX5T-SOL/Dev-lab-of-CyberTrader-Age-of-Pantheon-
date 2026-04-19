import { NextResponse } from "next/server";
import { verifyCronBearer } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Vercel Cron endpoint — scheduled hourly by vercel.ts.
 *
 * Phase A: no-op stub. Logs a heartbeat.
 *
 * Phase C plan: pick N outstanding tasks from data/tasks.ts, dispatch them
 * to the appropriate agent via Vercel AI Gateway, persist updates to
 * Supabase, and open follow-up PRs via the OpenClaw / GitHub API path.
 *
 * Security: Vercel Cron sends `Authorization: Bearer <CRON_SECRET>`. We
 * reject requests that don't match.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!verifyCronBearer(auth)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const now = new Date().toISOString();
  // Intentional no-op. Wire real logic in Phase C after council sign-off.
  return NextResponse.json({
    ok: true,
    phase: "A",
    message: "heartbeat only — real AI team tick logic lands in Phase C",
    at: now,
  });
}
