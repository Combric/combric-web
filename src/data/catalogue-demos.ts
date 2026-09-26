import {
  currentDocumentationVersion,
  documentationVersions,
  type DocumentationVersion,
} from "./versions.ts";

interface BaseDemoMetadata {
  readonly id: string;
  /** Release that first includes this canonical example. */
  readonly version: DocumentationVersion["id"];
  readonly exampleKey: string;
  readonly title: string;
  readonly testScenario?: string;
}

export type CatalogueDemoMetadata =
  | (BaseDemoMetadata & {
      readonly kind?: "component";
      readonly catalogueSlug: string;
    })
  | (BaseDemoMetadata & {
      readonly kind: "layout";
      readonly layoutSlug: string;
    })
  | (BaseDemoMetadata & {
      readonly kind: "styling";
      readonly comparisonId: string;
      readonly approach: "native-css" | "tailwind";
    });

export const catalogueTestScenarioIds = Object.freeze([
  "accordion",
  "checkbox",
  "radio-group",
  "switch",
  "slider",
  "select",
  "tabs",
  "dialog",
  "drawer",
  "dropdown-menu",
  "popover",
  "tooltip",
  "toast",
  "toggle",
  "toggle-group",
] as const);

// Stable IDs keep component identity separate from route prefixes and let a
// family grow multiple examples without changing its catalogue route.
const demoTemplates = Object.freeze([
  {
    id: "v1.0.0/button/default",
    version: "v1.0.0",
    catalogueSlug: "button",
    exampleKey: "button",
    title: "Default button",
  },
  {
    id: "v1.0.0/button/disabled",
    version: "v1.0.0",
    catalogueSlug: "button",
    exampleKey: "button-disabled",
    title: "Disabled button",
  },
  {
    id: "v1.0.0/button/variants",
    version: "v1.0.0",
    catalogueSlug: "button",
    exampleKey: "button-variants",
    title: "Variants",
  },
  {
    id: "v1.0.0/button/sizes",
    version: "v1.0.0",
    catalogueSlug: "button",
    exampleKey: "button-sizes",
    title: "Sizes",
  },
  {
    id: "v1.0.0/toggle/default",
    version: "v1.0.0",
    catalogueSlug: "toggle",
    exampleKey: "toggle",
    title: "Default toggle",
    testScenario: "toggle",
  },
  {
    id: "v1.0.0/toggle/unpressed",
    version: "v1.0.0",
    catalogueSlug: "toggle",
    exampleKey: "toggle-unpressed",
    title: "Unpressed state",
  },
  {
    id: "v1.0.0/toggle/disabled",
    version: "v1.0.0",
    catalogueSlug: "toggle",
    exampleKey: "toggle-disabled",
    title: "Disabled state",
  },
  {
    id: "v1.0.0/toggle-group/default",
    version: "v1.0.0",
    catalogueSlug: "toggle-group",
    exampleKey: "toggle-group",
    title: "Single-select toggle group",
    testScenario: "toggle-group",
  },
  {
    id: "v1.0.0/toggle-group/multiple",
    version: "v1.0.0",
    catalogueSlug: "toggle-group",
    exampleKey: "toggle-group-multiple",
    title: "Multiple selection",
  },
  {
    id: "v1.0.0/toggle-group/vertical",
    version: "v1.0.0",
    catalogueSlug: "toggle-group",
    exampleKey: "toggle-group-vertical",
    title: "Vertical orientation",
  },
  {
    id: "v1.0.0/label/default",
    version: "v1.0.0",
    catalogueSlug: "label",
    exampleKey: "label",
    title: "Default label",
  },
  {
    id: "v1.0.0/input/default",
    version: "v1.0.0",
    catalogueSlug: "input",
    exampleKey: "input",
    title: "Default input",
  },
  {
    id: "v1.0.0/input/disabled",
    version: "v1.0.0",
    catalogueSlug: "input",
    exampleKey: "input-disabled",
    title: "Disabled input",
  },
  {
    id: "v1.0.0/input/invalid",
    version: "v1.0.0",
    catalogueSlug: "input",
    exampleKey: "input-invalid",
    title: "Invalid input",
  },
  {
    id: "v1.0.0/textarea/default",
    version: "v1.0.0",
    catalogueSlug: "textarea",
    exampleKey: "textarea",
    title: "Default textarea",
  },
  {
    id: "v1.0.0/textarea/disabled",
    version: "v1.0.0",
    catalogueSlug: "textarea",
    exampleKey: "textarea-disabled",
    title: "Disabled textarea",
  },
  {
    id: "v1.0.0/textarea/invalid",
    version: "v1.0.0",
    catalogueSlug: "textarea",
    exampleKey: "textarea-invalid",
    title: "Invalid textarea",
  },
  {
    id: "v1.0.0/checkbox/default",
    version: "v1.0.0",
    catalogueSlug: "checkbox",
    exampleKey: "checkbox",
    title: "Checked checkbox",
    testScenario: "checkbox",
  },
  {
    id: "v1.0.0/checkbox/unchecked",
    version: "v1.0.0",
    catalogueSlug: "checkbox",
    exampleKey: "checkbox-unchecked",
    title: "Unchecked state",
  },
  {
    id: "v1.0.0/checkbox/disabled",
    version: "v1.0.0",
    catalogueSlug: "checkbox",
    exampleKey: "checkbox-disabled",
    title: "Disabled state",
  },
  {
    id: "v1.0.0/radio-group/default",
    version: "v1.0.0",
    catalogueSlug: "radio-group",
    exampleKey: "radio-group",
    title: "Radio group",
    testScenario: "radio-group",
  },
  {
    id: "v1.0.0/radio-group/disabled",
    version: "v1.0.0",
    catalogueSlug: "radio-group",
    exampleKey: "radio-group-disabled",
    title: "Disabled group",
  },
  {
    id: "v1.0.0/radio-group/required",
    version: "v1.0.0",
    catalogueSlug: "radio-group",
    exampleKey: "radio-group-required",
    title: "Required selection",
  },
  {
    id: "v1.0.0/switch/default",
    version: "v1.0.0",
    catalogueSlug: "switch",
    exampleKey: "switch",
    title: "Enabled switch",
    testScenario: "switch",
  },
  {
    id: "v1.0.0/switch/off",
    version: "v1.0.0",
    catalogueSlug: "switch",
    exampleKey: "switch-off",
    title: "Off state",
  },
  {
    id: "v1.0.0/switch/disabled",
    version: "v1.0.0",
    catalogueSlug: "switch",
    exampleKey: "switch-disabled",
    title: "Disabled state",
  },
  {
    id: "v1.0.0/select/default",
    version: "v1.0.0",
    catalogueSlug: "select",
    exampleKey: "select",
    title: "Select region",
    testScenario: "select",
  },
  {
    id: "v1.0.0/select/disabled",
    version: "v1.0.0",
    catalogueSlug: "select",
    exampleKey: "select-disabled",
    title: "Disabled select",
  },
  {
    id: "v1.0.0/select/invalid",
    version: "v1.0.0",
    catalogueSlug: "select",
    exampleKey: "select-invalid",
    title: "Invalid select",
  },
  {
    id: "v1.0.0/slider/default",
    version: "v1.0.0",
    catalogueSlug: "slider",
    exampleKey: "slider",
    title: "Volume slider",
    testScenario: "slider",
  },
  {
    id: "v1.0.0/slider/disabled",
    version: "v1.0.0",
    catalogueSlug: "slider",
    exampleKey: "slider-disabled",
    title: "Disabled slider",
  },
  {
    id: "v1.0.0/field/default",
    version: "v1.0.0",
    catalogueSlug: "field",
    exampleKey: "field",
    title: "Invalid field",
  },
  {
    id: "v1.0.0/field/valid",
    version: "v1.0.0",
    catalogueSlug: "field",
    exampleKey: "field-valid",
    title: "Valid field structure",
  },
  {
    id: "v1.0.0/fieldset/default",
    version: "v1.0.0",
    catalogueSlug: "fieldset",
    exampleKey: "fieldset",
    title: "Preferences fieldset",
  },
  {
    id: "v1.0.0/fieldset/disabled",
    version: "v1.0.0",
    catalogueSlug: "fieldset",
    exampleKey: "fieldset-disabled",
    title: "Disabled fieldset",
  },
  {
    id: "v1.0.0/input-group/default",
    version: "v1.0.0",
    catalogueSlug: "input-group",
    exampleKey: "input-group",
    title: "Input group",
  },
  {
    id: "v1.0.0/input-group/action",
    version: "v1.0.0",
    catalogueSlug: "input-group",
    exampleKey: "input-group-action",
    title: "Control with action",
  },
  {
    id: "v1.0.0/breadcrumb/default",
    version: "v1.0.0",
    catalogueSlug: "breadcrumb",
    exampleKey: "breadcrumb",
    title: "Breadcrumb",
  },
  {
    id: "v1.0.0/pagination/default",
    version: "v1.0.0",
    catalogueSlug: "pagination",
    exampleKey: "pagination",
    title: "Pagination",
  },
  {
    id: "v1.0.0/tabs/default",
    version: "v1.0.0",
    catalogueSlug: "tabs",
    exampleKey: "tabs",
    title: "Project sections",
    testScenario: "tabs",
  },
  {
    id: "v1.0.0/avatar/default",
    version: "v1.0.0",
    catalogueSlug: "avatar",
    exampleKey: "avatar",
    title: "Avatar",
  },
  {
    id: "v1.0.0/avatar/sizes",
    version: "v1.0.0",
    catalogueSlug: "avatar",
    exampleKey: "avatar-sizes",
    title: "Sizes",
  },
  {
    id: "v1.0.0/badge/default",
    version: "v1.0.0",
    catalogueSlug: "badge",
    exampleKey: "badge",
    title: "Active badge",
  },
  {
    id: "v1.0.0/badge/variants",
    version: "v1.0.0",
    catalogueSlug: "badge",
    exampleKey: "badge-variants",
    title: "Neutral and accent variants",
  },
  {
    id: "v1.0.0/card/default",
    version: "v1.0.0",
    catalogueSlug: "card",
    exampleKey: "card",
    title: "Project card",
  },
  {
    id: "v1.0.0/separator/default",
    version: "v1.0.0",
    catalogueSlug: "separator",
    exampleKey: "separator",
    title: "Separator",
  },
  {
    id: "v1.0.0/separator/decorative",
    version: "v1.0.0",
    catalogueSlug: "separator",
    exampleKey: "separator-decorative",
    title: "Decorative separator",
  },
  {
    id: "v1.0.0/progress/default",
    version: "v1.0.0",
    catalogueSlug: "progress",
    exampleKey: "progress",
    title: "Upload progress",
  },
  {
    id: "v1.0.0/progress/indeterminate",
    version: "v1.0.0",
    catalogueSlug: "progress",
    exampleKey: "progress-indeterminate",
    title: "Indeterminate progress",
  },
  {
    id: "v1.0.0/skeleton/default",
    version: "v1.0.0",
    catalogueSlug: "skeleton",
    exampleKey: "skeleton",
    title: "Loading skeleton",
  },
  {
    id: "v1.0.0/spinner/default",
    version: "v1.0.0",
    catalogueSlug: "spinner",
    exampleKey: "spinner",
    title: "Loading spinner",
  },
  {
    id: "v1.0.0/spinner/decorative",
    version: "v1.0.0",
    catalogueSlug: "spinner",
    exampleKey: "spinner-decorative",
    title: "Decorative by default",
  },
  {
    id: "v1.0.0/table/default",
    version: "v1.0.0",
    catalogueSlug: "table",
    exampleKey: "table",
    title: "Data table",
  },
  {
    id: "v1.0.0/description-list/default",
    version: "v1.0.0",
    catalogueSlug: "description-list",
    exampleKey: "description-list",
    title: "Description list",
  },
  {
    id: "v1.0.0/accordion/default",
    version: "v1.0.0",
    catalogueSlug: "accordion",
    exampleKey: "accordion",
    title: "Details accordion",
    testScenario: "accordion",
  },
  {
    id: "v1.0.0/accordion/disabled-item",
    version: "v1.0.0",
    catalogueSlug: "accordion",
    exampleKey: "accordion-disabled-item",
    title: "Disabled item",
  },
  {
    id: "v1.0.0/collapsible/default",
    version: "v1.0.0",
    catalogueSlug: "collapsible",
    exampleKey: "collapsible",
    title: "Collapsible section",
  },
  {
    id: "v1.0.0/collapsible/disabled",
    version: "v1.0.0",
    catalogueSlug: "collapsible",
    exampleKey: "collapsible-disabled",
    title: "Disabled trigger",
  },
  {
    id: "v1.0.0/dialog/default",
    version: "v1.0.0",
    catalogueSlug: "dialog",
    exampleKey: "dialog",
    title: "Confirmation dialog",
    testScenario: "dialog",
  },
  {
    id: "v1.0.0/drawer/default",
    version: "v1.0.0",
    catalogueSlug: "drawer",
    exampleKey: "drawer",
    title: "Filter drawer",
    testScenario: "drawer",
  },
  {
    id: "v1.0.0/drawer/left",
    version: "v1.0.0",
    catalogueSlug: "drawer",
    exampleKey: "drawer-left",
    title: "Left side",
  },
  {
    id: "v1.0.0/dropdown-menu/default",
    version: "v1.0.0",
    catalogueSlug: "dropdown-menu",
    exampleKey: "dropdown-menu",
    title: "Actions menu",
    testScenario: "dropdown-menu",
  },
  {
    id: "v1.0.0/dropdown-menu/positioning",
    version: "v1.0.0",
    catalogueSlug: "dropdown-menu",
    exampleKey: "dropdown-menu-positioning",
    title: "Position and alignment",
  },
  {
    id: "v1.0.0/popover/default",
    version: "v1.0.0",
    catalogueSlug: "popover",
    exampleKey: "popover",
    title: "Details popover",
    testScenario: "popover",
  },
  {
    id: "v1.0.0/popover/positioning",
    version: "v1.0.0",
    catalogueSlug: "popover",
    exampleKey: "popover-positioning",
    title: "Position and alignment",
  },
  {
    id: "v1.0.0/tooltip/default",
    version: "v1.0.0",
    catalogueSlug: "tooltip",
    exampleKey: "tooltip",
    title: "Help tooltip",
    testScenario: "tooltip",
  },
  {
    id: "v1.0.0/tooltip/positioning",
    version: "v1.0.0",
    catalogueSlug: "tooltip",
    exampleKey: "tooltip-positioning",
    title: "Position and alignment",
  },
  {
    id: "v1.0.0/alert/default",
    version: "v1.0.0",
    catalogueSlug: "alert",
    exampleKey: "alert",
    title: "Error alert",
  },
  {
    id: "v1.0.0/alert/neutral",
    version: "v1.0.0",
    catalogueSlug: "alert",
    exampleKey: "alert-neutral",
    title: "Neutral alert",
  },
  {
    id: "v1.0.0/alert/live",
    version: "v1.0.0",
    catalogueSlug: "alert",
    exampleKey: "alert-live",
    title: "Assertive live region",
  },
  {
    id: "v1.0.0/toast/default",
    version: "v1.0.0",
    catalogueSlug: "toast",
    exampleKey: "toast",
    title: "Saved notification",
    testScenario: "toast",
  },
  {
    id: "v1.0.0/toast/assertive",
    version: "v1.0.0",
    catalogueSlug: "toast",
    exampleKey: "toast-assertive",
    title: "Assertive priority on demand",
  },
  {
    id: "v1.0.0/empty-state/default",
    version: "v1.0.0",
    catalogueSlug: "empty-state",
    exampleKey: "empty-state",
    title: "Empty state",
  },
  {
    id: "v1.0.0/empty-state/heading-levels",
    version: "v1.0.0",
    catalogueSlug: "empty-state",
    exampleKey: "empty-state-heading-levels",
    title: "Heading levels",
  },
  {
    id: "v1.0.0/layout/container",
    version: "v1.0.0",
    kind: "layout",
    layoutSlug: "container",
    exampleKey: "layout-container",
    title: "Container",
  },
  {
    id: "v1.0.0/layout/container-sizes",
    version: "v1.0.0",
    kind: "layout",
    layoutSlug: "container",
    exampleKey: "layout-container-sizes",
    title: "Prose, wide, and full sizes",
  },
  {
    id: "v1.0.0/layout/stack",
    version: "v1.0.0",
    kind: "layout",
    layoutSlug: "stack",
    exampleKey: "layout-stack",
    title: "Stack",
  },
  {
    id: "v1.0.0/layout/stack-gaps",
    version: "v1.0.0",
    kind: "layout",
    layoutSlug: "stack",
    exampleKey: "layout-stack-gaps",
    title: "Canonical gaps",
  },
  {
    id: "v1.0.0/layout/inline",
    version: "v1.0.0",
    kind: "layout",
    layoutSlug: "inline",
    exampleKey: "layout-inline",
    title: "Inline",
  },
  {
    id: "v1.0.0/layout/inline-alignments",
    version: "v1.0.0",
    kind: "layout",
    layoutSlug: "inline",
    exampleKey: "layout-inline-alignments",
    title: "Alignment options",
  },
  {
    id: "v1.0.0/layout/cluster",
    version: "v1.0.0",
    kind: "layout",
    layoutSlug: "cluster",
    exampleKey: "layout-cluster",
    title: "Cluster",
  },
  {
    id: "v1.0.0/layout/cluster-alignments",
    version: "v1.0.0",
    kind: "layout",
    layoutSlug: "cluster",
    exampleKey: "layout-cluster-alignments",
    title: "Alignment options",
  },
  {
    id: "v1.0.0/layout/grid",
    version: "v1.0.0",
    kind: "layout",
    layoutSlug: "grid",
    exampleKey: "layout-grid",
    title: "Grid",
  },
  {
    id: "v1.0.0/layout/grid-columns",
    version: "v1.0.0",
    kind: "layout",
    layoutSlug: "grid",
    exampleKey: "layout-grid-columns",
    title: "Explicit columns",
  },
  {
    id: "v1.0.0/styling/foundation-native-css",
    version: "v1.0.0",
    kind: "styling",
    comparisonId: "foundation-surface",
    approach: "native-css",
    exampleKey: "foundation-native-css",
    title: "Foundation surface — Native CSS",
  },
  {
    id: "v1.0.0/styling/foundation-tailwind",
    version: "v1.0.0",
    kind: "styling",
    comparisonId: "foundation-surface",
    approach: "tailwind",
    exampleKey: "foundation-tailwind",
    title: "Foundation surface — Tailwind adapter",
  },
  {
    id: "v1.0.0/styling/grid-native-css",
    version: "v1.0.0",
    kind: "styling",
    comparisonId: "responsive-grid",
    approach: "native-css",
    exampleKey: "grid-native-css",
    title: "Responsive grid — Native CSS",
  },
  {
    id: "v1.0.0/styling/grid-tailwind",
    version: "v1.0.0",
    kind: "styling",
    comparisonId: "responsive-grid",
    approach: "tailwind",
    exampleKey: "grid-tailwind",
    title: "Responsive grid — Tailwind adapter",
  },
  {
    id: "v1.1.0/button/new-variants",
    version: "v1.1.0",
    catalogueSlug: "button",
    exampleKey: "button-new-variants",
    title: "Accent and danger variants",
  },
  {
    id: "v1.1.0/button/radius-presets",
    version: "v1.1.0",
    catalogueSlug: "button",
    exampleKey: "button-radius-presets",
    title: "Radius presets",
  },
  {
    id: "v1.1.0/card/tones",
    version: "v1.1.0",
    catalogueSlug: "card",
    exampleKey: "card-tones",
    title: "Surface tones",
  },
  {
    id: "v1.1.0/card/radius-presets",
    version: "v1.1.0",
    catalogueSlug: "card",
    exampleKey: "card-radius-presets",
    title: "Radius presets",
  },
  {
    id: "v1.1.0/slider/fill-ranges",
    version: "v1.1.0",
    catalogueSlug: "slider",
    exampleKey: "slider-fill-ranges",
    title: "Determinate fill and range values",
  },
  {
    id: "v1.1.0/avatar/image",
    version: "v1.1.0",
    catalogueSlug: "avatar",
    exampleKey: "avatar-image",
    title: "AvatarImage",
  },
] satisfies readonly CatalogueDemoMetadata[]);

function versionAtLeast(
  candidate: DocumentationVersion["id"],
  introducedIn: DocumentationVersion["id"],
) {
  const candidateParts = candidate.slice(1).split(".").map(Number);
  const introducedParts = introducedIn.slice(1).split(".").map(Number);
  for (let index = 0; index < 3; index += 1) {
    if (candidateParts[index] !== introducedParts[index])
      return candidateParts[index]! > introducedParts[index]!;
  }
  return true;
}

/**
 * One canonical example template is projected onto each release where its
 * capability exists. IDs stay versioned while preview and source stay paired.
 */
export const catalogueDemoMetadata = Object.freeze(
  demoTemplates.flatMap((template) =>
    documentationVersions
      .filter((version) => versionAtLeast(version.id, template.version))
      .map((version) => {
        const { testScenario, ...shared } = template;
        return Object.freeze({
          ...shared,
          id: `${version.id}${template.id.slice(template.id.indexOf("/"))}`,
          version: version.id,
          ...(version.id === currentDocumentationVersion.id && testScenario
            ? { testScenario }
            : {}),
        });
      }),
  ),
);
