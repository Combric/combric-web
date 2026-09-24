import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function expectNoAxeViolations(page: Page) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
}

test("desktop navigation and ordinary component documentation work", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Combric" }),
  ).toBeVisible();
  await page.goto("/docs/v1.0.0/components/actions/button/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Button" }),
  ).toBeVisible();
  const buttonDemo = page.locator('[data-demo-id="v1.0.0/button/default"]');
  await expect(
    buttonDemo.getByRole("button", { name: "Save changes" }),
  ).toBeVisible();
  await buttonDemo.getByText("View Code", { exact: true }).click();
  const displayedSource = await buttonDemo
    .locator(".combric-docs-source code")
    .innerText();
  await buttonDemo.getByRole("button", { name: "Copy Code" }).click();
  await expect(buttonDemo.getByRole("status")).toHaveText("Copied.");
  await expect
    .poll(() =>
      page
        .evaluate(() => navigator.clipboard.readText())
        .then((source) => source.replace(/\r\n/g, "\n")),
    )
    .toBe(displayedSource.replace(/\r\n/g, "\n"));
  const disabledDemo = page.locator('[data-demo-id="v1.0.0/button/disabled"]');
  await expect(
    disabledDemo.getByRole("button", { name: "Save changes" }),
  ).toBeDisabled();
  await expectNoAxeViolations(page);
});

test("dialog keyboard dismissal restores focus", async ({ page }) => {
  await page.goto("/docs/v1.0.0/components/overlays/dialog/");
  const trigger = page.getByRole("button", { name: "Open dialog" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expectNoAxeViolations(page);
  await page.keyboard.press("Escape");
  await expect(page.getByRole("dialog")).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("Color Map exposes canonical and derived data", async ({ page }) => {
  await page.goto("/docs/v1.0.0/foundations/colors/");
  await expect(
    page.getByRole("heading", { name: "Primitive palette" }),
  ).toBeVisible();
  await expect(
    page.getByText("color.blue.600", { exact: true }).first(),
  ).toBeVisible();
  await expect(page.getByText("Derived OKLCH", { exact: true })).toBeVisible();
  await expect(
    page.getByText("color.accent.hover", { exact: true }).first(),
  ).toBeVisible();
  await expectNoAxeViolations(page);
});

test("Native CSS and Tailwind previews share canonical tokens and responsive content", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto("/docs/v1.0.0/getting-started/standard-css/");
  const surface = page.locator('[data-comparison-id="foundation-surface"]');
  await expect(
    surface
      .locator(".combric-docs-example")
      .getByText("Canonical token surface"),
  ).toHaveCount(2);
  await expect(surface.locator('[data-demo-id*="tailwind"]')).toContainClass(
    "combric-docs-demo",
  );
  const nativeRadius = await surface
    .locator('[data-demo-id*="native-css"] article')
    .evaluate((node) => getComputedStyle(node).borderRadius);
  const tailwindRadius = await surface
    .locator('[data-demo-id*="tailwind"] article')
    .evaluate((node) => getComputedStyle(node).borderRadius);
  expect(nativeRadius).toBe(tailwindRadius);
  await expectNoAxeViolations(page);

  await page.goto("/docs/v1.0.0/layout/grid/");
  const comparison = page.locator('[data-comparison-id="responsive-grid"]');
  for (const approach of ["native-css", "tailwind"]) {
    const demo = comparison.locator(`[data-demo-id*="${approach}"]`);
    const grid = demo.locator(
      ".combric-docs-example .combric-grid, .combric-docs-example .grid-combric-auto-sm",
    );
    await expect(demo.locator(".combric-docs-example article")).toHaveCount(3);
    const desktopColumns = await grid.evaluate(
      (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
    );
    expect(desktopColumns).toBeGreaterThan(1);
    await page.setViewportSize({ width: 390, height: 844 });
    const mobileColumns = await grid.evaluate(
      (node) => getComputedStyle(node).gridTemplateColumns.split(" ").length,
    );
    expect(mobileColumns).toBe(1);
    await page.setViewportSize({ width: 1280, height: 900 });
  }
  await expectNoAxeViolations(page);
});

test("Playground controls update code and viewport", async ({ page }) => {
  await page.goto("/playground/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Playground" }),
  ).toBeVisible();
  await page.getByLabel("Component family").selectOption("alert");
  await page.getByLabel("Tone").selectOption("error");
  await page.getByLabel("Title").fill("Import failed");
  await expect(page.getByText('tone="error"', { exact: false })).toBeVisible();
  const viewport = page.getByRole("group", { name: "Preview viewport" });
  await viewport.getByText("mobile", { exact: true }).click();
  await expect(viewport.getByLabel("mobile")).toBeChecked();
  const frame = page.getByTitle("Alert preview");
  await expect(frame).toHaveCSS("width", "384px");
  await expect(frame.contentFrame().getByText("Import failed")).toBeVisible();
  await page.getByRole("button", { name: "Reset Playground" }).click();
  await expect(page.getByLabel("desktop")).toBeChecked();
  await expectNoAxeViolations(page);
});

test("versioned documentation, latest routing and selector preserve deep paths", async ({
  page,
}) => {
  await page.goto("/docs/v1.0.0/");
  await expect(
    page.getByRole("combobox", { name: "Documentation version" }),
  ).toHaveValue("/docs/v1.0.0/");
  await expect(
    page.getByRole("option", { name: /v1\.0\.0.*Current/ }),
  ).toHaveCount(1);

  await page.goto("/docs/latest/components/actions/button/");
  await expect(page).toHaveURL(
    /\/docs\/v1\.0\.0\/components\/actions\/button\/?$/,
  );
  await expect(
    page.getByRole("heading", { level: 1, name: "Button" }),
  ).toBeVisible();

  await page.goto("/docs/v9.9.9/components/actions/button/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
});

test("legacy component route redirects to current versioned documentation", async ({
  page,
}) => {
  await page.goto("/components/actions/button/");
  await expect(page).toHaveURL(
    /\/docs\/v1\.0\.0\/components\/actions\/button\/?$/,
  );
  await expect(
    page.getByRole("heading", { level: 1, name: "Button" }),
  ).toBeVisible();
});

test("unknown routes use the accessible 404 page", async ({ page }) => {
  const response = await page.goto("/not-a-real-combric-route/");
  expect(response?.status()).toBe(404);
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
});

test("CLI and Guard documentation matches the published v1.0.0 contracts", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto("/docs/v1.0.0/getting-started/cli/");
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "CLI & Developer Experience",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("@combric/cli@1.0.0", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("Tailwind CSS", { exact: false }).first(),
  ).toBeVisible();
  const cliCopy = page.getByTitle("Copy to clipboard").first();
  await expect(cliCopy).toBeVisible();
  await cliCopy.click();
  await expect(cliCopy).toHaveAttribute("data-copied", "Copied!");
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain("@combric/cli@1.0.0");
  await expectNoAxeViolations(page);

  await page.goto("/docs/v1.0.0/reference/guard/");
  await expect(
    page.getByText("@combric/guard@1.0.0", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("GUARD_SCAN_SKIPPED", { exact: true }),
  ).toBeVisible();
  await expect(page.getByText("Exit 2", { exact: false })).toBeVisible();
  await expectNoAxeViolations(page);
});

test.describe("mobile documentation", () => {
  test.skip(({ isMobile }) => !isMobile, "mobile project only");

  test("mobile navigation opens and remains accessible", async ({ page }) => {
    await page.goto("/docs/v1.0.0/getting-started/");
    const menu = page.getByRole("button", { name: /menu/i }).first();
    await menu.click();
    await expect(
      page.getByRole("link", { name: "Installation", exact: true }),
    ).toBeVisible();
    await expectNoAxeViolations(page);
  });
});
