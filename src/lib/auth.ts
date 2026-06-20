import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { authConfig } from "@/lib/auth.config";
import { db } from "@/lib/db";
import { loginSchema } from "@/lib/schemas/quote";
import { logger } from "./logger";

export async function authorizeCredentials(credentials: any) {
  const parsed = loginSchema.safeParse(credentials);
  if (!parsed.success) {
    logger.warn(
      {
        reason: "validation_failed",
        errors: parsed.error?.format(),
        input: { email: credentials?.email },
      },
      "Unsuccessful login attempt",
    );
    return null;
  }

  const user = await db.user.findUnique({
    where: { email: parsed.data.email.toLowerCase() },
  });
  if (!user) {
    logger.warn(
      { reason: "user_not_found", email: parsed.data.email },
      "Unsuccessful login attempt",
    );
    return null;
  }

  const valid = await bcrypt.compare(parsed.data.password, user.passwordHash);
  if (!valid) {
    logger.warn(
      { reason: "invalid_password", email: parsed.data.email },
      "Unsuccessful login attempt",
    );
    return null;
  }

  return {
    id: user.id,
    email: user.email,
    name: user.fullName,
    fullName: user.fullName,
    role: user.role,
  };
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: authorizeCredentials,
    }),
  ],
});

export async function requireAuth() {
  const session = await auth();
  if (!session?.user) {
    return null;
  }
  return session.user;
}

export async function requireAdmin() {
  const user = await requireAuth();
  if (!user || user.role !== "ADMIN") {
    return null;
  }
  return user;
}
