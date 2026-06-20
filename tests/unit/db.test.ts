import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("pg", () => {
  return {
    Pool: class {
      constructor(opts: any) {
        (this as any).connectionString = opts?.connectionString;
      }
    },
  };
});

vi.mock("@prisma/adapter-pg", () => {
  return {
    PrismaPg: class {
      constructor(pool: any) {
        (this as any).pool = pool;
      }
    },
  };
});

vi.mock("@/generated/prisma/client", () => {
  return {
    PrismaClient: class {
      constructor(opts: any) {
        (this as any).opts = opts;
      }
    },
  };
});

describe("db module with mocked adapters", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  it("creates a PrismaClient with a PrismaPg adapter and Pool", async () => {
    // Ensure env var is set so Pool gets a connectionString
    process.env.DATABASE_URL = "postgres://localhost/db";

    const { db } = await import("@/lib/db");
    // The mocked PrismaClient stored the opts passed in constructor
    expect((db as any).opts).toBeDefined();
    expect((db as any).opts.adapter).toBeDefined();
  });
});
