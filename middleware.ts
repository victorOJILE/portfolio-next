import { NextResponse, type NextRequest } from "next/server";

const BASE_URL = process?.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.BASE_URL;

const ALLOWED_ORIGINS = [process.env.NEXT_PUBLIC_SITE_URL ?? BASE_URL ?? "http://localhost:3000"];

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "img-src 'self' data: https://firebasestorage.googleapis.com",
      "script-src 'self' 'unsafe-inline'", // tighten to a nonce once inline analytics scripts are audited
      "style-src 'self' 'unsafe-inline'",
      "connect-src 'self' https://*.googleapis.com https://api.flutterwave.com",
      "frame-ancestors 'none'",
    ].join("; ")
  );

  if (request.nextUrl.pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    if (origin && !ALLOWED_ORIGINS.includes(origin)) {
      return NextResponse.json({ error: "Origin not allowed." }, { status: 403 });
    }
  }

  return response;
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico).*)",
};
