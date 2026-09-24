export type DocumentationVersion = {
  id: `v${number}.${number}.${number}`;
  label: string;
  status: "current" | "previous";
  packageVersion: string;
  contentRoot: string;
  packages: readonly Readonly<{
    name: `@combric/${string}`;
    integration: "native" | "adapter" | "tooling";
  }>[];
};

export const documentationVersions = Object.freeze([
  {
    id: "v1.0.0",
    label: "v1.0.0",
    status: "current",
    packageVersion: "1.0.0",
    contentRoot: "docs/v1.0.0",
    packages: Object.freeze([
      { name: "@combric/tokens", integration: "native" },
      { name: "@combric/layout", integration: "native" },
      { name: "@combric/react", integration: "native" },
      { name: "@combric/tailwind", integration: "adapter" },
      { name: "@combric/cli", integration: "tooling" },
      { name: "@combric/guard", integration: "tooling" },
    ]),
  },
] satisfies readonly DocumentationVersion[]);

export const currentDocumentationVersion = documentationVersions.find(
  (version) => version.status === "current",
)!;

export function docsRoute(version: DocumentationVersion | string, path = "") {
  const id = typeof version === "string" ? version : version.id;
  const suffix = path.replace(/^\/+|\/+$/g, "");
  return `/docs/${id}${suffix ? `/${suffix}` : "/"}`;
}

export function latestRoute(path = "") {
  const suffix = path.replace(/^\/+|\/+$/g, "");
  return `/docs/latest${suffix ? `/${suffix}` : "/"}`;
}

export function equivalentVersionRoute(
  version: DocumentationVersion,
  path: string,
  availablePaths: ReadonlySet<string>,
) {
  const normalized = path.replace(/^\/+|\/+$/g, "");
  return availablePaths.has(normalized)
    ? docsRoute(version, normalized)
    : docsRoute(version);
}

export const legacyDocumentationPaths = Object.freeze([
  "getting-started",
  "getting-started/installation",
  "getting-started/standard-css",
  "getting-started/react",
  "getting-started/tailwind",
  "getting-started/cli",
  "foundations/metriq",
  "foundations/colors",
  "foundations/typography",
  "foundations/spacing",
  "foundations/sizing",
  "foundations/borders-radius",
  "foundations/focus",
  "foundations/motion",
  "foundations/layers",
  "foundations/token-api",
  "layout/container",
  "layout/stack",
  "layout/inline",
  "layout/cluster",
  "layout/grid",
  "accessibility",
  "reference/packages",
  "reference/guard",
  "reference/support",
  "reference/releasing",
  "reference/source",
]);
