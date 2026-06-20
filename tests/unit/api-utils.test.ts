import { describe, it, expect } from "vitest";
import { serializeQuote, jsonResponse, errorResponse } from "@/lib/api-utils";

describe("serializeQuote", () => {
  it("serializes a quote object to the expected shape", () => {
    const now = new Date();
    const quote: any = {
      id: "q1",
      fullName: "Jane",
      email: "jane@example.com",
      address: "Berlin",
      monthlyConsumptionKwh: 100,
      systemSizeKw: 4,
      downPayment: 0,
      systemPrice: 4800,
      principal: 4800,
      riskBand: "C",
      offers: [
        { termYears: 5, apr: 0.1, principalUsed: 4800, monthlyPayment: 100 },
      ],
      createdAt: now,
    };

    const out = serializeQuote(quote);
    expect(out.id).toBe("q1");
    expect(out.inputs.fullName).toBe("Jane");
    expect(out.derived.systemPrice).toBe(4800);
    expect(out.offers).toHaveLength(1);
    expect(out.createdAt).toBe(now.toISOString());
  });
});

describe("jsonResponse and errorResponse", () => {
  it("returns a Response-like object for jsonResponse", () => {
    const res = jsonResponse({ ok: true }, 201) as any;
    // In Node environment, Response.json returns a Response object with status
    expect(res.status).toBe(201);
  });

  it("returns an error response with provided status", () => {
    const res = errorResponse("bad", 400) as any;
    expect(res.status).toBe(400);
  });
});
