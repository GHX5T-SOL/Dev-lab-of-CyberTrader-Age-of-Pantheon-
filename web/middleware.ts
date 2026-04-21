import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = new Set<string>(["/gate", "/api/auth/verify", "/api/auth/logout"]);

function isPublic(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true;
  if (pathname.startsWith("/_next/")) return true;
  if (pathname.startsWith("/api/cron/")) return true; // protected by CRON_SECRET bearer
  if (pathname === "/favicon.ico") return true;
  if (
    pathname.startsWith("/audio/") ||
    pathname.startsWith("/fonts/") ||
    pathname.startsWith("/brand/") ||
    pathname.startsWith("/voices/") ||
    pathname.startsWith("/videos/") ||
    pathname.startsWith("/GLB_Assets/")
  ) return true;
  return false;
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  const session = req.cookies.get("devlab_session")?.value;
  if (session === "authenticated") {
    return NextResponse.next();
  }

  const url = req.nextUrl.clone();
  url.pathname = "/gate";
  url.searchParams.set("from", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
