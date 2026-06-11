import { describe, expect, it } from "vitest";
import { quoteInputSchema } from "@/lib/schemas/quote";

describe("quoteInputSchema", () => {
  it("accepts valid input", () => {
    const result = quoteInputSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      address: "Berlin",
      monthlyConsumptionKwh: 350,
      systemSizeKw: 5,
      downPayment: 500,
    });

    expect(result.success).toBe(true);
  });

  it("rejects down payment above system price", () => {
    const result = quoteInputSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      address: "Berlin",
      monthlyConsumptionKwh: 350,
      systemSizeKw: 5,
      downPayment: 7000,
    });

    expect(result.success).toBe(false);
  });

  it("rejects non-positive system size", () => {
    const result = quoteInputSchema.safeParse({
      fullName: "Jane Doe",
      email: "jane@example.com",
      address: "Berlin",
      monthlyConsumptionKwh: 350,
      systemSizeKw: 0,
    });

    expect(result.success).toBe(false);
  });
});
