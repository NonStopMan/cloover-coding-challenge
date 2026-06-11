import { test, expect } from "@playwright/test";

test("login, create quote, view results and list", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Email").fill("user@test.com");
  await page.getByLabel("Password").fill("User12345!");
  await page.getByRole("button", { name: "Sign in" }).click();

  await expect(page).toHaveURL("/");

  await page.getByLabel("Full name").fill("E2E User");
  await page.getByLabel("Address").fill("Musterstraße 1, Berlin");
  await page.getByLabel("Monthly consumption (kWh)").fill("420");
  await page.getByLabel("System size (kW)").fill("5");
  await page.getByLabel("Down payment (EUR, optional)").fill("1000");
  await page.getByRole("button", { name: "Get pre-qualification" }).click();

  await expect(page).toHaveURL(/\/quotes\/.+/);
  await expect(page.getByText("Pre-qualification result")).toBeVisible();
  await expect(page.getByText("Risk band A")).toBeVisible();
  await expect(page.getByRole("heading", { name: "5-year term", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "10-year term", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "15-year term", exact: true })).toBeVisible();

  await page.getByRole("link", { name: "View all quotes" }).click();
  await expect(page).toHaveURL("/quotes");
  await expect(page.getByRole("table")).toContainText("5 kW");
});
