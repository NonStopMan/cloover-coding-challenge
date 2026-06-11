import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import type { NextRequest } from "next/server";

// Export `proxy` to align with Next.js proxy convention while also
// providing a `middleware` function for older Next.js versions that still
// validate the presence of a middleware export.
export const proxy = NextAuth(authConfig).auth;

export async function middleware(request: NextRequest) {
  // Delegate to NextAuth's handler (proxy) so auth handling remains unchanged.
  // Cast to `any` to match the handler signature expected by NextAuth.
  return proxy(request as any);
}

export const config = {
  matcher: ["/", "/quotes/:path*", "/admin/:path*", "/login", "/register"],
};
