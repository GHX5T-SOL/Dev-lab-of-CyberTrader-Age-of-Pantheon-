import { NextResponse } from "next/server";
import { getOfficePreference, saveOfficePreference, type OfficePreference } from "@/lib/officeState";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const key = new URL(request.url).searchParams.get("player") ?? "default";
  return NextResponse.json({ preference: getOfficePreference(key) });
}

export async function POST(request: Request) {
  const payload = (await request.json()) as OfficePreference & { player?: string };
  const player = payload.player ?? payload.founder;
  if (!player || !payload.founder) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const preference = saveOfficePreference(player, {
    founder: payload.founder,
    graphicsPreset: payload.graphicsPreset,
    mobileObserver: payload.mobileObserver,
    savedAt: new Date().toISOString(),
  });

  return NextResponse.json({ ok: true, preference });
}
