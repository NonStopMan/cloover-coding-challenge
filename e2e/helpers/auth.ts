import type { Page } from "@playwright/test";
import { expect } from "@playwright/test";

export const TEST_USER = {
  email: "user@test.com",
  password: "User12345!",
  fullName: "Demo User",
};

export const TEST_ADMIN = {
  email: "admin@test.com",
  password: "Admin123!",
  fullName: "Admin User",
};

export async function login(
  page: Page,
  credentials: { email: string; password: string },
) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(credentials.email);
  await page.getByLabel("Password").fill(credentials.password);
  await page.getByRole("button", { name: "Sign in" }).click();
  await expect(
    page.getByRole("heading", { name: "Solar pre-qualification" }),
  ).toBeVisible();
}

export async function logout(page: Page) {
  console.log("Current URL:", page.url());
  await page.getByRole("button", { name: "Sign out" }).click();
  console.log("Current URL:", page.url());
  await page.waitForURL("**/login");
}

export async function registerAndLogin(
  page: Page,
  data: { fullName: string; email: string; password: string },
) {
  await page.goto("/register");
  await page.getByLabel("Full name").fill(data.fullName);
  await page.getByLabel("Email").fill(data.email);
  await page.getByLabel("Password").fill(data.password);
  await page.getByRole("button", { name: "Register and sign in" }).click();
  await expect(
    page.getByRole("heading", { name: "Solar pre-qualification" }),
  ).toBeVisible();
}
