import { test, expect } from "@playwright/test";
import { login, TEST_USER, TEST_ADMIN } from "./helpers/auth";
import { sampleQuote, submitQuoteForm } from "./helpers/quote";

test.describe("My quotes page", () => {
  test("shows empty state when user has no quotes in session", async ({
    page,
  }) => {
    const email = `quotes-empty-${Date.now()}@test.com`;

    await page.goto("/register");
    await page.getByLabel("Full name").fill("Empty Quotes User");
    await page.getByLabel("Email").fill(email);
    await page.getByLabel("Password").fill("Password123!");
    await page.getByRole("button", { name: "Register and sign in" }).click();
    await page.waitForURL("/");

    await page.getByRole("link", { name: "My quotes" }).click();
    await expect(page).toHaveURL("/quotes");
    await expect(page.getByText("No quotes yet.")).toBeVisible();
    await expect(
      page.getByRole("link", { name: "Create your first quote" }),
    ).toBeVisible();
  });

  test("lists quote after creation and links to detail", async ({ page }) => {
    await login(page, TEST_USER);
    await submitQuoteForm(page, sampleQuote);
    await expect(page).toHaveURL(/\/quotes\/.+/);
    const quoteUrl = page.url();

    await page.getByRole("link", { name: "View all quotes" }).click();
    await expect(page.getByRole("table")).toContainText("5 kW");

    await page
      .getByRole("row")
      .nth(1)
      .getByRole("link", { name: "View" })
      .click();
    await expect(page).toHaveURL(/\/quotes\/.+/);
    await expect(page.getByText("Pre-qualification result")).toBeVisible();
    await expect(page.url()).toBe(quoteUrl);
  });
});

test.describe("Admin quotes page", () => {
  test("redirects regular users away from admin", async ({ page }) => {
    await login(page, TEST_USER);
    await page.goto("/admin/quotes");
    await expect(page).toHaveURL("/");
  });

  test("admin can view all quotes and filter by email", async ({ page }) => {
    await login(page, TEST_USER);
    await submitQuoteForm(page, {
      ...sampleQuote,
      fullName: "Admin Filter Target",
    });
    await expect(page).toHaveURL(/\/quotes\/.+/);

    await page.getByRole("button", { name: "Sign out" }).click();
    await page.waitForURL("**/login");

    await login(page, TEST_ADMIN);
    await page.getByRole("link", { name: "Admin" }).click();
    await expect(page).toHaveURL("/admin/quotes");
    await expect(
      page.getByRole("heading", { name: "Admin — All quotes" }),
    ).toBeVisible();

    await page.getByLabel("Search by name or email").fill("user@test.com");
    await page.getByRole("button", { name: "Filter" }).click();

    await expect(page.getByRole("table")).toContainText("Demo User");
    await expect(page.getByRole("table")).toContainText("user@test.com");
  });
});
