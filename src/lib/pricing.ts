export type RiskBand = "A" | "B" | "C";

export type Offer = {
  termYears: number;
  apr: number;
  principalUsed: number;
  monthlyPayment: number;
};

export type PricingResult = {
  systemPrice: number;
  principal: number;
  riskBand: RiskBand;
  apr: number;
  offers: Offer[];
};

const PRICE_PER_KW = 1200;
const TERMS_YEARS = [5, 10, 15] as const;

const APR_BY_BAND: Record<RiskBand, number> = {
  A: 0.069,
  B: 0.089,
  C: 0.119,
};

export function computeRiskBand(
  monthlyConsumptionKwh: number,
  systemSizeKw: number,
): RiskBand {
  if (monthlyConsumptionKwh >= 400 && systemSizeKw <= 6) return "A";
  if (monthlyConsumptionKwh >= 250) return "B";
  return "C";
}

export function computeMonthlyPayment(
  principal: number,
  apr: number,
  termYears: number,
): number {
  if (principal <= 0) return 0;

  const monthlyRate = apr / 12;
  const months = termYears * 12;

  if (monthlyRate === 0) {
    return roundCurrency(principal / months);
  }

  const factor = Math.pow(1 + monthlyRate, months);
  const payment = (principal * (monthlyRate * factor)) / (factor - 1);
  return roundCurrency(payment);
}

export function computePricing(input: {
  systemSizeKw: number;
  monthlyConsumptionKwh: number;
  downPayment?: number;
}): PricingResult {
  const systemPrice = roundCurrency(input.systemSizeKw * PRICE_PER_KW);
  const downPayment = input.downPayment ?? 0;
  const principal = roundCurrency(Math.max(systemPrice - downPayment, 0));
  const riskBand = computeRiskBand(
    input.monthlyConsumptionKwh,
    input.systemSizeKw,
  );
  const apr = APR_BY_BAND[riskBand];

  const offers: Offer[] = TERMS_YEARS.map((termYears) => ({
    termYears,
    apr,
    principalUsed: principal,
    monthlyPayment: computeMonthlyPayment(principal, apr, termYears),
  }));

  return { systemPrice, principal, riskBand, apr, offers };
}

export function roundCurrency(value: number): number {
  return Math.round(value * 100) / 100;
}

export function formatEur(value: number): string {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(value);
}
