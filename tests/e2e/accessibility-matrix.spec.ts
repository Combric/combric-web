import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import type { Locator, Page } from "@playwright/test";
import { catalogue, catalogueRoute } from "../../src/data/catalogue";
import {
  catalogueDemoMetadata,
  catalogueTestScenarioIds,
} from "../../src/data/catalogue-demos";
import { currentDocumentationVersion } from "../../src/data/versions";

const scenarioLabels: Record<
  (typeof catalogueTestScenarioIds)[number],
  string
> = {
  accordion: "Accordion",
  checkbox: "Checkbox",
  "radio-group": "RadioGroup",
  switch: "Switch",
  slider: "Slider",
  select: "Select",
  tabs: "Tabs",
  dialog: "Dialog",
  drawer: "Drawer / Sheet",
  "dropdown-menu": "DropdownMenu",
  popover: "Popover",
  tooltip: "Tooltip",
  toast: "Toast",
  toggle: "Toggle",
  "toggle-group": "ToggleGroup",
};

const demosUnderTest = catalogueDemoMetadata.filter(
  (demo) =>
    demo.version === currentDocumentationVersion.id && demo.testScenario,
);
const scenarios = demosUnderTest.map((demo) => {
  const item = catalogue.find((entry) => entry.slug === demo.catalogueSlug);
  if (!item || !demo.testScenario)
    throw new Error(`Invalid test demo: ${demo.id}`);
  return [
    scenarioLabels[demo.testScenario as keyof typeof scenarioLabels],
    catalogueRoute(currentDocumentationVersion, item),
    demo.testScenario,
    demo.id,
  ] as const;
});

async function exercise(
  page: Page,
  demo: Locator,
  scenario: string,
): Promise<void> {
  switch (scenario) {
    case "accordion": {
      const trigger = demo.getByRole("button", { name: "Details" });
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      await trigger.click();
      await expect(trigger).toHaveAttribute("aria-expanded", "false");
      await trigger.press("Enter");
      await expect(trigger).toHaveAttribute("aria-expanded", "true");
      break;
    }
    case "checkbox": {
      const control = demo.getByRole("checkbox", {
        name: "Include archived projects",
      });
      await expect(control).toBeChecked();
      await control.focus();
      await control.press("Space");
      await expect(control).not.toBeChecked();
      break;
    }
    case "radio-group": {
      const starter = demo.getByRole("radio", { name: "Starter" });
      const pro = demo.getByRole("radio", { name: "Pro" });
      await expect(starter).toBeChecked();
      await pro.click();
      await expect(pro).toBeChecked();
      await expect(starter).not.toBeChecked();
      break;
    }
    case "switch": {
      const control = demo.getByRole("switch", { name: "Notifications" });
      await expect(control).toBeChecked();
      await control.focus();
      await control.press("Space");
      await expect(control).not.toBeChecked();
      break;
    }
    case "slider": {
      const control = demo.getByRole("slider", { name: "Volume" });
      await expect(control).toHaveValue("50");
      await control.focus();
      await control.press("ArrowRight");
      await expect(control).toHaveValue("51");
      break;
    }
    case "select": {
      const control = demo.getByRole("combobox", { name: "Region" });
      await expect(control).toHaveValue("eu");
      await control.selectOption("us");
      await expect(control).toHaveValue("us");
      break;
    }
    case "tabs": {
      const overview = demo.getByRole("tab", { name: "Overview" });
      const activity = demo.getByRole("tab", { name: "Activity" });
      await expect(overview).toHaveAttribute("aria-selected", "true");
      await overview.focus();
      await overview.press("ArrowRight");
      await expect(activity).toBeFocused();
      await expect(activity).toHaveAttribute("aria-selected", "true");
      await expect(
        page.getByRole("tabpanel", { name: "Activity" }),
      ).toBeVisible();
      break;
    }
    case "dialog":
    case "drawer": {
      const trigger = demo.getByRole("button", {
        name: scenario === "dialog" ? "Open dialog" : "Filters",
      });
      await trigger.click();
      const dialog = page.getByRole("dialog");
      await expect(dialog).toBeVisible();
      await expect(dialog).toHaveAttribute("aria-modal", "true");
      await page.keyboard.press("Escape");
      await expect(dialog).toBeHidden();
      await expect(trigger).toBeFocused();
      await trigger.click();
      await expect(dialog).toBeVisible();
      break;
    }
    case "dropdown-menu": {
      const trigger = demo.getByRole("button", {
        name: "Actions",
        exact: true,
      });
      await trigger.click();
      await expect(page.getByRole("menu")).toBeVisible();
      await expect(
        page.getByRole("menuitem", { name: "Archive" }),
      ).toBeDisabled();
      await page.keyboard.press("Escape");
      await expect(page.getByRole("menu")).toBeHidden();
      await expect(trigger).toBeFocused();
      await trigger.click();
      break;
    }
    case "popover": {
      const trigger = demo.getByRole("button", { name: "Details" });
      await trigger.click();
      await expect(
        page.getByText("Non-modal details", { exact: true }),
      ).toBeVisible();
      await page.keyboard.press("Escape");
      await expect(
        page.getByText("Non-modal details", { exact: true }),
      ).toBeHidden();
      await expect(trigger).toBeFocused();
      await trigger.click();
      break;
    }
    case "tooltip": {
      const trigger = demo.getByRole("button", { name: "Help" });
      await trigger.focus();
      await expect(page.getByRole("tooltip")).toBeVisible();
      break;
    }
    case "toast": {
      const viewport = page.getByRole("list", {
        name: "Notifications",
        exact: true,
      });
      await expect(viewport).toBeVisible();
      await expect(viewport.getByText("Saved", { exact: true })).toBeVisible();
      await viewport.getByRole("button", { name: "Dismiss" }).click();
      await expect(viewport.getByText("Saved", { exact: true })).toBeHidden();
      break;
    }
    case "toggle": {
      const control = demo.getByRole("button", { name: "Pin project" });
      await expect(control).toHaveAttribute("aria-pressed", "true");
      await control.focus();
      await control.press("Space");
      await expect(control).toHaveAttribute("aria-pressed", "false");
      break;
    }
    case "toggle-group": {
      const list = demo.getByRole("button", { name: "List" });
      const grid = demo.getByRole("button", { name: "Grid" });
      await expect(list).toHaveAttribute("aria-pressed", "true");
      await list.focus();
      await list.press("ArrowRight");
      await expect(grid).toBeFocused();
      await expect(grid).toHaveAttribute("aria-pressed", "false");
      await grid.press("Space");
      await expect(grid).toHaveAttribute("aria-pressed", "true");
      break;
    }
  }
}

test.describe("catalogue accessibility regression matrix", () => {
  test.skip(
    ({ isMobile }) => isMobile,
    "Desktop keyboard matrix; mobile navigation is covered separately.",
  );

  for (const [family, route, scenario, demoId] of scenarios) {
    test(`${family}: real example, behavior and axe`, async ({ page }) => {
      await page.goto(route);
      await expect(
        page.locator(`[data-demo-id="${demoId}"] .combric-docs-example`),
      ).toBeVisible();
      await exercise(
        page,
        page.locator(`[data-demo-id="${demoId}"]`),
        scenario,
      );
      const builder = new AxeBuilder({ page });
      if (["dropdown-menu", "popover", "tooltip", "toast"].includes(scenario)) {
        // Non-modal portals intentionally live outside the docs page landmarks.
        // The docs shell's landmark coverage is tested on ordinary pages.
        builder.disableRules(["region"]);
      }
      const result = await builder.analyze();
      expect(result.violations).toEqual([]);
    });
  }
});
