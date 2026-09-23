import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import {
  currentDocumentationVersion,
  documentationVersions,
  docsRoute,
  latestRoute,
} from "../src/data/versions.ts";

const root = process.cwd();
const failures = [];
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

const catalogue = readFileSync(join(root, "src/data/catalogue.ts"), "utf8");
const ids = [...catalogue.matchAll(/id:\s*["']([^"']+)["']/g)].map(
  (match) => match[1],
);
if (new Set(ids).size !== ids.length)
  failures.push("Catalogue IDs are not unique");

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
  if (
    existsSync(join(root, "dist")) &&
    (!existsSync(canonicalRoot) ||
      !existsSync(canonicalDeep) ||
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
