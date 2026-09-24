import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  currentDocumentationVersion,
  docsRoute,
} from "../../src/data/versions";

const releaseSurfaces = [
  "/",
  docsRoute(currentDocumentationVersion),
  docsRoute(currentDocumentationVersion, "components/actions/button"),
  docsRoute(currentDocumentationVersion, "accessibility"),
  "/playground/",
];

async function expectAccessible(page: import("@playwright/test").Page) {
  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
}

for (const theme of ["light", "dark", "system"] as const) {
  test(`${theme} theme release accessibility matrix`, async ({
    page,
    isMobile,
  }) => {
    const systemScheme = theme === "light" ? "light" : "dark";
    await page.emulateMedia({ colorScheme: systemScheme });
    await page.goto(docsRoute(currentDocumentationVersion));

    if (!isMobile) {
      const themePicker = page.getByRole("combobox", { name: "Select theme" });
      await expect(themePicker).toBeVisible();
      await themePicker.selectOption(theme === "system" ? "auto" : theme);
    }
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      systemScheme,
    );

    for (const route of releaseSurfaces) {
      await page.goto(route);
      await expect(page.locator("main")).toBeVisible();
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(
        dimensions.clientWidth,
      );
      await expectAccessible(page);
    }

    if (theme === "system") {
      await page.emulateMedia({ colorScheme: "light" });
      await page.goto(docsRoute(currentDocumentationVersion));
      await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
      await expectAccessible(page);
    }
  });
}

test("mobile dark-mode navigation, search, catalogue overlay, and Playground remain accessible", async ({
  page,
  isMobile,
}) => {
  test.skip(!isMobile, "responsive release checks run in mobile Chromium");
  await page.emulateMedia({ colorScheme: "dark" });

  await page.goto(docsRoute(currentDocumentationVersion, "getting-started"));
  const menu = page.getByRole("button", { name: /menu/i }).first();
  await menu.click();
  await expect(
    page.getByRole("link", { name: "Installation", exact: true }),
  ).toBeVisible();
  await expectAccessible(page);
  await page.keyboard.press("Escape");
  await expect(menu).toBeFocused();

  await page.goto(docsRoute(currentDocumentationVersion));
  const search = page.getByRole("button", { name: /search/i }).first();
  await search.click();
  const searchDialog = page.getByRole("dialog");
  await expect(searchDialog).toBeVisible();
  await searchDialog
    .getByRole("textbox", { name: "Search documentation" })
    .fill("Guard");
  await expect(
    searchDialog.getByRole("link", { name: /Guard/ }).first(),
  ).toBeVisible();
  await expectAccessible(page);

  await page.goto(
    docsRoute(currentDocumentationVersion, "components/overlays/dialog"),
  );
  const trigger = page.getByRole("button", { name: "Open dialog" });
  await trigger.click();
  await expect(page.getByRole("dialog")).toBeVisible();
  await expectAccessible(page);
  await page.keyboard.press("Escape");
  await expect(trigger).toBeFocused();

  await page.goto("/playground/");
  await expect(page.locator(".combric-playground")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  await expectAccessible(page);
  const dimensions = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }));
  expect(dimensions.scrollWidth).toBeLessThanOrEqual(dimensions.clientWidth);
});
