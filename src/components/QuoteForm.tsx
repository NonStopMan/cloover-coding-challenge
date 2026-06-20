"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { quoteInputSchema } from "@/lib/schemas/quote";

type QuoteFormProps = {
  defaultFullName: string;
  defaultEmail: string;
};

export function QuoteForm({ defaultFullName, defaultEmail }: QuoteFormProps) {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrors({});
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      fullName: formData.get("fullName"),
      email: formData.get("email"),
      address: formData.get("address"),
      monthlyConsumptionKwh: formData.get("monthlyConsumptionKwh"),
      systemSizeKw: formData.get("systemSizeKw"),
      downPayment: formData.get("downPayment") || undefined,
    };

    const parsed = quoteInputSchema.safeParse(payload);
    if (!parsed.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0]?.toString() ?? "form";
        fieldErrors[key] = issue.message;
      }
      setErrors(fieldErrors);
      setSubmitting(false);
      return;
    }

    const response = await fetch("/api/quotes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(parsed.data),
    });

    if (!response.ok) {
      const data = await response.json();
      setErrors({ form: data.error ?? "Failed to create quote" });
      setSubmitting(false);
      return;
    }

    const quote = await response.json();
    router.push(`/quotes/${quote.id}`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 rounded-xl border border-zinc-200 bg-white p-6 shadow-sm"
      noValidate
    >
      <div>
        <label htmlFor="fullName" className="mb-1 block text-sm font-medium">
          Full name
        </label>
        <input
          id="fullName"
          name="fullName"
          defaultValue={defaultFullName}
          required
          readOnly
          className="w-full rounded-md border border-zinc-300 px-3 py-2  text-zinc-600  bg-zinc-50"
          aria-invalid={!!errors.fullName}
          aria-describedby={errors.fullName ? "fullName-error" : undefined}
        />
        {errors.fullName && (
          <p id="fullName-error" className="mt-1 text-sm text-red-600">
            {errors.fullName}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          defaultValue={defaultEmail}
          readOnly
          className="w-full rounded-md border border-zinc-200 bg-zinc-50 px-3 py-2 text-zinc-600"
        />
      </div>

      <div>
        <label htmlFor="address" className="mb-1 block text-sm font-medium">
          Address
        </label>
        <input
          id="address"
          name="address"
          required
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
          aria-invalid={!!errors.address}
        />
        {errors.address && (
          <p className="mt-1 text-sm text-red-600">{errors.address}</p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="monthlyConsumptionKwh"
            className="mb-1 block text-sm font-medium"
          >
            Monthly consumption (kWh)
          </label>
          <input
            id="monthlyConsumptionKwh"
            name="monthlyConsumptionKwh"
            type="number"
            min="0"
            step="0.1"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
          {errors.monthlyConsumptionKwh && (
            <p className="mt-1 text-sm text-red-600">
              {errors.monthlyConsumptionKwh}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="systemSizeKw"
            className="mb-1 block text-sm font-medium"
          >
            System size (kW)
          </label>
          <input
            id="systemSizeKw"
            name="systemSizeKw"
            type="number"
            min="0"
            step="0.1"
            required
            className="w-full rounded-md border border-zinc-300 px-3 py-2"
          />
          {errors.systemSizeKw && (
            <p className="mt-1 text-sm text-red-600">{errors.systemSizeKw}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="downPayment" className="mb-1 block text-sm font-medium">
          Down payment (EUR, optional)
        </label>
        <input
          id="downPayment"
          name="downPayment"
          type="number"
          min="0"
          step="0.01"
          className="w-full rounded-md border border-zinc-300 px-3 py-2"
        />
        {errors.downPayment && (
          <p className="mt-1 text-sm text-red-600">{errors.downPayment}</p>
        )}
      </div>

      {errors.form && (
        <p className="text-sm text-red-600" role="alert">
          {errors.form}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-md bg-emerald-600 px-4 py-2.5 font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
      >
        {submitting ? "Calculating..." : "Get pre-qualification"}
      </button>
    </form>
  );
}
