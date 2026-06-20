import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";
import type { NextRequest } from "next/server";

export const proxy = NextAuth(authConfig).auth;

export const config = {
  matcher: ["/", "/quotes/:path*", "/admin/:path*", "/login", "/register"],
};
