import { describe, it, expect } from "vitest";
import { generateOpenApiDocument } from "@/lib/openapi";

describe("generateOpenApiDocument", () => {
  it("generates a document with expected top-level fields", () => {
    const doc = generateOpenApiDocument();
    expect(doc.openapi).toBeDefined();
    expect(doc.info).toBeDefined();
    expect(doc.paths).toBeDefined();
    // Ensure health path is present
    expect(doc.paths["/api/health"]).toBeDefined();
  });
});
