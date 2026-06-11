import { test, expect } from "@playwright/test";
import { login, TEST_USER } from "./helpers/auth";
import { sampleQuote, submitQuoteForm } from "./helpers/quote";

test.describe("Quote form validation", () => {
  test.beforeEach(async ({ page }) => {
    await login(page, TEST_USER);
  });

  test("shows validation errors when required fields are missing", async ({ page }) => {
    await page.getByLabel("Full name").clear();
    await page.getByRole("button", { name: "Get pre-qualification" }).click();

    await expect(page.getByText("Full name is required")).toBeVisible();
    await expect(page.getByText("Address is required")).toBeVisible();
  });

  test("shows error when down payment exceeds system price", async ({ page }) => {
    await submitQuoteForm(page, {
      ...sampleQuote,
      systemSizeKw: "5",
      downPayment: "10000",
    });

    await expect(
      page.getByText("Down payment cannot exceed system price"),
    ).toBeVisible();
    await expect(page).toHaveURL("/");
  });

  test("pre-fills email from session and keeps it read-only", async ({ page }) => {
    const emailField = page.getByLabel("Email");
    await expect(emailField).toHaveValue(TEST_USER.email);
    await expect(emailField).toHaveAttribute("readonly", "");
  });
});

test.describe("Quote results", () => {
  test("displays band C for low consumption quote", async ({ page }) => {
    await login(page, TEST_USER);

    await submitQuoteForm(page, {
      fullName: "Low Usage User",
      address: "Hamburg, DE",
      monthlyConsumptionKwh: "100",
      systemSizeKw: "4",
    });

    await expect(page).toHaveURL(/\/quotes\/.+/);
    await expect(page.getByText("Risk band C")).toBeVisible();
    await expect(page.getByText("APR 11.9%").first()).toBeVisible();
  });

  test("download PDF link is present on results page", async ({ page }) => {
    await login(page, TEST_USER);
    await submitQuoteForm(page, sampleQuote);
    await expect(page).toHaveURL(/\/quotes\/.+/);

    const downloadLink = page.getByRole("link", { name: "Download PDF" });
    await expect(downloadLink).toBeVisible();
    await expect(downloadLink).toHaveAttribute("href", /\/api\/quotes\/.+\/pdf/);
  });
});
