import type { NextRequest } from "next/server";
import { NextResponse, ProxyConfig } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);

  if (!sessionCookie) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config: ProxyConfig = {
  matcher: ["/complete-registration", "/dashboard-old"],
};
