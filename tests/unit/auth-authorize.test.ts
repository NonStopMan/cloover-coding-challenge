import { describe, it, expect, vi, beforeEach } from "vitest";

// Control values for mocked modules
let mockedUser: any = null;
let mockedCompare = false;

vi.mock("@/lib/db", () => ({
  db: { user: { findUnique: async () => mockedUser } },
}));

vi.mock("bcryptjs", () => ({
  default: { compare: async () => mockedCompare },
  compare: async () => mockedCompare,
}));

vi.mock("@/lib/logger", () => ({ logger: { warn: () => {}, info: () => {} } }));

vi.mock("next-auth", () => ({
  default: (_opts: any) => ({
    handlers: {},
    auth: async () => null,
    signIn: () => {},
    signOut: () => {},
  }),
}));

// Mock next-auth to capture provider passed into NextAuth
describe("Credentials authorize flow", () => {
  beforeEach(() => {
    vi.resetModules();
    mockedUser = null;
    mockedCompare = false;
  });

  it("returns null on schema validation failure", async () => {
    const { authorizeCredentials } = await import("@/lib/auth");
    const res = await authorizeCredentials({
      email: "not-an-email",
      password: "short",
    });
    expect(res).toBeNull();
  });

  it("returns null when user not found", async () => {
    mockedUser = null;
    const { authorizeCredentials } = await import("@/lib/auth");
    const res = await authorizeCredentials({
      email: "jane@example.com",
      password: "password123",
    });
    expect(res).toBeNull();
  });

  it("returns null on invalid password", async () => {
    mockedUser = {
      id: "u1",
      email: "jane@example.com",
      passwordHash: "hash",
      fullName: "Jane",
      role: "USER",
    };
    mockedCompare = false;
    const { authorizeCredentials } = await import("@/lib/auth");
    const res = await authorizeCredentials({
      email: "jane@example.com",
      password: "wrong",
    });
    expect(res).toBeNull();
  });

  it("returns user object on successful auth", async () => {
    mockedUser = {
      id: "u1",
      email: "jane@example.com",
      passwordHash: "hash",
      fullName: "Jane",
      role: "USER",
    };
    mockedCompare = true;
    const { authorizeCredentials } = await import("@/lib/auth");
    const res = await authorizeCredentials({
      email: "jane@example.com",
      password: "password123",
    });
    if (res == null) {
      // debug info
      // eslint-disable-next-line no-console
      console.error("authorize returned null", { mockedUser, mockedCompare });
    }
    expect(res).toBeDefined();
    expect(res.id).toBe("u1");
    expect(res.email).toBe("jane@example.com");
  });
});
