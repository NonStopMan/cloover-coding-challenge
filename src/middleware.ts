import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Next.js deprecated the `middleware` file convention; export `proxy` instead.
export const proxy = NextAuth(authConfig).auth;

export const config = {
  matcher: ["/", "/quotes/:path*", "/admin/:path*", "/login", "/register"],
};
