import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("Playground exposes accessible previews for every registered family", async ({
  page,
  isMobile,
}) => {
  await page.goto("/playground/");
  await expect(page.locator(".combric-playground")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  await expect(
    page.getByRole("heading", { level: 1, name: "Playground" }),
  ).toBeVisible();
  const family = page.getByRole("combobox", { name: "Component family" });
  const frame = page.locator("iframe[title$='preview']");
  const cases = [
    ["Button", "button", "Save changes"],
    ["Badge", "text", "Active"],
    ["Input", "textbox", "Email"],
    ["Switch", "switch", "Notifications"],
    ["Alert", "text", "Import ready"],
    ["Progress", "progressbar", "Import progress"],
    ["Tabs", "tab", "Overview"],
    ["Dialog", "button", "Open dialog"],
    ["Checkbox", "checkbox", "Include archived projects"],
    ["RadioGroup", "group", "Plan"],
    ["Select", "combobox", "Region"],
    ["Slider", "slider", "Volume"],
    ["Accordion", "button", "Details"],
    ["Drawer / Sheet", "button", "Filters"],
    ["DropdownMenu", "button", "Actions"],
    ["Popover", "button", "Details"],
    ["Tooltip", "button", "Help"],
    ["Toast", "text", "Saved"],
    ["Toggle", "button", "Pin project"],
    ["ToggleGroup", "button", "List"],
  ] as const;

  for (const [option, role, name] of cases) {
    await family.selectOption({ label: option });
    await expect(frame).toHaveAttribute("title", `${option} preview`);
    const preview = page.frameLocator("iframe");
    await expect(
      role === "text"
        ? preview.getByText(name, { exact: true })
        : preview.getByRole(role, { name }),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Generated TSX" }),
    ).toBeVisible();
  }

  if (isMobile) {
    await page.getByLabel("mobile", { exact: true }).check();
    const dimensions = await page.evaluate(() => ({
      client: document.documentElement.clientWidth,
      scroll: document.documentElement.scrollWidth,
    }));
    expect(dimensions.scroll).toBeLessThanOrEqual(dimensions.client);
  }

  const axe = await new AxeBuilder({ page }).analyze();
  expect(axe.violations).toEqual([]);
});

test("Playground controls reset deterministically and generated text is inert", async ({
  page,
}) => {
  await page.goto("/playground/");
  await expect(page.locator(".combric-playground")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  const frame = page.frameLocator("iframe");
  const text = page.getByRole("textbox", { name: "Text" });
  await text.fill('</Button>{globalThis.alert("x")}');
  await expect(
    frame.getByRole("button", { name: '</Button>{globalThis.alert("x")}' }),
  ).toBeVisible();
  await expect(page.locator("pre code")).toContainText(
    '{"</Button>{globalThis.alert(\\"x\\")}"}',
  );
  await expect(page.locator("pre code")).toContainText(
    'import { Button } from "@combric/react";',
  );

  await page.getByLabel("tablet", { exact: true }).check();
  await page.getByRole("button", { name: "Reset Playground" }).click();
  await expect(page.getByLabel("Text", { exact: true })).toHaveValue(
    "Save changes",
  );
  await expect(page.getByLabel("desktop", { exact: true })).toBeChecked();
  await expect(
    frame.getByRole("button", { name: "Save changes" }),
  ).toBeVisible();

  const iframe = page.locator("iframe");
  await iframe.evaluate((node) => {
    const target = node as HTMLIFrameElement;
    for (const data of [
      null,
      "unexpected",
      [],
      { type: "combric-playground-state", family: "v9", props: {} },
    ])
      target.contentWindow?.postMessage(data, window.location.origin);
  });
  await expect(
    frame.getByRole("button", { name: "Save changes" }),
  ).toBeVisible();
});

test("Playground boolean control aligns its checkbox and label", async ({
  page,
}) => {
  await page.goto("/playground/");
  const control = page.locator(".combric-playground__boolean-control");
  const checkbox = page.getByRole("checkbox", { name: "Disabled" });
  const label = control.locator("span");
  const checkboxBox = await checkbox.boundingBox();
  const labelBox = await label.boundingBox();

  expect(checkboxBox).not.toBeNull();
  expect(labelBox).not.toBeNull();
  expect(
    Math.abs(
      checkboxBox!.y +
        checkboxBox!.height / 2 -
        (labelBox!.y + labelBox!.height / 2),
    ),
  ).toBeLessThanOrEqual(1);
  expect(
    labelBox!.x - (checkboxBox!.x + checkboxBox!.width),
  ).toBeLessThanOrEqual(10);
});

test("Playground menu interactions remain keyboard accessible", async ({
  page,
}) => {
  await page.goto("/playground/");
  await expect(page.locator(".combric-playground")).toHaveAttribute(
    "data-hydrated",
    "true",
  );
  const family = page.getByRole("combobox", { name: "Component family" });
  const frame = page.frameLocator("iframe");

  await family.selectOption({ label: "DropdownMenu" });
  const menuTrigger = frame.getByRole("button", { name: "Actions" });
  await menuTrigger.focus();
  await page.keyboard.press("Enter");
  await expect(frame.getByRole("menuitem", { name: "Edit" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(menuTrigger).toBeFocused();

  await family.selectOption({ label: "Dialog" });
  const dialogTrigger = frame.getByRole("button", { name: "Open dialog" });
  await dialogTrigger.click();
  await expect(frame.getByRole("dialog")).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(frame.getByRole("dialog")).toBeHidden();
});
