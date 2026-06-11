import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { logError, logRequest } from "@/lib/logger";
import { errorResponse } from "@/lib/api-utils";
import { renderQuotePdf } from "@/lib/pdf/quote-pdf";
import type { Offer } from "@/lib/pricing";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const started = Date.now();
  const { id } = await params;
  const path = `/api/quotes/${id}/pdf`;

  try {
    const user = await requireAuth();
    if (!user) {
      return errorResponse("Unauthorized", 401);
    }

    const quote = await db.quote.findUnique({ where: { id } });
    if (!quote) {
      return errorResponse("Quote not found", 404);
    }

    if (quote.userId !== user.id && user.role !== "ADMIN") {
      return errorResponse("Forbidden", 403);
    }

    const buffer = await renderQuotePdf({
      ...quote,
      offers: quote.offers as Offer[],
    });

    logRequest({
      method: "GET",
      path,
      userId: user.id,
      status: 200,
      durationMs: Date.now() - started,
    });

    return new Response(new Uint8Array(buffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="quote-${quote.id}.pdf"`,
      },
    });
  } catch (error) {
    logError(error, { path });
    return errorResponse("Failed to generate PDF", 500);
  }
}
