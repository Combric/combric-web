import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { spawnSync } from "node:child_process";
import { existsSync } from "node:fs";
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rm,
  writeFile,
} from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { currentDocumentationVersion } from "../src/data/versions.ts";

const repositoryRoot = process.cwd();
const packageJson = JSON.parse(
  await readFile(join(repositoryRoot, "package.json"), "utf8"),
);
const version = currentDocumentationVersion.packageVersion;
const publicPackages = currentDocumentationVersion.packages;
const nativePackages = publicPackages.filter(
  (item) => item.integration !== "adapter",
);
const adapterPackages = publicPackages.filter(
  (item) => item.integration === "adapter",
);

assert.equal(version, currentDocumentationVersion.id.slice(1));
assert.equal(publicPackages.length, 6);
assert.equal(new Set(publicPackages.map((item) => item.name)).size, 6);
for (const name of ["@combric/tokens", "@combric/layout", "@combric/react"]) {
  assert.equal(
    packageJson.dependencies[name],
    version,
    `${name} must match the current docs package version`,
  );
}

const temporaryRoot = await mkdtemp(join(tmpdir(), "combric-web-consumer-"));
const isWindows = process.platform === "win32";
const npmCommand = isWindows ? "npm.cmd" : "npm";

function run(command, args, cwd, { inherit = false } = {}) {
  const cmdFile = isWindows && command.toLowerCase().endsWith(".cmd");
  const executable = cmdFile ? (process.env.ComSpec ?? "cmd.exe") : command;
  const commandPath = command.includes(" ") ? `"${command}"` : command;
  const executableArgs = cmdFile
    ? ["/d", "/c", `${commandPath} ${args.join(" ")}`]
    : args;
  const result = spawnSync(executable, executableArgs, {
    cwd,
    encoding: "utf8",
    stdio: inherit ? "inherit" : "pipe",
  });
  if (result.error)
    throw new Error(`Could not run ${command}: ${result.error.message}`);
  if (result.status !== 0)
    throw new Error(
      `${command} ${args.join(" ")} failed with exit ${result.status}\n${result.stdout ?? ""}${result.stderr ?? ""}`,
    );
  return `${result.stdout ?? ""}${result.stderr ?? ""}`;
}

function packageDependencyMap(items) {
  return Object.fromEntries(items.map(({ name }) => [name, version]));
}

async function createFixture(name, dependencies, files = {}) {
  const directory = join(temporaryRoot, name);
  await mkdir(directory, { recursive: true });
  await writeFile(
    join(directory, "package.json"),
    `${JSON.stringify(
      {
        name: `combric-consumer-${name}`,
        version: "1.0.0",
        private: true,
        type: "module",
        dependencies,
      },
      null,
      2,
    )}\n`,
  );
  for (const [file, contents] of Object.entries(files))
    await writeFile(join(directory, file), contents);
  run(
    npmCommand,
    [
      "install",
      "--ignore-scripts",
      "--no-audit",
      "--no-fund",
      "--loglevel=error",
      "--registry=https://registry.npmjs.org/",
    ],
    directory,
    { inherit: true },
  );
  return directory;
}

async function assertInstalledVersion(directory, name) {
  const manifestPath = join(
    directory,
    "node_modules",
    ...name.split("/"),
    "package.json",
  );
  const installed = JSON.parse(await readFile(manifestPath, "utf8"));
  assert.equal(installed.name, name);
  assert.equal(
    installed.version,
    version,
    `${name} must install from npm at ${version}`,
  );
}

async function snapshotFiles(directory) {
  const files = new Map();
  async function visit(current) {
    for (const entry of await readdir(current, { withFileTypes: true })) {
      if (entry.name === "node_modules") continue;
      const absolute = join(current, entry.name);
      if (entry.isDirectory()) {
        await visit(absolute);
      } else if (entry.isFile()) {
        const contents = await readFile(absolute);
        files.set(
          relative(directory, absolute),
          createHash("sha256").update(contents).digest("hex"),
        );
      }
    }
  }
  await visit(directory);
  return files;
}

function runLocalBin(directory, name, args) {
  const executable = join(
    directory,
    "node_modules",
    ".bin",
    `${name}${isWindows ? ".cmd" : ""}`,
  );
  return run(executable, args, directory);
}

try {
  const nativeDependencies = {
    ...packageDependencyMap(nativePackages),
    react: packageJson.dependencies.react,
    "react-dom": packageJson.dependencies["react-dom"],
  };
  const native = await createFixture("native", nativeDependencies, {
    "styles.css": '@import "@combric/react/css";\n',
  });
  for (const item of nativePackages)
    await assertInstalledVersion(native, item.name);
  assert.equal(
    existsSync(join(native, "node_modules", "@combric", "core")),
    false,
    "the public consumer fixture must not install @combric/core",
  );
  assert.equal(
    existsSync(join(native, "node_modules", "tailwindcss")),
    false,
    "the native React fixture must not install Tailwind CSS",
  );

  const nativeProbe = String.raw`
    import assert from "node:assert/strict";
    import { readFile } from "node:fs/promises";
    import { fileURLToPath } from "node:url";
    import { createElement } from "react";
    import { renderToStaticMarkup } from "react-dom/server";
    import * as tokens from "@combric/tokens";
    import * as components from "@combric/react";
    assert.ok(Object.keys(tokens).length > 0);
    assert.equal(typeof components.Button, "function");
    const html = renderToStaticMarkup(createElement(components.Button, null, "Public consumer"));
    assert.match(html, /Public consumer/);
    for (const specifier of ["@combric/tokens/css", "@combric/layout/css", "@combric/react/css"]) {
      const entry = import.meta.resolve(specifier);
      assert.ok((await readFile(fileURLToPath(entry), "utf8")).trim().length > 0, specifier);
    }
    console.log("PASS: published tokens, layout CSS, and React work without Tailwind");
  `;
  run(process.execPath, ["--input-type=module", "-e", nativeProbe], native);

  const beforeToolRuns = await snapshotFiles(native);
  const cliHelp = runLocalBin(native, "combric", ["--help"]);
  assert.match(cliHelp, /Commands|Usage/i);
  assert.match(
    runLocalBin(native, "combric", ["--version"]),
    new RegExp(version),
  );
  JSON.parse(runLocalBin(native, "combric", ["info", "--json"]));
  JSON.parse(runLocalBin(native, "combric", ["doctor", "--json"]));
  JSON.parse(
    runLocalBin(native, "combric", [
      "init",
      "--mode",
      "react",
      "--css-file",
      "styles.css",
      "--dry-run",
      "--json",
    ]),
  );
  assert.match(
    runLocalBin(native, "combric-guard", ["--version"]),
    new RegExp(version),
  );
  const guardResult = JSON.parse(
    runLocalBin(native, "combric-guard", ["check", "--json"]),
  );
  assert.equal(guardResult.schemaVersion, 1);
  assert.deepEqual(await snapshotFiles(native), beforeToolRuns);
  console.log(
    "PASS: published CLI and Guard entry points run without changing the consumer project",
  );

  const adapter = await createFixture("tailwind-adapter", {
    ...packageDependencyMap(adapterPackages),
    tailwindcss: packageJson.devDependencies.tailwindcss,
  });
  for (const item of adapterPackages)
    await assertInstalledVersion(adapter, item.name);
  const adapterProbe = String.raw`
    import assert from "node:assert/strict";
    import { readFile } from "node:fs/promises";
    import { fileURLToPath } from "node:url";
    import tailwindcss from "tailwindcss";
    assert.equal(typeof tailwindcss, "function");
    const css = await readFile(fileURLToPath(import.meta.resolve("@combric/tailwind")), "utf8");
    assert.match(css, /grid-combric-auto-sm/);
    assert.match(css, /--combric-space-3/);
    console.log("PASS: the optional published Tailwind adapter resolves independently");
  `;
  run(process.execPath, ["--input-type=module", "-e", adapterProbe], adapter);

  console.log(
    `PASS: public npm consumer smoke for ${currentDocumentationVersion.id} (${publicPackages.length} packages)`,
  );
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
