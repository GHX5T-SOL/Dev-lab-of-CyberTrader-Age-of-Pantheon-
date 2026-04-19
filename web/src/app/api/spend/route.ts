import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSpendReport } from "@/lib/spend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * GET /api/spend
 *
 * Returns a live spend snapshot across every configured AI / infra provider.
 * Gate-protected: only authenticated sessions get to call this.
 *
 * Client components (SpendTicker, SpendPanel) poll this every ~60s.
 */
export async function GET() {
  const t0 = Date.now();
  if (!(await isAuthenticated())) {
    console.warn("[/api/spend] unauthorized");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const report = await getSpendReport();
    const ms = Date.now() - t0;
    console.log(
      `[/api/spend] ok providers=${report.totals.providersConfigured} live=${report.totals.providersLive} in ${ms}ms`,
    );
    return NextResponse.json(report, {
      headers: {
        // Private per session. Don't let Vercel Edge Cache hold this.
        "cache-control": "private, no-store, must-revalidate",
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/spend] error:", msg);
    return NextResponse.json({ error: "spend_probe_failed", detail: msg }, { status: 500 });
  }
}
