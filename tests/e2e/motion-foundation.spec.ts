import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const motionRoute = "/docs/v1.2.0/foundations/motion/";

async function expectNoVisualMotion(
  locator: import("@playwright/test").Locator,
) {
  await expect
    .poll(() =>
      locator.evaluate((element) => {
        const style = getComputedStyle(element);
        return (
          style.transitionDuration
            .split(",")
            .every((duration) => Number.parseFloat(duration) === 0) &&
          style.animationName === "none"
        );
      }),
    )
    .toBe(true);
}

test("unpublished Motion Foundation is versioned, complete, and accessible", async ({
  page,
}) => {
  await page.goto(motionRoute);
  await expect(
    page.getByRole("heading", { level: 1, name: "Motion" }),
  ).toBeVisible();
  await expect(
    page
      .locator("main blockquote")
      .getByText(/unpublished.*candidate contract/i),
  ).toBeVisible();
  const versionSelector = page.getByRole("combobox", {
    name: "Documentation version",
  });
  await expect(versionSelector).toHaveValue("/docs/v1.2.0/foundations/motion");
  if (test.info().project.name === "chromium") {
    await expect(
      page.getByRole("link", { name: "Motion 1.2.0 candidate" }),
    ).toHaveAttribute("href", /^\/docs\/v1\.2\.0\/foundations\/motion\/?$/);
  }

  for (const text of [
    "--combric-motion-duration-micro",
    "--combric-motion-duration-normal",
    "--combric-motion-easing-enter",
    'data-combric-motion="off"',
    "prefers-reduced-motion: reduce",
    "Checkbox",
    "Radio Group",
  ]) {
    await expect(page.locator("main")).toContainText(text);
  }

  const result = await new AxeBuilder({ page }).analyze();
  expect(result.violations).toEqual([]);
});

test("real Combric demos exercise default, reduced, none, and custom CSS motion", async ({
  page,
}) => {
  await page.goto(motionRoute);
  const demo = page.getByRole("region", { name: "Interactive Motion demo" });
  const root = page.locator("html");
  const mode = (name: string) =>
    demo.getByRole("button", { name, exact: true });
  const openMenu = async () => {
    await demo.getByRole("button", { name: "Motion actions" }).click();
    return page.locator(".combric-motion-demo__menu");
  };

  await expect(mode("Default")).toHaveAttribute("aria-pressed", "true");
  let menu = await openMenu();
  await expect(menu).toHaveCSS("transition-duration", /180ms|0\.18s/);
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);

  await mode("Reduced-motion preview").click();
  menu = await openMenu();
  await expectNoVisualMotion(menu);
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);

  await mode("No motion").click();
  await expect(root).toHaveAttribute("data-combric-motion", "off");
  await demo.getByRole("button", { name: "Open right Drawer" }).click();
  const drawer = page.locator(".combric-motion-demo__drawer");
  await expect(drawer).toHaveAttribute("data-state", "open");
  await expectNoVisualMotion(drawer);
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);

  await mode("Custom CSS").click();
  await expect(root).toHaveAttribute("data-combric-motion-preview", "custom");
  menu = await openMenu();
  await expect(menu).toHaveCSS(
    "transition-duration",
    /450ms, 450ms|0\.45s, 0\.45s/,
  );
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);

  await demo.getByRole("button", { name: "Open right Drawer" }).click();
  await expect(drawer).toHaveAttribute("data-side", "right");
  await expect(drawer).toHaveCSS(
    "transition-duration",
    /450ms, 450ms|0\.45s, 0\.45s/,
  );
  await page.keyboard.press("Escape");
  await expect(drawer).toHaveCount(0);

  await mode("Default").click();
  await expect(root).not.toHaveAttribute("data-combric-motion");
  await expect(root).not.toHaveAttribute("data-combric-motion-preview");
});

test("actual prefers-reduced-motion emulation takes precedence over token defaults", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.addStyleTag({
    content:
      ":root { --combric-motion-duration-micro: 400ms; --combric-motion-duration-normal: 400ms; }",
  });
  await page.goto(motionRoute);
  await page.getByRole("button", { name: "Motion actions" }).click();
  const menu = page.locator(".combric-motion-demo__menu");
  await expectNoVisualMotion(menu);
  await page.keyboard.press("Escape");
  await expect(menu).toHaveCount(0);
});
