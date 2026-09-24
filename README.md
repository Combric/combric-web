# Combric Web

Official Combric website, documentation, component catalogue, Playground, and
reference consumer. This standalone application consumes the published public
Combric packages (`1.0.0`) and never depends on the framework repository.

## Local development

Requires Node 24 and pnpm 10.

```sh
pnpm install --frozen-lockfile
pnpm dev
pnpm validate
pnpm build
pnpm test:e2e
```

The site preserves native CSS as the primary path; Tailwind remains optional.

MANUAL GATE — production hosting/domain not yet selected/configured

Set `COMBRIC_DOCS_SITE_URL` to the approved canonical origin when building a
hosted release. Starlight uses that origin for canonical metadata and the
sitemap. The release check intentionally builds without this variable; no
production domain or deployment is assumed or configured.

## Production deployment contract

This is a static Astro/Starlight site. Use Node 24 and pnpm 10, install with
`pnpm install --frozen-lockfile`, then run
`COMBRIC_DOCS_SITE_URL=https://approved.example pnpm build`. The output is
`dist/`; the origin must be an approved absolute `http(s)` origin without
credentials, query, or hash. The build emits Pagefind assets, sitemap,
canonical metadata, and `/robots.txt` with its sitemap reference. Before
release, verify `/`, `/docs/latest/`, `/docs/v1.0.0/`, `/playground/`, search,
the sitemap, robots, and the 404 route on the selected host. Hosting headers
and DNS remain provider responsibilities and are still a manual gate.
