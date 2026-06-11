import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  ...(process.env.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true },
        },
      }
    : {}),
});

export function logRequest(meta: {
  method: string;
  path: string;
  userId?: string;
  status: number;
  durationMs: number;
}) {
  logger.info(meta, "request completed");
}

export function logError(error: unknown, context?: Record<string, unknown>) {
  logger.error({ err: error, ...context }, "request failed");
}
