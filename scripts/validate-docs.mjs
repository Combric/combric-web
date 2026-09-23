import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";

const root = process.cwd();
const failures = [];
const required = [
  "src/data/catalogue.ts",
  "src/playground",
  "src/content/docs/layout/container.mdx",
  "src/content/docs/layout/stack.mdx",
  "src/content/docs/layout/inline.mdx",
  "src/content/docs/layout/cluster.mdx",
  "src/content/docs/layout/grid.mdx",
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
  console.log(
    `PASS: standalone documentation contract (${relative(root, join(root, "src"))})`,
  );
}
