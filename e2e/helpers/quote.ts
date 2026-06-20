import type { Page } from "@playwright/test";

export type QuoteFormData = {
  fullName: string;
  address: string;
  monthlyConsumptionKwh: string;
  systemSizeKw: string;
  downPayment?: string;
};

export async function submitQuoteForm(page: Page, data: QuoteFormData) {
  await page.getByLabel("Address").fill(data.address);
  await page
    .getByLabel("Monthly consumption (kWh)")
    .fill(data.monthlyConsumptionKwh);
  await page.getByLabel("System size (kW)").fill(data.systemSizeKw);

  if (data.downPayment !== undefined) {
    await page
      .getByLabel("Down payment (EUR, optional)")
      .fill(data.downPayment);
  }

  await page.getByRole("button", { name: "Get pre-qualification" }).click();
}

export const sampleQuote: QuoteFormData = {
  fullName: "E2E User",
  address: "Musterstraße 1, Berlin",
  monthlyConsumptionKwh: "420",
  systemSizeKw: "5",
  downPayment: "1000",
};
