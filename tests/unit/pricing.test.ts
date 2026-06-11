import { describe, expect, it } from "vitest";
import {
  computeMonthlyPayment,
  computePricing,
  computeRiskBand,
  formatEur,
} from "@/lib/pricing";

describe("computeRiskBand", () => {
  it("returns band A for high consumption and small system", () => {
    expect(computeRiskBand(400, 6)).toBe("A");
    expect(computeRiskBand(500, 5)).toBe("A");
  });

  it("returns band B for medium consumption", () => {
    expect(computeRiskBand(250, 8)).toBe("B");
    expect(computeRiskBand(399, 5)).toBe("B");
  });

  it("returns band C for low consumption", () => {
    expect(computeRiskBand(100, 4)).toBe("C");
  });
});

describe("computePricing", () => {
  it("computes system price and three offers", () => {
    const result = computePricing({
      systemSizeKw: 5,
      monthlyConsumptionKwh: 420,
      downPayment: 1000,
    });

    expect(result.systemPrice).toBe(6000);
    expect(result.principal).toBe(5000);
    expect(result.riskBand).toBe("A");
    expect(result.apr).toBe(0.069);
    expect(result.offers).toHaveLength(3);
    expect(result.offers[0]?.termYears).toBe(5);
    expect(result.offers[0]?.monthlyPayment).toBeGreaterThan(0);
  });

  it("uses band C APR for low consumption", () => {
    const result = computePricing({
      systemSizeKw: 4,
      monthlyConsumptionKwh: 100,
    });

    expect(result.riskBand).toBe("C");
    expect(result.apr).toBe(0.119);
  });
});

describe("computeMonthlyPayment", () => {
  it("matches standard amortization formula", () => {
    const payment = computeMonthlyPayment(10000, 0.06, 10);
    expect(payment).toBeCloseTo(111.02, 1);
  });

  it("returns zero for zero principal", () => {
    expect(computeMonthlyPayment(0, 0.069, 5)).toBe(0);
  });

  it("handles zero APR (no interest) correctly", () => {
    // principal 1200 over 10 years -> monthly = 1200 / (10*12) = 10
    const payment = computeMonthlyPayment(1200, 0, 10);
    expect(payment).toBe(10);
  });
});

describe("formatEur", () => {
  it("formats numbers as EUR in de-DE locale", () => {
    const formatted = formatEur(1234.56);
    // German format uses period as thousand separator and comma for decimals
    expect(formatted).toMatch(/1\.234,56\s*€/);
  });
});
