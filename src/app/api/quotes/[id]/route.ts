import { db } from "@/lib/db";
import { requireAuth } from "@/lib/auth";
import { logError, logRequest } from "@/lib/logger";
import { errorResponse, jsonResponse, serializeQuote } from "@/lib/api-utils";

type Params = { params: Promise<{ id: string }> };

export async function GET(_request: Request, { params }: Params) {
  const started = Date.now();
  const { id } = await params;
  const path = `/api/quotes/${id}`;

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

    logRequest({
      method: "GET",
      path,
      userId: user.id,
      status: 200,
      durationMs: Date.now() - started,
    });

    return jsonResponse(serializeQuote(quote));
  } catch (error) {
    logError(error, { path });
    return errorResponse("Failed to fetch quote", 500);
  }
}
