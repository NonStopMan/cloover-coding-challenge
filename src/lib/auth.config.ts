import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  // Use AUTH_SECRET from environment in production; fallback for local dev
  secret: process.env.AUTH_SECRET ?? "dev-secret",
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  providers: [],
  callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;

      const protectedPaths = ["/", "/quotes", "/admin"];
      const isProtected = protectedPaths.some(
        (path) => pathname === path || pathname.startsWith(`${path}/`),
      );

      if (isProtected && !isLoggedIn) {
        return false;
      }

      if (pathname.startsWith("/admin") && auth?.user?.role !== "ADMIN") {
        return Response.redirect(new URL("/", request.nextUrl.origin));
      }

      if ((pathname === "/login" || pathname === "/register") && isLoggedIn) {
        return Response.redirect(new URL("/", request.nextUrl.origin));
      }

      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id!;
        token.role = user.role;
        token.fullName = user.fullName;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.fullName = token.fullName as string;
        session.user.role = token.role as "USER" | "ADMIN";
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
