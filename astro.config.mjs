import react from "@astrojs/react";
import starlight from "@astrojs/starlight";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "astro/config";
import { catalogue } from "./src/data/catalogue.ts";
import {
  currentDocumentationVersion,
  docsRoute,
  latestRoute,
  legacyDocumentationPaths,
} from "./src/data/versions.ts";
import { configuredSiteOrigin } from "./src/lib/siteOrigin.ts";

const configuredSite = configuredSiteOrigin(process.env.COMBRIC_DOCS_SITE_URL);
const docs = (path) => docsRoute(currentDocumentationVersion, path);
const legacyRedirects = Object.fromEntries([
  ...legacyDocumentationPaths.map((path) => [`/${path}/`, latestRoute(path)]),
  ...catalogue.map((entry) => [entry.route, latestRoute(entry.route)]),
]);
const componentGroups = catalogue.reduce((groups, entry) => {
  const items = groups.get(entry.group) ?? [];
  items.push({ label: entry.title, link: docs(entry.route) });
  groups.set(entry.group, items);
  return groups;
}, new Map());
const componentSidebar = [...componentGroups].map(([label, items]) => ({
  label,
  items,
  collapsed: true,
}));

export default defineConfig({
  integrations: [
    starlight({
      title: "Combric",
      description: "Package-first UI framework documentation",
      logo: {
        src: "./src/assets/brand/combric-logo.png",
        alt: "Combric mark",
      },
      components: {
        SiteTitle: "./src/components/SiteTitle.astro",
      },
      tableOfContents: {
        minHeadingLevel: 2,
        maxHeadingLevel: 3,
      },
      customCss: ["./src/styles/docs.css", "./src/styles/tailwind-demos.css"],
      pagefind: true,
      head: [
        {
          tag: "script",
          content: `(() => {
            const labelSearchInput = () => {
              document
                .querySelectorAll("input.pagefind-ui__search-input:not([aria-label])")
                .forEach((input) => input.setAttribute("aria-label", "Search documentation"));
            };
            labelSearchInput();
            new MutationObserver(labelSearchInput).observe(document.documentElement, {
              childList: true,
              subtree: true,
            });
          })();`,
        },
      ],
      social: [
        {
          icon: "github",
          label: "Combric on GitHub",
          href: "https://github.com/Combric/combric",
        },
      ],
      sidebar: [
        { label: "Overview", link: docs() },
        {
          label: "Getting Started",
          items: [
            { label: "Introduction", link: docs("getting-started") },
            {
              label: "Installation",
              link: docs("getting-started/installation"),
            },
            {
              label: "Standard CSS",
              link: docs("getting-started/standard-css"),
            },
            { label: "React", link: docs("getting-started/react") },
            { label: "Tailwind", link: docs("getting-started/tailwind") },
            {
              label: "CLI & Developer Experience",
              link: docs("getting-started/cli"),
            },
          ],
        },
        {
          label: "Foundations",
          items: [
            { label: "Metriq", link: docs("foundations/metriq") },
            { label: "Colors", link: docs("foundations/colors") },
            { label: "Typography", link: docs("foundations/typography") },
            { label: "Spacing", link: docs("foundations/spacing") },
            { label: "Sizing", link: docs("foundations/sizing") },
            {
              label: "Borders & Radius",
              link: docs("foundations/borders-radius"),
            },
            { label: "Focus", link: docs("foundations/focus") },
            { label: "Motion", link: docs("foundations/motion") },
            { label: "Layers", link: docs("foundations/layers") },
            { label: "Token API", link: docs("foundations/token-api") },
          ],
        },
        {
          label: "Layout",
          items: [
            { label: "Container", link: docs("layout/container") },
            { label: "Stack", link: docs("layout/stack") },
            { label: "Inline", link: docs("layout/inline") },
            { label: "Cluster", link: docs("layout/cluster") },
            { label: "Grid", link: docs("layout/grid") },
          ],
        },
        {
          label: "Components",
          items: componentSidebar,
        },
        { label: "Accessibility", link: docs("accessibility") },
        { label: "Playground", link: "/playground/" },
        {
          label: "Reference",
          items: [
            { label: "Packages", link: docs("reference/packages") },
            { label: "Guard", link: docs("reference/guard") },
            { label: "Support & versioning", link: docs("reference/support") },
            { label: "Release safety", link: docs("reference/releasing") },
            { label: "Source & issues", link: docs("reference/source") },
          ],
        },
      ],
    }),
    react(),
  ],
  output: "static",
  vite: {
    plugins: [tailwindcss()],
  },
  redirects: {
    ...legacyRedirects,
  },
  site: configuredSite,
});
