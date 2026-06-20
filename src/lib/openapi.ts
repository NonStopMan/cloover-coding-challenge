import {
  OpenAPIRegistry,
  OpenApiGeneratorV3,
} from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import {
  offerSchema,
  quoteInputSchema,
  quoteResponseSchema,
  registerSchema,
} from "@/lib/schemas/quote";

const registry = new OpenAPIRegistry();

registry.register("QuoteInput", quoteInputSchema);
registry.register("QuoteResponse", quoteResponseSchema);
registry.register("Offer", offerSchema);
registry.register("RegisterInput", registerSchema);

registry.registerPath({
  method: "get",
  path: "/api/health",
  summary: "Health check",
  responses: {
    200: {
      description: "Service is healthy",
      content: {
        "application/json": {
          schema: z.object({
            status: z.string(),
            timestamp: z.string(),
          }),
        },
      },
    },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/auth/register",
  summary: "Register a new user",
  request: {
    body: {
      content: { "application/json": { schema: registerSchema } },
    },
  },
  responses: {
    201: { description: "User created" },
    400: { description: "Validation error" },
    409: { description: "Email already registered" },
  },
});

registry.registerPath({
  method: "post",
  path: "/api/quotes",
  summary: "Create a pre-qualification quote",
  request: {
    body: {
      content: { "application/json": { schema: quoteInputSchema } },
    },
  },
  responses: {
    201: {
      description: "Quote created",
      content: {
        "application/json": { schema: quoteResponseSchema },
      },
    },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/quotes",
  summary: "List quotes for current user or all quotes for admin",
  responses: {
    200: { description: "Quote list" },
    401: { description: "Unauthorized" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/quotes/{id}",
  summary: "Get a quote by ID",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: {
      description: "Quote details",
      content: {
        "application/json": { schema: quoteResponseSchema },
      },
    },
    403: { description: "Forbidden" },
    404: { description: "Not found" },
  },
});

registry.registerPath({
  method: "get",
  path: "/api/quotes/{id}/pdf",
  summary: "Download quote as PDF",
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: {
    200: { description: "PDF file" },
    403: { description: "Forbidden" },
    404: { description: "Not found" },
  },
});

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions);
  return generator.generateDocument({
    openapi: "3.1.0",
    info: {
      title: "GreenQuote API",
      version: "1.0.0",
      description: "Solar financing pre-qualification API",
    },
    servers: [{ url: process.env.NEXTAUTH_URL ?? "http://localhost:3000" }],
  });
}
