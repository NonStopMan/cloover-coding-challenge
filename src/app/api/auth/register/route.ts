import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { logError, logRequest } from "@/lib/logger";
import { errorResponse, jsonResponse } from "@/lib/api-utils";
import { registerSchema } from "@/lib/schemas/quote";

export async function POST(request: Request) {
  const started = Date.now();
  const path = "/api/auth/register";

  try {
    const body = await request.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      logRequest({
        method: "POST",
        path,
        status: 400,
        durationMs: Date.now() - started,
      });
      return errorResponse(parsed.error.issues[0]?.message ?? "Invalid input", 400);
    }

    const email = parsed.data.email.toLowerCase();
    const existing = await db.user.findUnique({ where: { email } });
    if (existing) {
      logRequest({
        method: "POST",
        path,
        status: 409,
        durationMs: Date.now() - started,
      });
      return errorResponse("Email already registered", 409);
    }

    const passwordHash = await bcrypt.hash(parsed.data.password, 12);
    const user = await db.user.create({
      data: {
        email,
        fullName: parsed.data.fullName,
        passwordHash,
      },
    });

    logRequest({
      method: "POST",
      path,
      userId: user.id,
      status: 201,
      durationMs: Date.now() - started,
    });

    return jsonResponse(
      {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
      },
      201,
    );
  } catch (error) {
    logError(error, { path });
    return errorResponse("Registration failed", 500);
  }
}
