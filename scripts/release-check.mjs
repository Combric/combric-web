import { spawnSync } from "node:child_process";

const isWindows = process.platform === "win32";
const packageManager = isWindows ? "pnpm.cmd" : "pnpm";
const steps = [
  ["format:check", {}, "pnpm format:check"],
  ["lint", {}, "pnpm lint"],
  ["typecheck", {}, "pnpm typecheck"],
  ["consumer:check", {}, "pnpm consumer:check"],
  [
    "build",
    { clearSiteUrl: true },
    "static build without COMBRIC_DOCS_SITE_URL",
  ],
  ["validate", {}, "pnpm validate (including built-route and Pagefind checks)"],
  ["test:e2e", {}, "pnpm test:e2e (Playwright and axe)"],
];

for (const [script, options, label] of steps) {
  console.log(`\n==> ${label}`);
  const env = { ...process.env };
  if (options.clearSiteUrl) delete env.COMBRIC_DOCS_SITE_URL;
  const executable = isWindows
    ? (process.env.ComSpec ?? "cmd.exe")
    : packageManager;
  const args = isWindows
    ? ["/d", "/c", `${packageManager} ${script}`]
    : [script];
  const result = spawnSync(executable, args, {
    env,
    stdio: "inherit",
  });
  if (result.error) {
    console.error(`FAIL: could not start ${label}: ${result.error.message}`);
    process.exit(result.status ?? 1);
  }
  if (result.status !== 0) {
    console.error(`FAIL: ${label} exited ${result.status}`);
    process.exit(result.status ?? 1);
  }
}

console.log("\nPASS: COMBRIC-WEB release-quality gate");
