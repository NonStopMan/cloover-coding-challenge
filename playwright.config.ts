import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  timeout: 5_000,
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? "http://localhost:3000",
    trace: "on-first-retry",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
  webServer: {
    // Ensure migrations and seed run before starting the dev server so the
    // Playwright-launched server matches a manually started server environment.
    command:
      "bash -lc 'set -a && [ -f .env ] && . .env || true && set +a && npm run dev'",

    // "bash -lc 'set -a && [ -f .env ] && . .env || true && set +a && npx prisma migrate deploy || true && npm run db:seed || true && npm run dev'",
    url: "http://localhost:3000/api/health",

    reuseExistingServer: !process.env.CI,
    env: {
      DATABASE_URL:
        process.env.DATABASE_URL ??
        "postgres://postgres:postgres@localhost:5432/postgres",
      AUTH_SECRET: process.env.AUTH_SECRET ?? "dev-secret",
    },
  },
});
