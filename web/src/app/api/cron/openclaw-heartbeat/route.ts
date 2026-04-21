import { NextResponse } from "next/server";
import { OPENCLAW_NODE } from "@/data/openclaw";
import { verifyCronBearer } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Local-only heartbeat endpoint for Zyra on the zyra-mini Mac mini.
 *
 * This endpoint intentionally does not SSH from serverless. The physical node
 * calls it after local checks pass, so the Dev Lab can ingest node heartbeat
 * state without giving Vercel direct access to the Mac mini.
 */
export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!verifyCronBearer(auth)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    phase: "B",
    owner: "zyra",
    node: OPENCLAW_NODE.id,
    command: OPENCLAW_NODE.ssh,
    message:
      "heartbeat endpoint armed; zyra-mini still needs local cron/file-watcher enablement",
    at: new Date().toISOString(),
  });
}
