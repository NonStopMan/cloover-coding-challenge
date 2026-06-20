import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/.next/**"],
    coverage: {
      provider: "v8",
      include: ["src/**/*.ts"],
      reporter: ["text", "html"],
      exclude: [
        "**/.next/**",
        "**/node_modules/**",
        "tests/**",
        "src/prisma/**",
        "src/generated/**",
      ],
      thresholds: {
        lines: 50, // Minimum 50% of lines must be covered
        functions: 50, // Minimum 50% of functions must be covered
        branches: 50, // Minimum 50% of branches must be covered
        statements: 50, // Minimum 50% of statements must be covered
        perFile: false, // Applies these thresholds to every file individually
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
