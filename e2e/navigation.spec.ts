import { test, expect } from "@playwright/test";
import { login, TEST_USER } from "./helpers/auth";

test.describe("Navigation", () => {
  test("header links navigate between main pages", async ({ page }) => {
    await login(page, TEST_USER);

    await page.getByRole("link", { name: "My quotes" }).click();
    await expect(page).toHaveURL("/quotes");

    await page.getByRole("link", { name: "New quote" }).click();
    await expect(page).toHaveURL("/");
    await expect(
      page.getByRole("heading", { name: "Solar pre-qualification" }),
    ).toBeVisible();

    await page.getByRole("link", { name: "API docs" }).click();
    console.log("Current URL after clicking API docs link:", page.url());
    await expect(page).toHaveURL("/api-docs");
    await expect(
      page.getByRole("heading", { name: "API documentation" }),
    ).toBeVisible();
  });

  test("GreenQuote logo returns to home", async ({ page }) => {
    await login(page, TEST_USER);
    await page.getByRole("link", { name: "My quotes" }).click();
    await page.getByRole("link", { name: "GreenQuote" }).click();
    await expect(page).toHaveURL("/");
  });
});
