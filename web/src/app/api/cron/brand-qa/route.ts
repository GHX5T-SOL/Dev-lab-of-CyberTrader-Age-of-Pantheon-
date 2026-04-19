import { NextResponse } from "next/server";
import fs from "node:fs/promises";
import path from "node:path";
import { verifyCronBearer } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Brand asset QA — Palette's owned automation.
 *
 * Walks the avatars + commodities folders and reports which assets are still
 * missing. Useful for knowing whether the SpriteCook pipeline is caught up.
 */
const EXPECTED_AVATARS = [
  "ghost.png",
  "zoro.png",
  "nyx.png",
  "vex.png",
  "rune.png",
  "kite.png",
  "oracle.png",
  "reel.png",
  "palette.png",
  "cipher.png",
  "axiom.png",
  "compass.png",
  "talon.png",
  "hydra.png",
];

const EXPECTED_COMMODITIES = [
  "fractal_dust.png",
  "plutonion_gas.png",
  "neon_glass.png",
  "helix_mud.png",
  "void_bloom.png",
  "oracle_resin.png",
  "velvet_tabs.png",
  "neon_dust.png",
  "phantom_crates.png",
  "ghost_chips.png",
];

async function listSafe(dir: string): Promise<string[]> {
  try {
    return await fs.readdir(dir);
  } catch {
    return [];
  }
}

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (!verifyCronBearer(auth)) {
    console.warn("[/api/cron/brand-qa] unauthorized");
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  try {
    const t0 = Date.now();
    const base = path.join(process.cwd(), "public", "brand");
    const avatarDir = path.join(base, "avatars");
    const commoditiesDir = path.join(base, "commodities");

    const [haveAvatars, haveCommodities] = await Promise.all([
      listSafe(avatarDir),
      listSafe(commoditiesDir),
    ]);

    const missingAvatars = EXPECTED_AVATARS.filter((f) => !haveAvatars.includes(f));
    const missingCommodities = EXPECTED_COMMODITIES.filter((f) => !haveCommodities.includes(f));
    const totalMissing = missingAvatars.length + missingCommodities.length;

    const report = {
      at: new Date().toISOString(),
      avatars: {
        expected: EXPECTED_AVATARS.length,
        present: EXPECTED_AVATARS.length - missingAvatars.length,
        missing: missingAvatars,
      },
      commodities: {
        expected: EXPECTED_COMMODITIES.length,
        present: EXPECTED_COMMODITIES.length - missingCommodities.length,
        missing: missingCommodities,
      },
      totalMissing,
      durationMs: Date.now() - t0,
    };
    console.log(
      `[/api/cron/brand-qa] ok missing=${totalMissing} in ${report.durationMs}ms`,
    );
    return NextResponse.json({ ok: true, report });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("[/api/cron/brand-qa] error:", msg);
    return NextResponse.json({ error: "brand_qa_failed", detail: msg }, { status: 500 });
  }
}
