import { z } from "zod";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";

extendZodWithOpenApi(z);

export const registerSchema = z
  .object({
  fullName: z.string().trim().min(1, "Full name is required"),
  email: z.string().trim().email("Valid email is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  })
  .openapi("RegisterInput");

export const loginSchema = z.object({
  email: z.string().trim().email("Valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export const quoteInputSchema = z
  .object({
    fullName: z.string().trim().min(1, "Full name is required"),
    email: z.string().trim().email("Valid email is required"),
    address: z.string().trim().min(1, "Address is required"),
    monthlyConsumptionKwh: z.coerce
      .number()
      .positive("Monthly consumption must be greater than 0"),
    systemSizeKw: z.coerce
      .number()
      .positive("System size must be greater than 0"),
    downPayment: z.coerce.number().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    const systemPrice = data.systemSizeKw * 1200;
    const downPayment = data.downPayment ?? 0;
    if (downPayment > systemPrice) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Down payment cannot exceed system price",
        path: ["downPayment"],
      });
    }
  });

export const offerSchema = z.object({
  termYears: z.number(),
  apr: z.number(),
  principalUsed: z.number(),
  monthlyPayment: z.number(),
});

export const quoteInputsSchema = z.object({
  fullName: z.string(),
  email: z.string(),
  address: z.string(),
  monthlyConsumptionKwh: z.number(),
  systemSizeKw: z.number(),
  downPayment: z.number(),
});

export const quoteResponseSchema = z.object({
  id: z.string(),
  inputs: quoteInputsSchema,
  derived: z.object({
    systemPrice: z.number(),
    principal: z.number(),
    riskBand: z.enum(["A", "B", "C"]),
    apr: z.number(),
  }),
  offers: z.array(offerSchema),
  createdAt: z.string(),
});

export type QuoteInput = z.infer<typeof quoteInputSchema>;
export type QuoteResponse = z.infer<typeof quoteResponseSchema>;
