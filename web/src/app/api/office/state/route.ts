import { NextResponse } from "next/server";
import { getOfficeState } from "@/lib/officeState";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const payload = await getOfficeState();
  return NextResponse.json(payload, {
    headers: {
      "cache-control": "private, no-store, must-revalidate",
    },
  });
}
