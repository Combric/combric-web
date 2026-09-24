import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import ts from "typescript";
import {
  catalogueDemoMetadata,
  catalogueTestScenarioIds,
} from "../src/data/catalogue-demos.ts";
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
if (currentDocumentationVersion.id !== "v1.0.0")
  failures.push("Current documentation version must be v1.0.0");
if (
  new Set(documentationVersions.map((version) => version.id)).size !==
  documentationVersions.length
)
  failures.push("Duplicate version IDs");
if (
  !documentationVersions.some(
    (version) => version.id === currentDocumentationVersion.id,
  )
)
  failures.push("Current version is not available");
if (currentDocumentationVersion.packageVersion !== "1.0.0")
  failures.push("Current docs/package version invariant failed");
if (documentationVersions.some((version) => version.id === "v100"))
  failures.push("Invalid normalized version ID v100");
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
];

for (const path of required)
  if (!existsSync(join(root, path)))
    failures.push(`Missing required path: ${path}`);

const packageJson = JSON.parse(
  readFileSync(join(root, "package.json"), "utf8"),
);
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
  if (!catalogueSlugs.has(demo.catalogueSlug))
    failures.push(
      `Demo ${demo.id} references unknown catalogue slug ${demo.catalogueSlug}`,
    );
  if (!demo.exampleKey || !demo.title.trim())
    failures.push(`Demo ${demo.id} is missing its example key or title`);
}
for (const slug of catalogueSlugs)
  if (!catalogueDemoMetadata.some((demo) => demo.catalogueSlug === slug))
    failures.push(`Catalogue family has no canonical demo: ${slug}`);
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
  const playgroundFiles = readdirSync(playgroundRoot, {
    recursive: true,
  }).filter(
    (file) => String(file).endsWith(".ts") || String(file).endsWith(".tsx"),
  );
  const playgroundText = playgroundFiles
    .map((file) => readFileSync(join(playgroundRoot, file), "utf8"))
    .join("\n");
  const playgroundIds = [
    ...playgroundText.matchAll(/id:\s*["']([^"']+)["']/g),
  ].map((match) => match[1]);
  if (new Set(playgroundIds).size !== playgroundIds.length)
    failures.push("Playground IDs are not unique");
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
  const accidental = join(root, "dist/docs/v100/index.html");
  const latestDeep = join(
    root,
    "dist/docs/latest/components/actions/button/index.html",
  );
  const legacyComponent = join(
    root,
    "dist/components/actions/button/index.html",
  );
  if (
    existsSync(join(root, "dist")) &&
    (!existsSync(canonicalRoot) ||
      !existsSync(canonicalDeep) ||
      !existsSync(latestDeep) ||
      !existsSync(legacyComponent) ||
      existsSync(accidental))
  ) {
    console.error("FAIL: built version route invariant failed");
    process.exitCode = 1;
  } else {
    console.log(
      `PASS: standalone documentation contract; canonical=${docsRoute(currentDocumentationVersion)} latest=${latestRoute()}`,
    );
  }
}
