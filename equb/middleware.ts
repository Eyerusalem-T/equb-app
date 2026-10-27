import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

/** Layer 1: cheap gate at the edge. Proves a valid signed session exists, nothing more. */
export async function middleware(req: NextRequest) {
  const token = req.cookies.get("eq_session")?.value;
  const key = new TextEncoder().encode(process.env.AUTH_SECRET || "dev-only-secret-change-me-please-32chars");
  try { if (token) { await jwtVerify(token, key); return NextResponse.next(); } } catch {}
  const url = req.nextUrl.clone();
  url.pathname = "/signin"; url.search = "?next=" + encodeURIComponent(req.nextUrl.pathname);
  return NextResponse.redirect(url);
}
export const config = { matcher: ["/groups/:path*"] };
