import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import {
  currentDocumentationVersion,
  docsRoute,
} from "../../src/data/versions";

test("Menu reference renders each published family with keyboard and pointer paths", async ({
  page,
}) => {
  await page.goto(docsRoute(currentDocumentationVersion, "menu"));

  await expect(
    page.getByRole("heading", { level: 1, name: "Menu" }),
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { level: 2, name: "Composable menu systems" }),
  ).toBeVisible();
  const showcase = page.getByRole("region", {
    name: "Interactive Menu examples",
  });

  const actionTrigger = page.getByRole("button", { name: "Project actions" });
  await actionTrigger.click();
  const actionMenu = page.getByRole("menu");
  await expect(actionMenu).toBeVisible();
  await expect(actionMenu).toHaveCSS("margin-top", "0px");
  const archived = actionMenu.getByRole("menuitemcheckbox", {
    name: "Include archived work",
  });
  await expect(archived).toHaveAttribute("aria-checked", "true");
  await archived.click();
  await expect(archived).toHaveAttribute("aria-checked", "false");
  await page.keyboard.press("Escape");
  await expect(actionMenu).toBeHidden();
  await expect(actionTrigger).toBeFocused();

  const projectNavigation = page.getByRole("navigation", {
    name: "Project navigation",
  });
  await expect(
    projectNavigation.getByRole("link", { name: "Overview" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(page.getByRole("button", { name: "Library" })).toHaveAttribute(
    "aria-expanded",
    "true",
  );

  const solutions = page.getByRole("button", { name: "Solutions" });
  await expect(solutions).toHaveAttribute("aria-expanded", "false");
  await solutions.hover();
  await expect(solutions).toHaveAttribute("aria-expanded", "true");
  const megaPanel = showcase.getByRole("region", { name: "Solutions" });
  await megaPanel.hover();
  await expect(megaPanel).toBeVisible();
  const megaGeometry = await page.evaluate(() => {
    const trigger = document.querySelector(
      '.combric-navigation-menu__trigger[data-state="open"]',
    );
    const panel = document.querySelector(".menu-showcase__mega-content");
    if (!trigger || !panel) return null;

    return {
      panelTop: panel.getBoundingClientRect().top,
      triggerBottom: trigger.getBoundingClientRect().bottom,
    };
  });
  expect(megaGeometry).not.toBeNull();
  expect(megaGeometry!.panelTop - megaGeometry!.triggerBottom).toBeGreaterThan(
    0,
  );
  expect(
    megaGeometry!.panelTop - megaGeometry!.triggerBottom,
  ).toBeLessThanOrEqual(3);

  const triggerBox = await solutions.boundingBox();
  const panelBox = await megaPanel.boundingBox();
  expect(triggerBox).not.toBeNull();
  expect(panelBox).not.toBeNull();
  await page.mouse.move(
    triggerBox!.x + triggerBox!.width / 2,
    triggerBox!.y + triggerBox!.height - 1,
  );
  await page.mouse.move(
    triggerBox!.x + triggerBox!.width / 2,
    triggerBox!.y + triggerBox!.height + 1,
  );
  await page.mouse.move(panelBox!.x + 12, panelBox!.y + 6, { steps: 4 });
  await expect(megaPanel).toBeVisible();
  const megaImages = page.locator(".menu-showcase__mega-card img");
  await expect(megaImages).toHaveCount(3);
  for (const image of await megaImages.all())
    await expect(image).toHaveAttribute("src", /images\.unsplash\.com/);
  await page.keyboard.press("Escape");
  await expect(solutions).toHaveAttribute("aria-expanded", "false");

  const contextTarget = showcase.getByText(
    "Right-click this canvas card, or focus it and press Shift+F10.",
  );
  await contextTarget.click({ button: "right" });
  const contextMenu = page.getByRole("menu");
  await expect(contextMenu).toBeVisible();
  await expect(contextMenu).toHaveCSS("margin-top", "0px");
  await expect(
    contextMenu.getByRole("menuitem", { name: "Delete" }),
  ).toBeDisabled();
  await page.keyboard.press("Escape");
  await expect(contextMenu).toBeHidden();
  await expect(contextTarget).toBeFocused();

  const fileMenu = showcase.getByRole("menuitem", { name: "File" });
  await fileMenu.click();
  await expect(page.getByRole("menu")).toBeVisible();
  await expect(page.getByRole("menu")).toHaveCSS("margin-top", "0px");
  await page.keyboard.press("Escape");
  await expect(fileMenu).toBeFocused();

  const bottomNavigation = showcase.getByRole("navigation", {
    name: "Mobile navigation",
  });
  await expect(
    bottomNavigation.getByRole("link", { name: "Home" }),
  ).toHaveAttribute("aria-current", "page");
  await expect(
    bottomNavigation.getByRole("link", { name: "Saved" }),
  ).toBeVisible();

  const alignment = await page.evaluate(() => {
    const verticalSpread = (selector: string) => {
      const tops = [...document.querySelectorAll(selector)].map(
        (element) => element.getBoundingClientRect().top,
      );
      return tops.length > 1 ? Math.max(...tops) - Math.min(...tops) : 0;
    };

    const zeroMarginSelectors = [
      ".combric-action-menu__trigger",
      ".combric-navigation",
      ".combric-navigation__item",
      ".combric-side-nav",
      ".combric-side-nav__header",
      ".combric-side-nav__content",
      ".combric-side-nav__footer",
      ".combric-side-nav__navigation",
      ".combric-side-nav__item",
      ".combric-side-nav__group",
      ".combric-navigation-menu",
      ".combric-navigation-menu__item",
      ".combric-navigation-menu__link-item",
      ".combric-navigation-menu__trigger",
      ".combric-navigation-menu__link",
      ".combric-navigation-menu__content",
      ".combric-context-menu__trigger",
      ".combric-menubar",
      ".combric-menubar__menu",
      ".combric-menubar__trigger",
      ".combric-bottom-navigation",
      ".combric-bottom-navigation__item",
    ];

    return {
      bottomNavigation: verticalSpread(
        ".menu-showcase .combric-bottom-navigation__item",
      ),
      megaMenu: verticalSpread(
        ".menu-showcase .combric-navigation-menu__list > .combric-navigation-menu__item",
      ),
      menubar: verticalSpread(".menu-showcase .combric-menubar__menu"),
      navigation: verticalSpread(
        ".menu-showcase__navigation-grid > nav .combric-navigation__item",
      ),
      unexpectedMargins: zeroMarginSelectors.flatMap((selector) =>
        [...document.querySelectorAll(`.menu-showcase ${selector}`)]
          .map((element) => ({
            className: element.className,
            margin: getComputedStyle(element).margin,
          }))
          .filter((element) => element.margin !== "0px"),
      ),
    };
  });
  expect(alignment.bottomNavigation).toBeLessThanOrEqual(1);
  expect(alignment.megaMenu).toBeLessThanOrEqual(1);
  expect(alignment.menubar).toBeLessThanOrEqual(1);
  expect(alignment.navigation).toBeLessThanOrEqual(1);
  expect(alignment.unexpectedMargins).toEqual([]);

  const axe = await new AxeBuilder({ page })
    .include(".menu-showcase")
    .analyze();
  expect(axe.violations).toEqual([]);
});

test("Mega Menu remains inside the documentation column at intermediate widths", async ({
  page,
  isMobile,
}) => {
  test.skip(isMobile, "intermediate documentation widths are desktop-only");

  for (const width of [888, 1024, 1280]) {
    await page.setViewportSize({ width, height: 720 });
    await page.goto(docsRoute(currentDocumentationVersion, "menu"));

    const resources = page.getByRole("button", { name: "Resources" });
    await resources.scrollIntoViewIfNeeded();
    await resources.hover();

    const panel = page.getByRole("region", { name: "Resources" });
    await expect(panel).toBeVisible();

    const geometry = await page.evaluate(() => {
      const navigation = document.querySelector(
        ".menu-showcase .combric-navigation-menu",
      );
      const panel = document.querySelector(".menu-showcase__mega-content");
      const tableOfContents = document
        .querySelector("#starlight__on-this-page")
        ?.parentElement?.getBoundingClientRect();
      const navigationRect = navigation?.getBoundingClientRect();
      const panelRect = panel?.getBoundingClientRect();

      return {
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
        navigationLeft: navigationRect?.left ?? 0,
        navigationRight: navigationRect?.right ?? 0,
        panelLeft: panelRect?.left ?? 0,
        panelRight: panelRect?.right ?? 0,
        tableOfContentsLeft:
          tableOfContents && tableOfContents.width > 0
            ? tableOfContents.left
            : document.documentElement.clientWidth,
      };
    });

    expect(geometry.scrollWidth).toBeLessThanOrEqual(geometry.clientWidth);
    expect(geometry.panelLeft).toBeCloseTo(geometry.navigationLeft, 0);
    expect(geometry.panelRight).toBeCloseTo(geometry.navigationRight, 0);
    expect(geometry.panelRight).toBeLessThanOrEqual(
      geometry.tableOfContentsLeft + 1,
    );
  }
});
