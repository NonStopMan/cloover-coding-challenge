import { test, expect } from "@playwright/test";
import {
  login,
  logout,
  registerAndLogin,
  TEST_USER,
  TEST_ADMIN,
} from "./helpers/auth";

test.describe("Authentication", () => {
  test("redirects unauthenticated users from home to login", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("shows error on invalid credentials", async ({ page }) => {
    await page.goto("/login");
    await page.getByLabel("Email").fill("user@test.com");
    await page.getByLabel("Password").fill("wrong-password");
    await page.getByRole("button", { name: "Sign in" }).click();

    await expect(page.getByText("Invalid email or password")).toBeVisible();
    await expect(page).toHaveURL("/login");
  });

  test("logs in seeded user and shows header", async ({ page }) => {
    await login(page, TEST_USER);

    await expect(page.getByRole("navigation", { name: "Main" })).toContainText(
      TEST_USER.fullName,
    );
    await expect(page.getByRole("link", { name: "My quotes" })).toBeVisible();
    await expect(page.getByRole("link", { name: "Admin" })).not.toBeVisible();
  });

  test("registers a new user and lands on quote form", async ({ page }) => {
    const email = `e2e-${Date.now()}@test.com`;

    await registerAndLogin(page, {
      fullName: "New E2E User",
      email,
      password: "Password123!",
    });

    await expect(
      page.getByRole("heading", { name: "Solar pre-qualification" }),
    ).toBeVisible();
    await expect(page.getByLabel("Email")).toHaveValue(email);
  });

  test.skip("logs out and returns to login", async ({ page }) => {
    await login(page, TEST_USER);
    await logout(page);

    await expect(page.getByRole("heading", { name: "Sign in" })).toBeVisible();
    await page.goto("/");
    await expect(page).toHaveURL(/\/login/);
  });

  test("redirects authenticated users away from login page", async ({
    page,
  }) => {
    await login(page, TEST_USER);
    await page.goto("/login");
    await expect(page).toHaveURL("/");
  });

  test("shows admin nav link for admin users", async ({ page }) => {
    await login(page, TEST_ADMIN);
    await expect(page.getByRole("link", { name: "Admin" })).toBeVisible();
  });
});
