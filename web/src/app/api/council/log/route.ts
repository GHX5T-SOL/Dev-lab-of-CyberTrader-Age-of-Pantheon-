import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { readCouncilLog } from "@/lib/council";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/council/log?limit=50
 * Returns the most recent Council runs, newest last.
 */
export async function GET(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const url = new URL(req.url);
    const limit = Math.min(Number(url.searchParams.get("limit") ?? 50), 200);
    const runs = await readCouncilLog(limit);
    return NextResponse.json({ ok: true, runs });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/council/log] error:", msg);
    return NextResponse.json({ error: "log_read_failed", detail: msg }, { status: 500 });
  }
}
