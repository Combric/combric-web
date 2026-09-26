import { defineConfig, devices } from "@playwright/test";

const previewPort = Number(process.env.COMBRIC_WEB_E2E_PORT ?? "4337");

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  retries: process.env.CI ? 2 : 0,
  reporter: process.env.CI ? "github" : "list",
  use: {
    baseURL: `http://127.0.0.1:${previewPort}`,
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile-chromium", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "pnpm preview:test",
    port: previewPort,
    env: { PORT: String(previewPort) },
    reuseExistingServer: false,
  },
});
