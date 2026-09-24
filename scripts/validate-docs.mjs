import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";
import {
  catalogueDemoMetadata,
  catalogueTestScenarioIds,
} from "../src/data/catalogue-demos.ts";
import { playgroundEntries } from "../src/playground/registry.ts";
import {
  currentDocumentationVersion,
  documentationVersions,
  docsRoute,
  latestRoute,
} from "../src/data/versions.ts";

const root = process.cwd();
const failures = [];
const catalogueSource = readFileSync(
  join(root, "src/data/catalogue.ts"),
  "utf8",
);
const catalogueAst = ts.createSourceFile(
  join(root, "src/data/catalogue.ts"),
  catalogueSource,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);
const componentCatalogue = [];
function collectCatalogueEntries(node) {
  if (
    ts.isCallExpression(node) &&
    ts.isIdentifier(node.expression) &&
    node.expression.text === "entry" &&
    node.arguments[0] &&
    ts.isObjectLiteralExpression(node.arguments[0])
  ) {
    const properties = new Map(
      node.arguments[0].properties
        .filter(ts.isPropertyAssignment)
        .map((property) => [
          property.name.getText(catalogueAst),
          property.initializer,
        ]),
    );
    const stringValue = (name) => {
      const value = properties.get(name);
      return value && ts.isStringLiteral(value) ? value.text : undefined;
    };
    const slug = stringValue("slug");
    if (slug)
      componentCatalogue.push({
        slug,
        playground:
          properties.get("playground")?.kind === ts.SyntaxKind.TrueKeyword,
        publicExports: (() => {
          const value = properties.get("publicExports");
          return value && ts.isArrayLiteralExpression(value)
            ? value.elements.filter(ts.isStringLiteral).map((item) => item.text)
            : [];
        })(),
        aliases: (() => {
          const value = properties.get("aliases");
          return value && ts.isObjectLiteralExpression(value)
            ? value.properties
                .filter(ts.isPropertyAssignment)
                .map((property) =>
                  property.name
                    .getText(catalogueAst)
                    .replace(/^['"]|['"]$/g, ""),
                )
            : [];
        })(),
      });
  }
  ts.forEachChild(node, collectCatalogueEntries);
}
collectCatalogueEntries(catalogueAst);
const versionIds = documentationVersions.map((version) => version.id);
const currentVersions = documentationVersions.filter(
  (version) => version.status === "current",
);
if (new Set(versionIds).size !== versionIds.length)
  failures.push("Duplicate version IDs");
if (currentVersions.length !== 1)
  failures.push("Exactly one current documentation version is required");
if (!documentationVersions.includes(currentDocumentationVersion))
  failures.push("Current version is not available");
for (const version of documentationVersions) {
  if (!/^v\d+\.\d+\.\d+$/.test(version.id))
    failures.push(`Invalid documentation version ID: ${version.id}`);
  if (version.id !== `v${version.packageVersion}`)
    failures.push(`Docs/package version mismatch for ${version.id}`);
  if (!version.packages?.length)
    failures.push(`No public packages registered for ${version.id}`);
  if (
    new Set(version.packages?.map((item) => item.name)).size !==
    version.packages?.length
  )
    failures.push(`Duplicate public package names for ${version.id}`);
  if (!existsSync(join(root, "src/content/snapshots", version.id)))
    failures.push(`Missing documentation snapshot for ${version.id}`);
}
const snapshotIds = readdirSync(join(root, "src/content/snapshots"), {
  withFileTypes: true,
})
  .filter((entry) => entry.isDirectory())
  .map((entry) => entry.name)
  .sort();
if ([...versionIds].sort().join("\n") !== snapshotIds.join("\n"))
  failures.push("Available documentation versions and snapshots must match");
if (currentDocumentationVersion.id !== "v1.0.0")
  failures.push("Current stable documentation must remain v1.0.0");
if (existsSync(join(root, "src/content/docs/docs/v1.0.0")))
  failures.push("Duplicate v1.0.0 content tree");
const required = [
  "src/data/catalogue.ts",
  "src/playground",
  "src/content/snapshots/v1.0.0/layout/container.mdx",
  "src/content/snapshots/v1.0.0/layout/stack.mdx",
  "src/content/snapshots/v1.0.0/layout/inline.mdx",
  "src/content/snapshots/v1.0.0/layout/cluster.mdx",
  "src/content/snapshots/v1.0.0/layout/grid.mdx",
  "src/content/snapshots/v1.0.0/foundations/colors.mdx",
  "src/content/snapshots/v1.0.0/getting-started/cli.mdx",
  "src/content/snapshots/v1.0.0/getting-started/installation.mdx",
  "src/content/snapshots/v1.0.0/reference/packages.mdx",
  "src/content/snapshots/v1.0.0/reference/guard.mdx",
  "src/styles/tailwind-demos.css",
  "src/assets/brand/combric-logo.png",
];

for (const path of required)
  if (!existsSync(join(root, path)))
    failures.push(`Missing required path: ${path}`);

const packageJson = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8"),
);
const packageLock = readFileSync(join(root, "pnpm-lock.yaml"), "utf8");
const releaseDocs = readFileSync(
  join(root, "src/content/snapshots/v1.0.0/reference/releasing.mdx"),
  "utf8",
);
const packageDocs = readFileSync(
  join(root, "src/content/snapshots/v1.0.0/reference/packages.mdx"),
  "utf8",
);
const supportDocs = readFileSync(
  join(root, "src/content/snapshots/v1.0.0/reference/support.mdx"),
  "utf8",
);
const readme = readFileSync(join(root, "README.md"), "utf8");
const astroConfig = readFileSync(join(root, "astro.config.mjs"), "utf8");
const cliDocs = readFileSync(
  join(root, "src/content/snapshots/v1.0.0/getting-started/cli.mdx"),
  "utf8",
);
const guardDocs = readFileSync(
  join(root, "src/content/snapshots/v1.0.0/reference/guard.mdx"),
  "utf8",
);
const installationDocs = readFileSync(
  join(root, "src/content/snapshots/v1.0.0/getting-started/installation.mdx"),
  "utf8",
);
const registeredPackageNames = currentDocumentationVersion.packages.map(
  (item) => item.name,
);
for (const [name, installedVersion] of Object.entries(
  packageJson.dependencies ?? {},
)) {
  if (
    name.startsWith("@combric/") &&
    installedVersion !== currentDocumentationVersion.packageVersion
  )
    failures.push(
      `Installed public package version drift: ${name}@${installedVersion}`,
    );
  if (name === "@combric/core")
    failures.push("Private @combric/core must not be consumed");
}
for (const name of registeredPackageNames)
  if (!packageDocs.includes(`\`${name}\``))
    failures.push(`Package reference docs omit ${name}`);
if (
  currentDocumentationVersion.packages.length !== 6 ||
  registeredPackageNames.some(
    (name) =>
      !/^(?:@combric\/(?:tokens|layout|react|tailwind|cli|guard))$/.test(name),
  )
)
  failures.push(
    "The v1.0.0 registry must contain only the six public packages",
  );
if (
  /^\s+(?:specifier|version):\s+(?:workspace:|link:|portal:|file:|git\+)/m.test(
    packageLock,
  )
)
  failures.push(
    "Package lock must resolve public dependencies, not local sources",
  );
if (packageLock.includes("@combric/core@"))
  failures.push("Private @combric/core must not appear in the dependency lock");
if (/workspace:|link:|portal:|file:|git\+/.test(JSON.stringify(packageJson)))
  failures.push(
    "Web dependencies must not use workspace or local package sources",
  );
if (
  !astroConfig.includes("process.env.COMBRIC_DOCS_SITE_URL") ||
  !/site:\s*configuredSite/.test(astroConfig)
)
  failures.push(
    "The site origin must remain optional and environment-provided",
  );
if (
  !readme.includes(
    "MANUAL GATE — production hosting/domain not yet selected/configured",
  )
)
  failures.push(
    "The production hosting/domain manual gate must remain visible",
  );
if (
  !releaseDocs.includes("published") ||
  !releaseDocs.includes("bootstrap") ||
  !releaseDocs.includes("COMBRIC_DOCS_SITE_URL") ||
  /packages are new to npm|still absent from npm|PUBLISH NOT APPROVED/i.test(
    releaseDocs,
  )
)
  failures.push(
    "Release documentation is stale or omits release authority boundaries",
  );
if (
  !/Semantic\s+Versioning/.test(supportDocs) ||
  !supportDocs.includes("published on npm") ||
  !supportDocs.includes("No migration guides are claimed")
)
  failures.push(
    "Support documentation must describe current published version semantics",
  );
if (
  !cliDocs.includes(
    `@combric/cli@${currentDocumentationVersion.packageVersion}`,
  ) ||
  !cliDocs.includes("published") ||
  /not yet published|local tarball or\s+workspace until release/i.test(cliDocs)
)
  failures.push("CLI docs do not describe the published 1.0.0 package truth");
if (
  !guardDocs.includes(
    `@combric/guard@${currentDocumentationVersion.packageVersion}`,
  ) ||
  !guardDocs.includes("GUARD_SCAN_SKIPPED") ||
  !guardDocs.includes("GUARD_TOKEN_UNKNOWN")
)
  failures.push(
    "Guard docs are missing the published version or rule contract",
  );
if (
  !installationDocs.includes(
    `@combric/react@${currentDocumentationVersion.packageVersion}`,
  ) ||
  !installationDocs.includes(
    `@combric/tokens@${currentDocumentationVersion.packageVersion}`,
  ) ||
  !installationDocs.includes(
    `@combric/layout@${currentDocumentationVersion.packageVersion}`,
  ) ||
  !installationDocs.includes(
    `@combric/tailwind@${currentDocumentationVersion.packageVersion}`,
  ) ||
  /release-candidate ready|does not claim the packages currently exist/i.test(
    installationDocs,
  )
)
  failures.push("Installation docs do not match the v1.0.0 published packages");
for (const [name, version] of Object.entries(packageJson.dependencies ?? {})) {
  if (name.startsWith("@combric/") && version.includes("workspace:"))
    failures.push(`Workspace dependency: ${name}`);
  if (name === "@combric/core")
    failures.push("Private @combric/core must not be consumed");
}

const ids = [...catalogueSource.matchAll(/id:\s*["']([^"']+)["']/g)].map(
  (match) => match[1],
);
if (new Set(ids).size !== ids.length)
  failures.push("Catalogue IDs are not unique");

if (!existsSync(join(root, "src/data/catalogue-demos.ts")))
  failures.push("Canonical catalogue demo registry is missing");
const demoIds = catalogueDemoMetadata.map((demo) => demo.id);
if (new Set(demoIds).size !== demoIds.length)
  failures.push("Canonical demo IDs are not unique");
const componentCatalogueSource = catalogueSource.split(
  "export interface LayoutEntry",
)[0];
const catalogueSlugs = new Set(
  [...componentCatalogueSource.matchAll(/slug:\s*["']([^"']+)["']/g)].map(
    (match) => match[1],
  ),
);
for (const demo of catalogueDemoMetadata) {
  if (demo.version !== currentDocumentationVersion.id)
    failures.push(
      `Demo ${demo.id} references an unavailable/non-current version`,
    );
  if (
    (!demo.kind || demo.kind === "component") &&
    !catalogueSlugs.has(demo.catalogueSlug)
  )
    failures.push(`Demo ${demo.id} references an unknown catalogue slug`);
  if (demo.kind === "layout" && !demo.layoutSlug)
    failures.push(`Layout demo ${demo.id} is missing its layout identity`);
  if (demo.kind === "styling" && (!demo.comparisonId || !demo.approach))
    failures.push(`Styling demo ${demo.id} is missing comparison metadata`);
  if (!demo.exampleKey || !demo.title.trim())
    failures.push(`Demo ${demo.id} is missing its example key or title`);
}
for (const slug of catalogueSlugs)
  if (!catalogueDemoMetadata.some((demo) => demo.catalogueSlug === slug))
    failures.push(`Catalogue family has no canonical demo: ${slug}`);
const layoutSlugs = new Set([
  "container",
  "stack",
  "inline",
  "cluster",
  "grid",
]);
for (const slug of layoutSlugs)
  if (
    !catalogueDemoMetadata.some(
      (demo) => demo.kind === "layout" && demo.layoutSlug === slug,
    )
  )
    failures.push(`Layout ${slug} has no canonical demo`);
for (const comparisonId of ["foundation-surface", "responsive-grid"])
  for (const approach of ["native-css", "tailwind"])
    if (
      !catalogueDemoMetadata.some(
        (demo) =>
          demo.kind === "styling" &&
          demo.comparisonId === comparisonId &&
          demo.approach === approach,
      )
    )
      failures.push(`Incomplete ${comparisonId} comparison: ${approach}`);
if (
  existsSync(join(root, "src/examples/layout-examples.tsx")) ||
  existsSync(join(root, "src/examples/LayoutExampleRenderer.tsx"))
)
  failures.push("Parallel layout example registry/renderer must not remain");
const metadataScenarios = catalogueDemoMetadata
  .map((demo) => demo.testScenario)
  .filter(Boolean);
if (new Set(catalogueTestScenarioIds).size !== catalogueTestScenarioIds.length)
  failures.push("Catalogue test scenario IDs are not unique");
if (
  new Set(metadataScenarios).size !== metadataScenarios.length ||
  catalogueTestScenarioIds.length !== metadataScenarios.length ||
  catalogueTestScenarioIds.some((id) => !metadataScenarios.includes(id))
)
  failures.push(
    "Canonical demo scenarios and accessibility tests do not match",
  );

const examplesPath = join(root, "src/examples/catalogue-examples.tsx");
const examplesSource = ts.createSourceFile(
  examplesPath,
  readFileSync(examplesPath, "utf8"),
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TSX,
);
let examplesObject;
function findExamplesObject(node) {
  if (
    ts.isVariableDeclaration(node) &&
    node.name.getText(examplesSource) === "componentExamples"
  )
    examplesObject = node.initializer;
  ts.forEachChild(node, findExamplesObject);
}
findExamplesObject(examplesSource);
if (!examplesObject || !ts.isObjectLiteralExpression(examplesObject)) {
  failures.push("Canonical rendered example registry is missing or malformed");
} else {
  const exampleKeys = new Set();
  for (const property of examplesObject.properties) {
    if (!ts.isPropertyAssignment(property)) continue;
    const key = property.name
      .getText(examplesSource)
      .replace(/^['"]|['"]$/g, "");
    exampleKeys.add(key);
    const initializer = property.initializer;
    const sourceArgument = ts.isCallExpression(initializer)
      ? initializer.arguments[1]
      : undefined;
    if (
      !sourceArgument ||
      !(
        ts.isNoSubstitutionTemplateLiteral(sourceArgument) ||
        ts.isStringLiteral(sourceArgument)
      ) ||
      !sourceArgument.text.trim()
    )
      failures.push(
        `Rendered example ${key} does not have a static canonical source`,
      );
  }
  for (const demo of catalogueDemoMetadata)
    if (!exampleKeys.has(demo.exampleKey))
      failures.push(`Demo ${demo.id} has no rendered/source example`);
  for (const key of exampleKeys)
    if (!catalogueDemoMetadata.some((demo) => demo.exampleKey === key))
      failures.push(`Orphan rendered example: ${key}`);
}

const playgroundRoot = join(root, "src/playground");
if (existsSync(playgroundRoot)) {
  const previewIds = readdirSync(join(playgroundRoot, "previews"))
    .filter((file) => file.endsWith(".tsx"))
    .map((file) => file.slice(0, -4));
  const playgroundIds = playgroundEntries.map((item) => item.id);
  const playgroundIdSet = new Set(playgroundIds);
  if (playgroundIdSet.size !== playgroundIds.length)
    failures.push("Playground IDs are not unique");
  if (
    previewIds.length !== playgroundIds.length ||
    previewIds.some((id) => !playgroundIdSet.has(id)) ||
    playgroundIds.some((id) => !previewIds.includes(id))
  )
    failures.push("Playground registry and preview modules must match exactly");

  const catalogueBySlug = new Map(
    componentCatalogue.map((item) => [item.slug, item]),
  );
  const publicExports = new Set(
    componentCatalogue.flatMap((item) => [
      ...item.publicExports,
      ...item.aliases,
    ]),
  );
  for (const item of playgroundEntries) {
    const catalogueItem = catalogueBySlug.get(item.id);
    if (!catalogueItem)
      failures.push(`Playground family ${item.id} is not in the catalogue`);
    else if (!catalogueItem.playground)
      failures.push(
        `Catalogue family ${item.id} is not marked Playground-ready`,
      );
    for (const imported of item.imports)
      if (!publicExports.has(imported))
        failures.push(
          `Playground ${item.id} imports non-public export ${imported}`,
        );
    if (
      item.controls.length !== Object.keys(item.defaults).length ||
      new Set(item.controls.map((control) => control.name)).size !==
        item.controls.length
    )
      failures.push(`Playground ${item.id} controls/defaults are inconsistent`);
    for (const control of item.controls) {
      if (
        control.kind === "enum" &&
        !control.options.includes(String(item.defaults[control.name]))
      )
        failures.push(`Playground ${item.id} has an invalid enum default`);
      if (
        control.kind === "number" &&
        (typeof item.defaults[control.name] !== "number" ||
          item.defaults[control.name] < control.min ||
          item.defaults[control.name] > control.max ||
          control.step <= 0)
      )
        failures.push(`Playground ${item.id} has an invalid number default`);
      if (
        control.kind === "boolean" &&
        typeof item.defaults[control.name] !== "boolean"
      )
        failures.push(`Playground ${item.id} has an invalid boolean default`);
      if (
        control.kind === "text" &&
        typeof item.defaults[control.name] !== "string"
      )
        failures.push(`Playground ${item.id} has an invalid text default`);
    }
    const generated = `import { ${item.imports.join(", ")} } from "@combric/react";\nfunction Example() { return (${item.code(item.defaults)}); }`;
    const source = ts.createSourceFile(
      `${item.id}.tsx`,
      generated,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    if (source.parseDiagnostics.length)
      failures.push(`Playground ${item.id} generates invalid TSX`);
  }
  for (const item of componentCatalogue)
    if (item.playground && !playgroundIdSet.has(item.slug))
      failures.push(
        `Playground-ready catalogue family ${item.slug} has no preview`,
      );
}

if (failures.length) {
  console.error(failures.map((failure) => `FAIL: ${failure}`).join("\n"));
  process.exitCode = 1;
} else {
  const canonicalRoot = join(root, "dist/docs/v1.0.0/index.html");
  const canonicalDeep = join(
    root,
    "dist/docs/v1.0.0/components/actions/button/index.html",
  );
  const cliDoc = join(root, "dist/docs/v1.0.0/getting-started/cli/index.html");
  const guardDoc = join(root, "dist/docs/v1.0.0/reference/guard/index.html");
  const accidental = join(root, "dist/docs/v100/index.html");
  const latestDeep = join(
    root,
    "dist/docs/latest/components/actions/button/index.html",
  );
  const legacyComponent = join(
    root,
    "dist/components/actions/button/index.html",
  );
  const unknownVersion = join(root, "dist/docs/v9.9.9/index.html");
  const pagefindEntry = join(root, "dist/pagefind/pagefind-entry.json");
  const pagefindIndexes = join(root, "dist/pagefind/index");
  const latestHtml = existsSync(latestDeep)
    ? readFileSync(latestDeep, "utf8")
    : "";
  const legacyHtml = existsSync(legacyComponent)
    ? readFileSync(legacyComponent, "utf8")
    : "";
  let pagefindData;
  if (existsSync(pagefindEntry)) {
    try {
      pagefindData = JSON.parse(readFileSync(pagefindEntry, "utf8"));
    } catch {
      console.error("FAIL: built Pagefind entry must be valid JSON");
      process.exitCode = 1;
    }
  }
  const indexFiles = existsSync(pagefindIndexes)
    ? readdirSync(pagefindIndexes).filter((file) => file.endsWith(".pf_index"))
    : [];
  const builtCss = existsSync(join(root, "dist"))
    ? readdirSync(join(root, "dist/_astro"))
        .filter((file) => file.endsWith(".css"))
        .map((file) => readFileSync(join(root, "dist/_astro", file), "utf8"))
        .join("\n")
    : "";
  if (
    existsSync(join(root, "dist")) &&
    (!existsSync(canonicalRoot) ||
      !existsSync(canonicalDeep) ||
      !existsSync(cliDoc) ||
      !existsSync(guardDoc) ||
      !existsSync(latestDeep) ||
      !existsSync(legacyComponent) ||
      !existsSync(pagefindEntry) ||
      existsSync(accidental) ||
      existsSync(unknownVersion))
  ) {
    console.error("FAIL: built version route invariant failed");
    process.exitCode = 1;
  } else {
    if (
      !latestHtml.includes("/docs/v1.0.0/components/actions/button") ||
      !legacyHtml.includes("/docs/latest/components/actions/button")
    ) {
      console.error(
        "FAIL: latest and legacy redirects must follow the canonical version route chain",
      );
      process.exitCode = 1;
    }
    if (
      !pagefindData?.languages?.en?.page_count ||
      pagefindData.languages.en.page_count < 1 ||
      indexFiles.length === 0
    ) {
      console.error("FAIL: static Pagefind index output is missing or empty");
      process.exitCode = 1;
    }
    if (
      builtCss &&
      (!builtCss.includes(".grid-combric-auto-sm") ||
        !builtCss.includes("--combric-space-3"))
    ) {
      console.error(
        "FAIL: built Tailwind adapter utilities/tokens are missing",
      );
      process.exitCode = 1;
    }
    if (process.exitCode !== 1)
      console.log(
        `PASS: standalone documentation contract; canonical=${docsRoute(currentDocumentationVersion)} latest=${latestRoute()}`,
      );
  }
}
