import { test, expect } from "@playwright/test";
import { login, TEST_USER } from "./helpers/auth";
import { sampleQuote, submitQuoteForm } from "./helpers/quote";

test("login, create quote, view results and list", async ({ page }) => {
  await login(page, TEST_USER);
  await submitQuoteForm(page, sampleQuote);

  await expect(page).toHaveURL(/\/quotes\/.+/);
  await expect(page.getByText("Pre-qualification result")).toBeVisible();
  await expect(page.getByText("Risk band A")).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "5-year term", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "10-year term", exact: true }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "15-year term", exact: true }),
  ).toBeVisible();

  await page.getByRole("link", { name: "View all quotes" }).click();
  await expect(page).toHaveURL("/quotes");
  await expect(page.getByRole("table")).toContainText("5 kW");
});
