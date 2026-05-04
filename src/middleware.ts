import { NextResponse, type NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "ttm_session";

function secretKey(): Uint8Array | null {
  const raw = process.env.SESSION_SECRET;
  if (!raw || raw.length < 32) return null;
  return new TextEncoder().encode(raw);
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // The login page itself is public.
  if (pathname === "/admin/login") return NextResponse.next();

  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const secret = secretKey();

  if (!token || !secret) {
    return redirectToLogin(req);
  }

  try {
    const { payload } = await jwtVerify(token, secret);
    if (payload.admin !== true) return redirectToLogin(req);
    return NextResponse.next();
  } catch {
    return redirectToLogin(req);
  }
}

function redirectToLogin(req: NextRequest): NextResponse {
  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
