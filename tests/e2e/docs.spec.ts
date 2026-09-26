import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";
import { catalogue, catalogueRoute } from "../../src/data/catalogue";
import {
  currentDocumentationVersion,
  documentationVersions,
  docsRoute,
  latestRoute,
} from "../../src/data/versions";

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
  await buttonDemo.getByRole("button", { name: "View code" }).click();
  const displayedSource = await buttonDemo
    .locator(".combric-demo-actions__source code")
    .innerText();
  await buttonDemo.getByRole("button", { name: "Copy code" }).click();
  await expect(buttonDemo.getByRole("status")).toHaveText("Code copied.");
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

test("demo Copy code falls back when clipboard permission is denied", async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.assign(window, {
      __combricClipboardAttempted: false,
      __combricExecCommandCalled: false,
    });
    Object.defineProperty(Navigator.prototype, "clipboard", {
      configurable: true,
      get: () => ({
        writeText: async () => {
          Object.assign(window, { __combricClipboardAttempted: true });
          throw new Error("Clipboard permission denied");
        },
      }),
    });
    Object.defineProperty(Document.prototype, "execCommand", {
      configurable: true,
      value: (command: string) => {
        Object.assign(window, { __combricExecCommandCalled: true });
        const area = document.querySelector('textarea[aria-hidden="true"]');
        if (command !== "copy" || !(area instanceof HTMLTextAreaElement))
          return false;
        Object.assign(window, { __combricCopiedText: area.value });
        return true;
      },
    });
  });

  await page.goto(
    catalogueRoute(
      currentDocumentationVersion,
      catalogue.find((item) => item.slug === "button")!,
    ),
  );
  const demo = page.locator(
    `[data-demo-id="${currentDocumentationVersion.id}/button/default"]`,
  );
  const displayedSource = await demo
    .locator(".combric-demo-actions__source code")
    .textContent();
  expect(displayedSource).not.toBeNull();
  await demo.getByRole("button", { name: "Copy code" }).click();
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as Window & {
              __combricClipboardAttempted?: boolean;
              __combricExecCommandCalled?: boolean;
            }
          ).__combricClipboardAttempted,
      ),
    )
    .toBe(true);
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (
            window as Window & {
              __combricExecCommandCalled?: boolean;
            }
          ).__combricExecCommandCalled,
      ),
    )
    .toBe(true);
  await expect(demo.getByRole("status")).toHaveText("Code copied.");
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as Window & { __combricCopiedText?: string })
            .__combricCopiedText,
      ),
    )
    .toBe(displayedSource);
});

test("catalogue exposes real sections, navigation and representative public coverage", async ({
  page,
  isMobile,
}) => {
  await page.goto("/docs/v1.0.0/components/actions/button/");
  const toc = page.getByRole("navigation", { name: /On this page/ });
  if (isMobile) await page.locator("#starlight__mobile-toc summary").click();
  for (const section of [
    "Import and usage",
    "Examples",
    "Public API",
    "Accessibility",
    "Keyboard",
    "CSS and customization",
    "Source",
  ]) {
    await expect(toc.getByRole("link", { name: section })).toBeVisible();
  }
  if (isMobile) await page.getByText("Explore", { exact: true }).click();
  const mainNav = page.getByRole("navigation", { name: "Main navigation" });
  await expect(mainNav.getByRole("link", { name: "Docs" })).toBeVisible();
  await expect(
    mainNav.getByRole("link", { name: "Components" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    mainNav.getByRole("link", { name: "Playground" }),
  ).toHaveAttribute("href", "/playground/");
  if (isMobile) {
    await expect(mainNav.getByRole("link", { name: "GitHub" })).toHaveAttribute(
      "href",
      "https://github.com/Combric/combric",
    );
  }
  await expect(
    page
      .locator('[data-demo-id="v1.0.0/button/variants"]')
      .getByRole("button", {
        name: "Primary",
      }),
  ).toBeVisible();
  await expect(
    page
      .locator('[data-demo-id="v1.0.0/button/variants"]')
      .getByRole("button", {
        name: "Secondary",
      }),
  ).toBeVisible();
  await expect(
    page
      .locator('[data-demo-id="v1.0.0/button/variants"]')
      .getByRole("button", {
        name: "Ghost",
      }),
  ).toBeVisible();
  await expect(
    page.locator('[data-demo-id="v1.0.0/button/sizes"]').getByRole("button", {
      name: "Large",
    }),
  ).toBeVisible();
  await expectNoAxeViolations(page);
});

test("homepage feature cards align and stack as one rhythm", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Viewport changes are covered in the desktop browser");
  const cards = page.locator(".combric-home-principles > article");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/");
  const desktop = await cards.evaluateAll((articles) =>
    articles.map((article) => {
      const heading = article.querySelector("h3");
      const articleRect = article.getBoundingClientRect();
      const headingRect = heading!.getBoundingClientRect();
      return {
        top: articleRect.top,
        headingTop: headingRect.top,
        width: articleRect.width,
      };
    }),
  );
  expect(desktop).toHaveLength(3);
  expect(
    Math.max(...desktop.map(({ top }) => top)) -
      Math.min(...desktop.map(({ top }) => top)),
  ).toBeLessThanOrEqual(1);
  expect(
    Math.max(...desktop.map(({ headingTop }) => headingTop)) -
      Math.min(...desktop.map(({ headingTop }) => headingTop)),
  ).toBeLessThanOrEqual(1);

  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await cards.evaluateAll((articles) =>
    articles.map((article) => {
      const rect = article.getBoundingClientRect();
      return { x: rect.x, y: rect.y, width: rect.width };
    }),
  );
  expect(mobile).toHaveLength(3);
  expect(new Set(mobile.map(({ x }) => Math.round(x))).size).toBe(1);
  expect(mobile[0]!.y).toBeLessThan(mobile[1]!.y);
  expect(mobile[1]!.y).toBeLessThan(mobile[2]!.y);
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(
    390,
  );
});

test("wide documentation layout gives space back to content, not the TOC", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Wide desktop layout only");
  const measure = async () =>
    page.evaluate(() => {
      const box = (selector: string) => {
        const rect = document.querySelector(selector)!.getBoundingClientRect();
        return { x: rect.x, width: rect.width, right: rect.right };
      };
      return {
        left: box(".sidebar-pane"),
        content: box(".main-pane .sl-container"),
        toc: box(".right-sidebar-panel .sl-container"),
        scrollWidth: document.documentElement.scrollWidth,
      };
    });

  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/v1.0.0/components/actions/button/");
  const wide = await measure();
  expect(wide.toc.width).toBeLessThanOrEqual(192);
  expect(wide.content.width).toBeGreaterThanOrEqual(740);
  expect(wide.content.right).toBeLessThanOrEqual(wide.toc.x);
  expect(wide.scrollWidth).toBe(1440);

  await page.setViewportSize({ width: 1280, height: 900 });
  const compactDesktop = await measure();
  expect(compactDesktop.toc.width).toBeLessThanOrEqual(192);
  expect(compactDesktop.content.width).toBeGreaterThanOrEqual(720);
  expect(compactDesktop.content.right).toBeLessThanOrEqual(
    compactDesktop.toc.x,
  );
  expect(compactDesktop.scrollWidth).toBe(1280);
});

test("canonical demo shell keeps natural controls compact and form fields aligned", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop component geometry check");
  await page.setViewportSize({ width: 1440, height: 900 });

  await page.goto("/docs/v1.0.0/components/data-display/badge/");
  const badgePreview = page.locator(
    '[data-demo-id="v1.0.0/badge/default"] .combric-docs-example',
  );
  const badge = badgePreview.locator(".combric-badge");
  await expect(badge).toBeVisible();
  expect((await badge.boundingBox())!.width).toBeLessThan(
    (await badgePreview.boundingBox())!.width / 2,
  );
  await expectNoAxeViolations(page);

  await page.goto("/docs/v1.0.0/components/overlays/dialog/");
  const dialogPreview = page.locator(
    '[data-demo-id="v1.0.0/dialog/default"] .combric-docs-example',
  );
  const dialogTrigger = dialogPreview.getByRole("button", {
    name: "Open dialog",
  });
  expect((await dialogTrigger.boundingBox())!.width).toBeLessThan(
    (await dialogPreview.boundingBox())!.width / 2,
  );
  await expectNoAxeViolations(page);

  await page.goto("/docs/v1.0.0/components/forms/input/");
  const inputPreview = page.locator(
    '[data-demo-id="v1.0.0/input/default"] .combric-docs-example',
  );
  const input = inputPreview.getByRole("textbox");
  expect((await input.boundingBox())!.width).toBeGreaterThan(
    (await inputPreview.boundingBox())!.width * 0.9,
  );
  await expectNoAxeViolations(page);

  for (const [path, demoId, selector] of [
    [
      "/docs/v1.0.0/components/forms/field/",
      "v1.0.0/field/default",
      ".combric-field",
    ],
    [
      "/docs/v1.0.0/components/forms/fieldset/",
      "v1.0.0/fieldset/default",
      ".combric-fieldset",
    ],
    [
      "/docs/v1.0.0/components/forms/input-group/",
      "v1.0.0/input-group/default",
      ".combric-input-group",
    ],
    [
      "/docs/v1.0.0/components/data-display/card/",
      "v1.0.0/card/default",
      ".combric-card",
    ],
    [
      "/docs/v1.0.0/components/data-display/table/",
      "v1.0.0/table/default",
      ".combric-table-container",
    ],
    [
      "/docs/v1.0.0/components/data-display/description-list/",
      "v1.0.0/description-list/default",
      ".combric-description-list",
    ],
    [
      "/docs/v1.0.0/components/feedback/alert/",
      "v1.0.0/alert/default",
      ".combric-alert",
    ],
    [
      "/docs/v1.0.0/components/feedback/empty-state/",
      "v1.0.0/empty-state/default",
      ".combric-empty-state",
    ],
    [
      "/docs/v1.0.0/components/feedback/skeleton/",
      "v1.0.0/skeleton/default",
      ".combric-skeleton",
    ],
    ["/docs/v1.0.0/layout/grid/", "v1.0.0/layout/grid", ".combric-grid"],
    ["/docs/v1.0.0/layout/stack/", "v1.0.0/layout/stack", ".combric-stack"],
  ] as const) {
    await page.goto(path);
    const preview = page.locator(
      `[data-demo-id="${demoId}"] .combric-docs-example`,
    );
    const surface = preview.locator(selector);
    await expect(surface).toBeVisible();
    expect((await surface.boundingBox())!.width).toBeGreaterThan(
      (await preview.boundingBox())!.width * 0.9,
    );
  }
});

test("Avatar fallback is deterministic and size comparisons share a baseline", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Desktop component geometry check");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/v1.0.0/components/data-display/avatar/");

  const primary = page.locator('[data-demo-id="v1.0.0/avatar/default"]');
  await expect(primary.getByText("AD", { exact: true })).toBeVisible();
  await expect(primary.locator("img")).toHaveCount(0);
  await primary.getByRole("button", { name: "View code" }).click();
  const source = await primary
    .locator(".combric-demo-actions__source code")
    .innerText();
  expect(source).toContain("<AvatarFallback>AD</AvatarFallback>");
  expect(source).not.toContain("missing-avatar");

  const avatars = page.locator(
    '[data-demo-id="v1.0.0/avatar/sizes"] .combric-avatar',
  );
  await expect(avatars).toHaveCount(3);
  const sizes = await avatars.evaluateAll((items) =>
    items.map((item) => {
      const rect = item.getBoundingClientRect();
      return { width: rect.width, height: rect.height, bottom: rect.bottom };
    }),
  );
  expect(sizes[0]!.width).toBeLessThan(sizes[1]!.width);
  expect(sizes[1]!.width).toBeLessThan(sizes[2]!.width);
  expect(
    Math.max(...sizes.map(({ bottom }) => bottom)) -
      Math.min(...sizes.map(({ bottom }) => bottom)),
  ).toBeLessThanOrEqual(1);
  await expectNoAxeViolations(page);
});

test("Button sizes share a comparison baseline", async ({ page, isMobile }) => {
  test.skip(isMobile, "Desktop component geometry check");
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto("/docs/v1.0.0/components/actions/button/");
  const buttons = page.locator(
    '[data-demo-id="v1.0.0/button/sizes"] .combric-button',
  );
  const boxes = await buttons.evaluateAll((items) =>
    items.map((item) => {
      const rect = item.getBoundingClientRect();
      return { height: rect.height, bottom: rect.bottom };
    }),
  );
  expect(boxes).toHaveLength(3);
  expect(boxes[0]!.height).toBeLessThan(boxes[1]!.height);
  expect(boxes[1]!.height).toBeLessThan(boxes[2]!.height);
  expect(
    Math.max(...boxes.map(({ bottom }) => bottom)) -
      Math.min(...boxes.map(({ bottom }) => bottom)),
  ).toBeLessThanOrEqual(1);
});

test("Framework 1.1 Button, Card, and Slider capabilities match the public package", async ({
  page,
}) => {
  const version = currentDocumentationVersion.id;

  await page.goto(
    docsRoute(currentDocumentationVersion, "components/actions/button"),
  );
  await expect(page.locator(".combric-docs-api-contracts")).toContainText(
    "primary | secondary | ghost | accent | danger",
  );
  const buttonRadii = page.locator(
    `[data-demo-id="${version}/button/radius-presets"] .combric-button`,
  );
  await expect(buttonRadii).toHaveCount(6);
  expect(
    await buttonRadii.evaluateAll((items) =>
      items.map((item) => getComputedStyle(item).borderTopLeftRadius),
    ),
  ).toEqual(["4px", "0px", "2px", "4px", "8px", "9999px"]);

  const newVariants = page.locator(
    `[data-demo-id="${version}/button/new-variants"] .combric-button`,
  );
  await expect(newVariants).toHaveText(["Accent", "Danger"]);

  await page.goto(
    docsRoute(currentDocumentationVersion, "components/data-display/card"),
  );
  await expect(page.locator(".combric-docs-api-contracts")).toContainText(
    "surface | muted | elevated",
  );
  const cardRadii = page.locator(
    `[data-demo-id="${version}/card/radius-presets"] .combric-card`,
  );
  await expect(cardRadii).toHaveCount(6);
  expect(
    await cardRadii.evaluateAll((items) =>
      items.map((item) => getComputedStyle(item).borderTopLeftRadius),
    ),
  ).toEqual(["4px", "0px", "2px", "4px", "8px", "9999px"]);
  await expect(
    page.locator(`[data-demo-id="${version}/card/tones"] .combric-card`),
  ).toHaveCount(3);

  await page.goto(
    docsRoute(currentDocumentationVersion, "components/forms/slider"),
  );
  const sliders = page.locator(
    `[data-demo-id="${version}/slider/fill-ranges"] .combric-slider`,
  );
  await expect(sliders).toHaveCount(6);
  expect(
    await sliders.evaluateAll((items) =>
      items.map((item) => item.style.getPropertyValue("--combric-slider-fill")),
    ),
  ).toEqual(["0%", "25%", "50%", "75%", "100%", "50%"]);
  const quarter = sliders.nth(1);
  await quarter.focus();
  await quarter.press("ArrowRight");
  await expect(quarter).toHaveJSProperty("value", "26");
  await expect
    .poll(() =>
      quarter.evaluate((item) =>
        item.style.getPropertyValue("--combric-slider-fill"),
      ),
    )
    .toBe("26%");
});

test("Tabs demo scopes a square radius through the public control token", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const version = currentDocumentationVersion.id;
  await page.goto(
    docsRoute(currentDocumentationVersion, "components/navigation/tabs"),
  );

  const demo = page.locator(`[data-demo-id="${version}/tabs/default"]`);
  const triggers = demo.getByRole("tab");
  await expect(triggers).toHaveCount(3);
  expect(
    await triggers.evaluateAll((items) =>
      items.map((item) => getComputedStyle(item).borderRadius),
    ),
  ).toEqual(["0px", "0px", "0px"]);
  const expectAlignedLabels = async () => {
    const labelTops = await triggers.evaluateAll((items) =>
      items.map((item) => {
        const range = document.createRange();
        range.selectNodeContents(item);
        return range.getBoundingClientRect().top;
      }),
    );
    expect(Math.max(...labelTops) - Math.min(...labelTops)).toBeLessThanOrEqual(
      1,
    );
  };
  await expectAlignedLabels();

  await triggers.nth(1).click();
  await expect(triggers.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(triggers.nth(1)).toHaveCSS("border-radius", "0px");
  await expectAlignedLabels();

  await demo.getByRole("button", { name: "View code" }).click();
  const displayedSource = await demo
    .locator(".combric-demo-actions__source code")
    .innerText();
  expect(displayedSource).toContain('"--combric-radius-control": "0"');

  await demo.getByRole("button", { name: "Copy code" }).click();
  await expect(demo.getByRole("status")).toHaveText("Code copied.");
  await expect
    .poll(() =>
      page
        .evaluate(() => navigator.clipboard.readText())
        .then((source) => source.replace(/\r\n/g, "\n")),
    )
    .toBe(displayedSource.replace(/\r\n/g, "\n"));
  await expectNoAxeViolations(page);
});

test("Framework 1.1 semantic palette maps light and dark component tokens", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "Theme picker contrast values are checked on desktop");
  await page.goto(docsRoute(currentDocumentationVersion));
  const tokenValue = (name: string) =>
    page
      .locator("html")
      .evaluate(
        (element, variable) =>
          getComputedStyle(element)
            .getPropertyValue(variable)
            .trim()
            .toLowerCase(),
        name,
      );

  expect(await tokenValue("--combric-color-canvas")).toBe("#f2f0ea");
  expect(await tokenValue("--combric-color-accent")).toBe("#e64a2e");
  await page
    .getByRole("combobox", { name: "Select theme" })
    .first()
    .selectOption("dark");
  expect(await tokenValue("--combric-color-canvas")).toBe("#171816");
  expect(await tokenValue("--combric-color-accent")).toBe("#ff7a61");
  expect(await tokenValue("--combric-color-border")).toBe("#7f827a");
  await expectNoAxeViolations(page);
});

test("all current catalogue families render at desktop, tablet, and mobile widths", async ({
  page,
}) => {
  const pageErrors: string[] = [];
  page.on("pageerror", (error) => pageErrors.push(error.message));

  for (const item of catalogue) {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(catalogueRoute(currentDocumentationVersion, item));
    await expect(page.locator("main h1").first()).toHaveText(item.title);
    const demos = page.locator(".combric-docs-demo");
    await expect(demos.first()).toBeVisible();

    for (const width of [1440, 768, 390]) {
      await page.setViewportSize({ width, height: 900 });
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(
        dimensions.scrollWidth,
        `${item.title} must not overflow at ${width}px`,
      ).toBeLessThanOrEqual(dimensions.clientWidth);
    }
  }

  expect(pageErrors).toEqual([]);
});

test("official brand mark is visible in the native documentation header", async ({
  page,
}) => {
  await page.goto("/docs/v1.0.0/");
  const homeLink = page.getByRole("link", { name: /Combric/ }).first();
  await expect(homeLink).toHaveAttribute("href", "/");
  await expect(
    homeLink.getByRole("img", { name: "Combric mark" }),
  ).toBeVisible();
  await expectNoAxeViolations(page);
});

test("assertive Toast example opens on demand without overlapping previews", async ({
  page,
}) => {
  await page.goto("/docs/v1.0.0/components/feedback/toast/");
  const demo = page.locator('[data-demo-id="v1.0.0/toast/assertive"]');
  await demo.getByRole("button", { name: "Show urgent notification" }).click();
  const viewport = page.getByRole("list", {
    name: "Urgent notifications",
    exact: true,
  });
  await expect(viewport).toBeVisible();
  await expect(viewport.getByRole("alert")).toContainText("Connection lost");
});

test("theme control supports light, dark, system preference and persistence", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "theme picker is a desktop header control");
  await page.emulateMedia({ colorScheme: "dark" });
  await page.goto("/docs/v1.0.0/");
  const theme = page.getByRole("combobox", { name: "Select theme" });
  await expect(theme).toBeVisible();
  await expect(theme.locator("option", { hasText: "System" })).toHaveCount(1);
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await theme.selectOption("light");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await theme.selectOption("dark");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await expectNoAxeViolations(page);
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await theme.selectOption("auto");
  await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
  await page.emulateMedia({ colorScheme: "light" });
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  await expectNoAxeViolations(page);
});

test("native search returns versioned documentation and navigates to the result", async ({
  page,
}) => {
  await page.goto("/docs/v1.0.0/");
  const searchButton = page.getByRole("button", { name: /search/i }).first();
  await expect(searchButton).toBeVisible();
  await searchButton.click();
  const searchDialog = page.getByRole("dialog");
  await expect(searchDialog).toBeVisible();
  const searchInput = searchDialog.getByRole("textbox", {
    name: "Search documentation",
  });
  await searchInput.fill("Guard");
  const result = searchDialog.getByRole("link", { name: /Guard/ }).first();
  await expect(result).toBeVisible();
  await expect(result).toHaveAttribute(
    "href",
    /\/docs\/v1\.0\.0\/reference\/guard\//,
  );
  await expectNoAxeViolations(page);
  await result.click();
  await expect(page).toHaveURL(/\/docs\/v1\.0\.0\/reference\/guard\//);
  await expect(page.getByText("@combric/guard@1.0.0").first()).toBeVisible();
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
  await page.goto(
    docsRoute(currentDocumentationVersion, "getting-started/standard-css"),
  );
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

  await page.goto(docsRoute(currentDocumentationVersion, "layout/grid"));
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
  await expect(page.locator(".combric-playground")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
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
  const previousVersion = documentationVersions.find(
    (version) => version.status === "previous",
  );
  if (!previousVersion)
    throw new Error("Missing previous documentation version");
  await page.goto(docsRoute(previousVersion));
  await expect(
    page.getByRole("combobox", { name: "Documentation version" }),
  ).toHaveValue(docsRoute(previousVersion));
  await expect(
    page.getByRole("option", {
      name: new RegExp(`${previousVersion.label}.*Previous`),
    }),
  ).toHaveCount(1);
  await expect(
    page.getByRole("option", {
      name: new RegExp(`${currentDocumentationVersion.label}.*Current`),
    }),
  ).toHaveCount(1);

  await page.goto("/docs/latest/components/actions/button/");
  await expect(page).toHaveURL(
    new URL(
      docsRoute(currentDocumentationVersion, "components/actions/button"),
      page.url(),
    ).href,
  );
  await expect(
    page.getByRole("heading", { level: 1, name: "Button" }),
  ).toBeVisible();

  await page.goto("/docs/v9.9.9/components/actions/button/");
  await expect(
    page.getByRole("heading", { level: 1, name: "Page not found" }),
  ).toBeVisible();
});

test("Docs navigation resolves the latest index to the registry current overview", async ({
  page,
  isMobile,
}) => {
  await page.goto("/");
  if (isMobile) await page.getByText("Explore", { exact: true }).click();
  const docsLink = page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Docs" });
  await expect(docsLink).toHaveAttribute("href", latestRoute());
  await docsLink.click();

  const currentOverview = docsRoute(currentDocumentationVersion);
  await expect(page).toHaveURL(new URL(currentOverview, page.url()).href);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
    "href",
    currentOverview,
  );
  await expect(page.locator("main h1").first()).toHaveText(
    `Combric ${currentDocumentationVersion.label}`,
  );
  await expect(page).toHaveTitle(
    new RegExp(currentDocumentationVersion.label.replaceAll(".", "\\.")),
  );
  const gettingStartedLink = page.locator(
    `main a[href="${latestRoute("getting-started")}"]`,
  );
  await expect(gettingStartedLink).toBeVisible();
  await gettingStartedLink.click();
  const gettingStarted = docsRoute(
    currentDocumentationVersion,
    "getting-started",
  );
  await expect(page).toHaveURL(new URL(gettingStarted, page.url()).href);
});

test("AvatarImage uses the supplied local asset and canonical source on current and latest routes", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  const routes = [
    docsRoute(currentDocumentationVersion, "components/data-display/avatar"),
    latestRoute("components/data-display/avatar"),
  ];

  for (const route of routes) {
    await page.goto(route);
    const demo = page.locator(
      `[data-demo-id="${currentDocumentationVersion.id}/avatar/image"]`,
    );
    const image = demo.getByRole("img", { name: "Portrait of a person" });
    await expect(image).toBeVisible();
    await expect(image).toHaveAttribute(
      "src",
      "/images/combric-avatar-example.png",
    );
    await expect
      .poll(() =>
        image.evaluate((element) => (element as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
    const fallback = demo.locator(".combric-avatar__fallback");
    await expect(fallback).toHaveCount(1);
    await expect(fallback).toBeHidden();

    await demo.getByRole("button", { name: "View code" }).click();
    const displayedSource = await demo
      .locator(".combric-demo-actions__source code")
      .innerText();
    expect(displayedSource).toContain(
      'src="/images/combric-avatar-example.png"',
    );
    expect(displayedSource).toContain('alt="Portrait of a person"');

    await demo.getByRole("button", { name: "Copy code" }).click();
    await expect(demo.getByRole("status")).toHaveText("Code copied.");
    await expect
      .poll(() =>
        page
          .evaluate(() => navigator.clipboard.readText())
          .then((source) => source.replace(/\r\n/g, "\n")),
      )
      .toBe(displayedSource.replace(/\r\n/g, "\n"));
    await expectNoAxeViolations(page);
  }
});

test("AvatarImage shows its fallback when the supplied image fails to load", async ({
  page,
}) => {
  await page.route("**/images/combric-avatar-example.png", (route) =>
    route.abort(),
  );
  await page.goto(
    docsRoute(currentDocumentationVersion, "components/data-display/avatar"),
  );

  const demo = page.locator(
    `[data-demo-id="${currentDocumentationVersion.id}/avatar/image"]`,
  );
  await expect(
    demo.getByRole("img", { name: "Portrait of a person" }),
  ).toHaveCount(1);
  await expect(demo.locator(".combric-avatar__fallback")).toHaveText("DA");
  await expect(demo.locator(".combric-avatar__fallback")).toBeVisible();
  await expectNoAxeViolations(page);
});

test("legacy component route redirects to current versioned documentation", async ({
  page,
}) => {
  await page.goto("/components/actions/button/");
  await expect(page).toHaveURL(
    new URL(
      docsRoute(currentDocumentationVersion, "components/actions/button"),
      page.url(),
    ).href,
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

test("current CLI and Guard documentation matches the published 1.1.1 contracts", async ({
  page,
}) => {
  await page.goto(
    docsRoute(currentDocumentationVersion, "getting-started/cli"),
  );
  await expect(
    page.getByRole("heading", {
      level: 1,
      name: "CLI & Developer Experience",
    }),
  ).toBeVisible();
  await expect(
    page.getByText("@combric/cli@1.1.1", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("published", { exact: false }).first(),
  ).toBeVisible();
  await expectNoAxeViolations(page);

  await page.goto(docsRoute(currentDocumentationVersion, "reference/guard"));
  await expect(
    page.getByText("@combric/guard@1.1.1", { exact: true }).first(),
  ).toBeVisible();
  await expect(
    page.getByText("GUARD_SCAN_SKIPPED", { exact: true }),
  ).toBeVisible();
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
    await page.keyboard.press("Escape");
    await expect(menu).toBeFocused();
  });

  test("mobile search is available and accessible", async ({ page }) => {
    await page.goto("/docs/v1.0.0/");
    const search = page.getByRole("button", { name: /search/i }).first();
    await expect(search).toBeVisible();
    await search.click();
    await expect(page.getByRole("dialog")).toBeVisible();
    await expectNoAxeViolations(page);
  });

  test("mobile site destinations and theme remain accessible", async ({
    page,
  }) => {
    await page.goto("/docs/v1.0.0/components/actions/button/");
    const explore = page.getByText("Explore", { exact: true });
    await explore.click();
    const navigation = page.getByRole("navigation", {
      name: "Main navigation",
    });
    for (const label of ["Docs", "Components", "Playground", "GitHub"]) {
      await expect(navigation.getByRole("link", { name: label })).toBeVisible();
    }

    const theme = page.getByRole("combobox", { name: "Select theme" });
    await expect(theme).toBeVisible();
    await theme.selectOption("dark");
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
    await expectNoAxeViolations(page);
  });
});
