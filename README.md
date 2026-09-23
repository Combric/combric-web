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
Production hosting/domain selection is intentionally outside this milestone.

Set `COMBRIC_DOCS_SITE_URL` to the approved canonical origin when building a
hosted release. Starlight uses that origin for canonical metadata and the
sitemap. No production domain is assumed in local or pull-request builds.
