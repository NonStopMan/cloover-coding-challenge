import { db } from "@/lib/db";
import { requireAuth, requireAdmin } from "@/lib/auth";
import { logError, logRequest } from "@/lib/logger";
import { computePricing } from "@/lib/pricing";
import { quoteInputSchema } from "@/lib/schemas/quote";
import { errorResponse, jsonResponse, serializeQuote } from "@/lib/api-utils";

export async function POST(request: Request) {
  const started = Date.now();
  const path = "/api/quotes";

  try {
    const user = await requireAuth();
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const body = await request.json();
    const parsed = quoteInputSchema.safeParse(body);
    if (!parsed.success) {
      logRequest({
        method: "POST",
        path,
        userId: user.id,
        status: 400,
        durationMs: Date.now() - started,
      });
      return errorResponse(
        parsed.error.issues[0]?.message ?? "Invalid input",
        400,
      );
    }

    const downPayment = parsed.data.downPayment ?? 0;
    const pricing = computePricing({
      systemSizeKw: parsed.data.systemSizeKw,
      monthlyConsumptionKwh: parsed.data.monthlyConsumptionKwh,
      downPayment,
    });

    const quote = await db.quote.create({
      data: {
        userId: user.id,
        fullName: parsed.data.fullName,
        email: parsed.data.email,
        address: parsed.data.address,
        monthlyConsumptionKwh: parsed.data.monthlyConsumptionKwh,
        systemSizeKw: parsed.data.systemSizeKw,
        downPayment,
        systemPrice: pricing.systemPrice,
        principal: pricing.principal,
        riskBand: pricing.riskBand,
        offers: pricing.offers,
      },
    });

    logRequest({
      method: "POST",
      path,
      userId: user.id,
      status: 201,
      durationMs: Date.now() - started,
    });

    return jsonResponse(serializeQuote(quote), 201);
  } catch (error) {
    logError(error, { path });
    return errorResponse("Failed to create quote", 500);
  }
}

export async function GET(request: Request) {
  const started = Date.now();
  const path = "/api/quotes";

  try {
    const user = await requireAuth();
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.trim();

    if (search && user.role !== "ADMIN") {
      return errorResponse("Forbidden", 403);
    }

    if (user.role === "ADMIN") {
      const quotes = await db.quote.findMany({
        where: search
          ? {
              OR: [
                { fullName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
              ],
            }
          : undefined,
        orderBy: { createdAt: "desc" },
        include: { user: { select: { fullName: true, email: true } } },
      });

      logRequest({
        method: "GET",
        path,
        userId: user.id,
        status: 200,
        durationMs: Date.now() - started,
      });

      return jsonResponse({
        quotes: quotes.map((quote: any) => ({
          ...serializeQuote(quote),
          user: {
            fullName: quote.user.fullName,
            email: quote.user.email,
          },
        })),
      });
    }

    const quotes = await db.quote.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    logRequest({
      method: "GET",
      path,
      userId: user.id,
      status: 200,
      durationMs: Date.now() - started,
    });

    return jsonResponse({
      quotes: quotes.map((quote: any) => serializeQuote(quote)),
    });
  } catch (error) {
    logError(error, { path });
    return errorResponse("Failed to fetch quotes", 500);
  }
}
