import type { Offer } from "@/lib/pricing";
import type { Quote } from "@/generated/prisma/client";

export function serializeQuote(quote: Quote) {
  return {
    id: quote.id,
    inputs: {
      fullName: quote.fullName,
      email: quote.email,
      address: quote.address,
      monthlyConsumptionKwh: quote.monthlyConsumptionKwh,
      systemSizeKw: quote.systemSizeKw,
      downPayment: quote.downPayment,
    },
    derived: {
      systemPrice: quote.systemPrice,
      principal: quote.principal,
      riskBand: quote.riskBand as "A" | "B" | "C",
      apr: (quote.offers as Offer[])[0]?.apr ?? 0,
    },
    offers: quote.offers as Offer[],
    createdAt: quote.createdAt.toISOString(),
  };
}

export function jsonResponse(data: unknown, status = 200) {
  return Response.json(data, { status });
}

export function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}
