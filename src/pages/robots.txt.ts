import { configuredSiteOrigin } from "../lib/siteOrigin";

export const prerender = true;
export function GET() {
  const origin = configuredSiteOrigin();
  const lines = ["User-agent: *", "Allow: /"];
  if (origin) lines.push("", `Sitemap: ${origin}/sitemap-index.xml`);
  return new Response(`${lines.join("\n")}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
