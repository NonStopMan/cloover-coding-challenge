import { describe, it, expect, vi, beforeEach } from "vitest";

// Control the mocked auth return per-test by updating this variable
let mockedSession: any = { user: { id: "u1", role: "USER" } };

vi.mock("next-auth", () => {
  return {
    default: (_opts: any) => ({
      handlers: {},
      auth: async () => mockedSession,
      signIn: () => {},
      signOut: () => {},
    }),
  };
});

// Provide a harmless db mock for imports
vi.mock("@/lib/db", () => ({ db: { user: { findUnique: async () => null } } }));

describe("auth helpers with mocked next-auth", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("requireAuth returns user when session exists", async () => {
    mockedSession = { user: { id: "u1", role: "USER" } };
    const mod = await import("@/lib/auth");
    const user = await mod.requireAuth();
    expect(user).toBeDefined();
    expect(user?.id).toBe("u1");
  });

  it("requireAdmin returns null for non-admin", async () => {
    mockedSession = { user: { id: "u2", role: "USER" } };
    const mod = await import("@/lib/auth");
    const admin = await mod.requireAdmin();
    expect(admin).toBeNull();
  });
});
