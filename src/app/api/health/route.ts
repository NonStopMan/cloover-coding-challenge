import { logRequest } from "@/lib/logger";

export async function GET() {
  const started = Date.now();
  const response = Response.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });

  logRequest({
    method: "GET",
    path: "/api/health",
    status: 200,
    durationMs: Date.now() - started,
  });

  return response;
}
