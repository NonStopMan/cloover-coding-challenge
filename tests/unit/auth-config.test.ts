import { describe, it, expect } from "vitest";
import { authConfig } from "@/lib/auth.config";

describe("authConfig callbacks", () => {
  it("denies access to protected paths for anonymous users", () => {
    const req: any = {
      nextUrl: { pathname: "/quotes", origin: "http://localhost" },
    };
    const out = authConfig.callbacks.authorized({
      auth: undefined,
      request: req,
    } as any);
    expect(out).toBe(false);
  });

  it("allows access when logged in", () => {
    const req: any = {
      nextUrl: { pathname: "/quotes", origin: "http://localhost" },
    };
    const auth: any = { user: { id: "u1", role: "USER" } };
    const out = authConfig.callbacks.authorized({ auth, request: req } as any);
    expect(out).toBe(true);
  });

  it("redirects non-admin from /admin", () => {
    const req: any = {
      nextUrl: { pathname: "/admin", origin: "http://localhost" },
    };
    const auth: any = { user: { id: "u2", role: "USER" } };
    const out = authConfig.callbacks.authorized({ auth, request: req } as any);
    // Should return a Response object when redirecting
    expect((out as any)?.status).toBeDefined();
  });

  it("jwt callback injects token fields when user present", () => {
    const token: any = {};
    const user: any = { id: "u1", role: "ADMIN", fullName: "Admin" };
    const out = authConfig.callbacks.jwt({ token, user } as any);
    expect(out.id).toBe("u1");
    expect(out.role).toBe("ADMIN");
    expect(out.fullName).toBe("Admin");
  });

  it("session callback copies token fields into session.user", () => {
    const session: any = { user: {} };
    const token: any = { id: "u1", role: "ADMIN", fullName: "Admin" };
    const out = authConfig.callbacks.session({ session, token } as any);
    expect(out.user.id).toBe("u1");
    expect(out.user.fullName).toBe("Admin");
    expect(out.user.role).toBe("ADMIN");
  });

  it("redirects logged-in users away from login/register pages", () => {
    const req: any = {
      nextUrl: { pathname: "/login", origin: "http://localhost" },
    };
    const auth: any = { user: { id: "u3", role: "USER" } };
    const out = authConfig.callbacks.authorized({ auth, request: req } as any);
    expect((out as any)?.status).toBeDefined();
  });
});
