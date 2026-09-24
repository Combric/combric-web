export type Control =
  | { readonly kind: "boolean"; readonly name: string; readonly label: string }
  | {
      readonly kind: "text";
      readonly name: string;
      readonly label: string;
      readonly maxLength: number;
    }
  | {
      readonly kind: "number";
      readonly name: string;
      readonly label: string;
      readonly min: number;
      readonly max: number;
      readonly step: number;
    }
  | {
      readonly kind: "enum";
      readonly name: string;
      readonly label: string;
      readonly options: readonly string[];
    };

export type PlaygroundProps = Readonly<
  Record<string, string | number | boolean>
>;

export interface PlaygroundEntry {
  readonly id: string;
  readonly label: string;
  readonly imports: readonly string[];
  readonly controls: readonly Control[];
  readonly defaults: PlaygroundProps;
  readonly code: (props: PlaygroundProps) => string;
  readonly testScenario?: string;
}

const quote = (value: unknown) => JSON.stringify(String(value));
const textNode = (value: unknown) => `{${quote(value)}}`;
const bool = (name: string, value: unknown) => (value ? ` ${name}` : "");

export const playgroundEntries = Object.freeze([
  {
    id: "button",
    label: "Button",
    imports: ["Button"],
    controls: [
      {
        kind: "enum",
        name: "variant",
        label: "Variant",
        options: ["primary", "secondary", "ghost"],
      },
      {
        kind: "enum",
        name: "size",
        label: "Size",
        options: ["sm", "md", "lg"],
      },
      { kind: "boolean", name: "disabled", label: "Disabled" },
      { kind: "text", name: "text", label: "Text", maxLength: 48 },
    ],
    defaults: {
      variant: "primary",
      size: "md",
      disabled: false,
      text: "Save changes",
    },
    code: (p) =>
      `<Button variant=${quote(p.variant)} size=${quote(p.size)}${bool("disabled", p.disabled)}>${textNode(p.text)}</Button>`,
  },
  {
    id: "badge",
    label: "Badge",
    imports: ["Badge"],
    controls: [
      {
        kind: "enum",
        name: "variant",
        label: "Variant",
        options: ["neutral", "accent"],
      },
      { kind: "text", name: "text", label: "Text", maxLength: 32 },
    ],
    defaults: { variant: "accent", text: "Active" },
    code: (p) =>
      `<Badge variant=${quote(p.variant)}>${textNode(p.text)}</Badge>`,
  },
  {
    id: "input",
    label: "Input",
    imports: ["Input"],
    controls: [
      {
        kind: "text",
        name: "placeholder",
        label: "Placeholder",
        maxLength: 48,
      },
      { kind: "boolean", name: "invalid", label: "Invalid" },
      { kind: "boolean", name: "disabled", label: "Disabled" },
    ],
    defaults: {
      placeholder: "person@example.com",
      invalid: false,
      disabled: false,
    },
    code: (p) =>
      `<Input aria-label="Email" placeholder=${quote(p.placeholder)}${p.invalid ? ` aria-invalid="true"` : ""}${bool("disabled", p.disabled)} />`,
  },
  {
    id: "switch",
    label: "Switch",
    imports: ["Label", "Switch"],
    testScenario: "switch",
    controls: [
      { kind: "boolean", name: "checked", label: "Checked" },
      { kind: "boolean", name: "disabled", label: "Disabled" },
      { kind: "text", name: "text", label: "Label", maxLength: 40 },
    ],
    defaults: { checked: true, disabled: false, text: "Notifications" },
    code: (p) =>
      `<Label><Switch defaultChecked={${Boolean(p.checked)}}${bool("disabled", p.disabled)} /> ${textNode(p.text)}</Label>`,
  },
  {
    id: "alert",
    label: "Alert",
    imports: ["Alert", "AlertTitle", "AlertDescription"],
    controls: [
      {
        kind: "enum",
        name: "tone",
        label: "Tone",
        options: ["neutral", "error"],
      },
      { kind: "text", name: "title", label: "Title", maxLength: 48 },
      {
        kind: "text",
        name: "description",
        label: "Description",
        maxLength: 96,
      },
    ],
    defaults: {
      tone: "neutral",
      title: "Import ready",
      description: "Review the mapped fields.",
    },
    code: (p) =>
      `<Alert tone=${quote(p.tone)}><AlertTitle>${textNode(p.title)}</AlertTitle><AlertDescription>${textNode(p.description)}</AlertDescription></Alert>`,
  },
  {
    id: "progress",
    label: "Progress",
    imports: ["Progress"],
    controls: [
      {
        kind: "number",
        name: "value",
        label: "Value",
        min: 0,
        max: 100,
        step: 5,
      },
    ],
    defaults: { value: 60 },
    code: (p) =>
      `<Progress aria-label="Import progress" value={${Number(p.value)}} max={100} />`,
  },
  {
    id: "tabs",
    label: "Tabs",
    imports: ["Tabs", "TabsList", "TabsTrigger", "TabsContent"],
    testScenario: "tabs",
    controls: [
      {
        kind: "enum",
        name: "value",
        label: "Selected tab",
        options: ["overview", "activity"],
      },
    ],
    defaults: { value: "overview" },
    code: (p) =>
      `<Tabs defaultValue=${quote(p.value)}><TabsList aria-label="Project sections"><TabsTrigger value="overview">Overview</TabsTrigger><TabsTrigger value="activity">Activity</TabsTrigger></TabsList><TabsContent value="overview">Overview panel</TabsContent><TabsContent value="activity">Activity panel</TabsContent></Tabs>`,
  },
  {
    id: "dialog",
    label: "Dialog",
    imports: [
      "Dialog",
      "DialogTrigger",
      "DialogContent",
      "DialogTitle",
      "DialogDescription",
      "DialogClose",
    ],
    testScenario: "dialog",
    controls: [{ kind: "boolean", name: "open", label: "Open" }],
    defaults: { open: false },
    code: (p) =>
      `<Dialog defaultOpen={${Boolean(p.open)}}><DialogTrigger>Open dialog</DialogTrigger><DialogContent><DialogTitle>Confirm</DialogTitle><DialogDescription>Review the operation.</DialogDescription><DialogClose>Close</DialogClose></DialogContent></Dialog>`,
  },
  {
    id: "checkbox",
    label: "Checkbox",
    imports: ["Checkbox", "Label"],
    testScenario: "checkbox",
    controls: [
      { kind: "boolean", name: "checked", label: "Checked" },
      { kind: "boolean", name: "disabled", label: "Disabled" },
      { kind: "text", name: "label", label: "Label", maxLength: 40 },
    ],
    defaults: {
      checked: true,
      disabled: false,
      label: "Include archived projects",
    },
    code: (p) =>
      `<Label><Checkbox defaultChecked={${Boolean(p.checked)}} disabled={${Boolean(p.disabled)}} /> ${textNode(p.label)}</Label>`,
  },
  {
    id: "radio-group",
    label: "RadioGroup",
    imports: ["Label", "Radio", "RadioGroup"],
    testScenario: "radio-group",
    controls: [
      {
        kind: "enum",
        name: "value",
        label: "Plan",
        options: ["starter", "pro"],
      },
      { kind: "boolean", name: "disabled", label: "Disabled" },
    ],
    defaults: { value: "starter", disabled: false },
    code: (p) =>
      `<RadioGroup name="plan" defaultValue=${quote(p.value)} aria-label="Plan" disabled={${Boolean(p.disabled)}}><Label><Radio value="starter" /> Starter</Label><Label><Radio value="pro" /> Pro</Label></RadioGroup>`,
  },
  {
    id: "select",
    label: "Select",
    imports: ["Select"],
    testScenario: "select",
    controls: [
      {
        kind: "enum",
        name: "value",
        label: "Region",
        options: ["eu", "us"],
      },
      { kind: "boolean", name: "disabled", label: "Disabled" },
    ],
    defaults: { value: "eu", disabled: false },
    code: (p) =>
      `<Select aria-label="Region" defaultValue=${quote(p.value)} disabled={${Boolean(p.disabled)}}><option value="eu">Europe</option><option value="us">United States</option></Select>`,
  },
  {
    id: "slider",
    label: "Slider",
    imports: ["Slider"],
    testScenario: "slider",
    controls: [
      {
        kind: "number",
        name: "value",
        label: "Value",
        min: 0,
        max: 100,
        step: 1,
      },
      { kind: "boolean", name: "disabled", label: "Disabled" },
    ],
    defaults: { value: 50, disabled: false },
    code: (p) =>
      `<Slider aria-label="Volume" defaultValue=${quote(p.value)} min="0" max="100" disabled={${Boolean(p.disabled)}} />`,
  },
  {
    id: "accordion",
    label: "Accordion",
    imports: [
      "Accordion",
      "AccordionContent",
      "AccordionItem",
      "AccordionTrigger",
    ],
    testScenario: "accordion",
    controls: [
      { kind: "boolean", name: "open", label: "Open" },
      { kind: "text", name: "content", label: "Content", maxLength: 80 },
    ],
    defaults: { open: true, content: "Accessible disclosure content." },
    code: (p) =>
      `<Accordion${Boolean(p.open) ? ' defaultValue="details"' : ""}><AccordionItem value="details"><AccordionTrigger>Details</AccordionTrigger><AccordionContent>${textNode(p.content)}</AccordionContent></AccordionItem></Accordion>`,
  },
  {
    id: "drawer",
    label: "Drawer / Sheet",
    imports: [
      "Drawer",
      "DrawerTrigger",
      "DrawerContent",
      "DrawerTitle",
      "DrawerDescription",
      "DrawerClose",
    ],
    testScenario: "drawer",
    controls: [
      { kind: "boolean", name: "open", label: "Open" },
      {
        kind: "enum",
        name: "side",
        label: "Side",
        options: ["left", "right"],
      },
      {
        kind: "text",
        name: "description",
        label: "Description",
        maxLength: 80,
      },
    ],
    defaults: {
      open: false,
      side: "right",
      description: "Limit visible results.",
    },
    code: (p) =>
      `<Drawer defaultOpen={${Boolean(p.open)}}><DrawerTrigger>Filters</DrawerTrigger><DrawerContent side=${quote(p.side)}><DrawerTitle>Filters</DrawerTitle><DrawerDescription>${textNode(p.description)}</DrawerDescription><DrawerClose>Done</DrawerClose></DrawerContent></Drawer>`,
  },
  {
    id: "dropdown-menu",
    label: "DropdownMenu",
    imports: [
      "DropdownMenu",
      "DropdownMenuTrigger",
      "DropdownMenuContent",
      "DropdownMenuItem",
      "DropdownMenuSeparator",
    ],
    testScenario: "dropdown-menu",
    controls: [
      { kind: "boolean", name: "disabledArchive", label: "Disable Archive" },
      { kind: "text", name: "trigger", label: "Trigger label", maxLength: 32 },
    ],
    defaults: { disabledArchive: true, trigger: "Actions" },
    code: (p) =>
      `<DropdownMenu><DropdownMenuTrigger>${textNode(p.trigger)}</DropdownMenuTrigger><DropdownMenuContent><DropdownMenuItem>Edit</DropdownMenuItem><DropdownMenuSeparator /><DropdownMenuItem disabled={${Boolean(p.disabledArchive)}}>Archive</DropdownMenuItem></DropdownMenuContent></DropdownMenu>`,
  },
  {
    id: "popover",
    label: "Popover",
    imports: ["Popover", "PopoverTrigger", "PopoverContent"],
    testScenario: "popover",
    controls: [
      { kind: "boolean", name: "open", label: "Open" },
      {
        kind: "enum",
        name: "side",
        label: "Side",
        options: ["top", "right", "bottom", "left"],
      },
      { kind: "text", name: "content", label: "Content", maxLength: 80 },
    ],
    defaults: { open: false, side: "bottom", content: "Non-modal details" },
    code: (p) =>
      `<Popover defaultOpen={${Boolean(p.open)}}><PopoverTrigger>Details</PopoverTrigger><PopoverContent side=${quote(p.side)}>${textNode(p.content)}</PopoverContent></Popover>`,
  },
  {
    id: "tooltip",
    label: "Tooltip",
    imports: ["Tooltip", "TooltipTrigger", "TooltipContent"],
    testScenario: "tooltip",
    controls: [
      {
        kind: "enum",
        name: "side",
        label: "Side",
        options: ["top", "right", "bottom", "left"],
      },
      { kind: "text", name: "content", label: "Content", maxLength: 80 },
    ],
    defaults: { side: "top", content: "Keyboard shortcut: Ctrl+K" },
    code: (p) =>
      `<Tooltip><TooltipTrigger>Help</TooltipTrigger><TooltipContent side=${quote(p.side)}>${textNode(p.content)}</TooltipContent></Tooltip>`,
  },
  {
    id: "toast",
    label: "Toast",
    imports: [
      "Toast",
      "ToastClose",
      "ToastDescription",
      "ToastTitle",
      "ToastViewport",
    ],
    testScenario: "toast",
    controls: [
      { kind: "boolean", name: "open", label: "Open" },
      { kind: "text", name: "title", label: "Title", maxLength: 40 },
      {
        kind: "text",
        name: "description",
        label: "Description",
        maxLength: 80,
      },
    ],
    defaults: {
      open: true,
      title: "Saved",
      description: "Your changes are available.",
    },
    code: (p) =>
      `<ToastViewport aria-label="Notifications"><Toast defaultOpen={${Boolean(p.open)}} duration={0}><ToastTitle>${textNode(p.title)}</ToastTitle><ToastDescription>${textNode(p.description)}</ToastDescription><ToastClose>Dismiss</ToastClose></Toast></ToastViewport>`,
  },
  {
    id: "toggle",
    label: "Toggle",
    imports: ["Toggle"],
    testScenario: "toggle",
    controls: [
      { kind: "boolean", name: "pressed", label: "Pressed" },
      { kind: "text", name: "label", label: "Label", maxLength: 32 },
    ],
    defaults: { pressed: true, label: "Pin project" },
    code: (p) =>
      `<Toggle defaultPressed={${Boolean(p.pressed)}}>${textNode(p.label)}</Toggle>`,
  },
  {
    id: "toggle-group",
    label: "ToggleGroup",
    imports: ["ToggleGroup", "ToggleGroupItem"],
    testScenario: "toggle-group",
    controls: [
      {
        kind: "enum",
        name: "value",
        label: "View",
        options: ["list", "grid"],
      },
    ],
    defaults: { value: "list" },
    code: (p) =>
      `<ToggleGroup type="single" defaultValue=${quote(p.value)} aria-label="View"><ToggleGroupItem value="list">List</ToggleGroupItem><ToggleGroupItem value="grid">Grid</ToggleGroupItem></ToggleGroup>`,
  },
] satisfies readonly PlaygroundEntry[]);

export function getPlaygroundEntry(id: string): PlaygroundEntry {
  const entry = playgroundEntries.find((candidate) => candidate.id === id);
  if (!entry) throw new Error(`Unknown Playground family: ${id}`);
  return entry;
}

export function validateProps(
  entry: PlaygroundEntry,
  input: unknown,
): PlaygroundProps {
  const candidate =
    typeof input === "object" && input !== null
      ? (input as Record<string, unknown>)
      : {};
  const result: Record<string, string | number | boolean> = {};
  for (const control of entry.controls) {
    const value = candidate[control.name] ?? entry.defaults[control.name];
    if (control.kind === "boolean")
      result[control.name] =
        typeof value === "boolean"
          ? value
          : entry.defaults[control.name] === true;
    if (control.kind === "text")
      result[control.name] = (
        typeof value === "string"
          ? value
          : String(entry.defaults[control.name] ?? "")
      ).slice(0, control.maxLength);
    if (control.kind === "number") {
      const numeric =
        typeof value === "number"
          ? value
          : Number(entry.defaults[control.name]);
      const bounded = Number.isFinite(numeric)
        ? Math.min(control.max, Math.max(control.min, numeric))
        : Number(entry.defaults[control.name]);
      result[control.name] =
        control.min +
        Math.round((bounded - control.min) / control.step) * control.step;
    }
    if (control.kind === "enum")
      result[control.name] = control.options.includes(String(value))
        ? String(value)
        : (control.options[0] ?? "");
  }
  return Object.freeze(result);
}
