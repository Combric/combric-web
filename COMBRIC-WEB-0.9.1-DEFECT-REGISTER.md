# COMBRIC-WEB-0.9.1 — Audit and Defect Register

Status: COMBRIC-WEB-0.9.1 implementation, published Framework 1.1.1 integration, Product Owner visual QA, and C-05 browser regression are complete. Promotion evidence is recorded in the associated pull request and CI history.

## Scope and evidence

- Consumer repository: `Combric/combric-web`.
- Published packages installed by this consumer: all six public `@combric/*@1.1.1` packages from the npm registry. `@combric/core` remains private and is not consumed.
- Evidence reviewed: frozen pnpm install, npm consumer smoke, published package CSS/declarations and token exports under `node_modules/@combric/*/dist`, all current catalogue routes at desktop/tablet/mobile widths, canonical demo preview/source definitions, and C-05 loaded/failed-image browser regressions.
- No Framework source/API, package publication, hosting, deployment, or Web 1.0 release operation was changed. The Web consumer dependencies were upgraded from the real registry release 1.0.0 through 1.1.0 to 1.1.1.

## Framework 1.1.0 and 1.1.1 regression disposition

The findings below were originally reproduced against Framework 1.0.0. The
published 1.1.0 packages were retested in Combric Web; C-01 through C-04 are
resolved by the real 1.1.0 release and were not patched or concealed in Web.
C-05 was reproduced against the published 1.1.0 package and resolved by the
published 1.1.1 release. Browser coverage uses Chromium desktop and mobile
Chromium; Firefox was not part of the configured Playwright projects.

The 1.1.0 Web catalogue now documents Button `accent` / `danger` variants,
Button/Card radius presets, Card tones, and Slider fill at representative values
including a non-zero minimum. Their previews and displayed/copied source remain
paired through the canonical demo registry.

## A — Combric Web presentation defects fixed

| Finding                                                                                                                                                                                                                             | Resolution                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Documentation chrome used a generic Starlight/blue visual treatment and lacked a coherent dark counterpart.                                                                                                                         | Mapped Starlight-only variables to the approved warm/graphite palette, using the technical accent sparingly. Published component tokens are left untouched.                                                                                                                                                                                                               |
| Major destinations competed with the documentation sidebar, and the Docs destination could not resolve its latest overview.                                                                                                         | Added a responsive Starlight `SiteTitle` override with the official Combric mark, Home, Docs, Components and Playground links; Docs routes through the version registry, `/docs/latest/` resolves to the active SemVer overview, and deep aliases retain trailing-slash paths. GitHub, Search and Theme remain available through Starlight controls.                      |
| Component pages exposed an unhelpful `Overview`-only TOC.                                                                                                                                                                           | Component and layout content now has semantic section headings; the dynamic docs route passes Starlight's rendered headings to its built-in TOC.                                                                                                                                                                                                                          |
| Dense component catalogue was difficult to scan.                                                                                                                                                                                    | Component groups are collapsed by default and central sidebar/page rhythm was normalized without removing catalogue entries.                                                                                                                                                                                                                                              |
| Demo actions, preview and source did not form one consistent unit; Starlight markdown spacing leaked into preview siblings and misaligned inactive Tabs labels; native CSS/Tailwind comparison could overlap.                       | Added a shared demo shell/action area, consistent preview/source surfaces, and Starlight's `not-content` boundary so markdown spacing cannot distort Framework demos. The comparison layout is centrally responsive. `View code` and `Copy code` consume the same canonical source string as the rendered example.                                                        |
| API and homepage hierarchy did not communicate the stable, Native CSS-first product clearly.                                                                                                                                        | Structured public export/contract presentation from existing catalogue metadata and revised the homepage around stable status, React, optional Tailwind, Docs, Components and Playground.                                                                                                                                                                                 |
| Visual QA remediation #1 found inherited homepage card margins, an oversized TOC rail, stretched intrinsic preview controls, misleading Avatar examples, and full-width surfaces/layouts shrinking inside the compact preview grid. | Reset margins uniformly across the feature-card grid; at wide desktop widths, use a 10rem TOC index and 48rem content measure while preserving the left sidebar; keep intrinsic controls compact while semantically stretching form structures, display/feedback surfaces and layout primitives; use a deterministic Avatar fallback and bottom-aligned size comparisons. |

## B — Documentation and demo coverage gaps closed

All added examples are registered in `src/data/catalogue-demos.ts` and defined once in `src/examples/catalogue-examples.tsx`. The canonical identity, preview, displayed source and copy source remain linked through the existing demo architecture. Representative coverage added or completed:

| Family / components                                            | Capability dimensions represented                                                                                                                                        |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Button, Toggle, Toggle Group                                   | Button variants, sizes and disabled state; toggle pressed/unpressed/disabled; toggle-group selection and orientation.                                                    |
| Input, Textarea, Checkbox, Radio Group, Switch, Select, Slider | Relevant disabled, invalid, required, checked/unchecked, selected/off and range states supported by the published contracts.                                             |
| Field, Fieldset, Input Group                                   | Valid/disabled field grouping and an input action configuration.                                                                                                         |
| Breadcrumb, Pagination, Tabs                                   | Functional navigation examples, including a disabled Tabs trigger.                                                                                                       |
| Avatar, Badge, Separator, Card, Table, Description List        | Supported avatar sizing, badge tones/variants and decorative separator behavior, plus the published display patterns.                                                    |
| Accordion, Collapsible                                         | Disabled-item/disabled-control behavior where supported.                                                                                                                 |
| Dialog, Drawer, Dropdown Menu, Popover, Tooltip                | Existing canonical interaction examples retained; Drawer side and representative positioning/alignment configurations added where published contracts allow them.        |
| Alert, Toast, Progress, Spinner, Skeleton, Empty State         | Alert tones and assertive live-region opt-in; Toast priority; determinate/indeterminate Progress; labelled and decorative Spinner semantics; empty-state heading levels. |
| Container, Stack, Inline, Cluster, Grid                        | Published size, gap, alignment and explicit-column axes represented with bounded examples.                                                                               |

No unsupported variant or prop was added to the documented API. Examples intentionally cover meaningful dimensions without rendering every prop combination.

## C — Published Framework defects / candidate gaps — record only

The remediation #1 Avatar review found no new Framework defect. The published `@combric/react@1.0.0` Avatar sizes render at 32, 40 and 48 CSS pixels; the perceived mismatch came from the Web comparison wrapper centering unequal sizes, and the broken image came from a deliberately nonexistent Web demo URL. The canonical consumer demo now provides a deterministic fallback and a shared bottom baseline. No package CSS was overridden.

### C-05 — AvatarImage can leave fallback text visible over a loaded image (resolved in 1.1.1)

**Classification:** Published Framework defect — `@combric/react@1.1.0` Avatar.

**Evidence:** On the current and `/docs/latest/` Avatar pages, the canonical demo's local image loads successfully (`complete: true`, `naturalWidth: 1528`) while the Avatar remains `data-state="loading"`; its `AvatarFallback` remains visible (`hidden: false`, computed display `block`) and renders `DA` over the photograph. The issue reproduces after a fresh page load in Chromium. The package's image status is advanced by its load handler, so an image already complete before that handler runs can leave the component in the loading state.

**Expected:** Once the supplied photo has loaded, it is visible without fallback text layered over it; fallback remains available for loading/error states.

**Disposition:** Resolved in the published `@combric/react@1.1.1` load-state fix. The Web consumer browser regression confirms that a successfully loaded photo is visible with `AvatarFallback` hidden and that a failed image shows the fallback. The Product Owner visually approved the v1.1.1 Avatar page, including crop, geometry, and alignment. No Web CSS or demo-markup workaround was introduced.

### C-01 — Shared square-only radius prevents functional geometry (resolved in 1.1.0)

**Classification:** Framework defect/gap — `@combric/tokens` and affected `@combric/react` styles.

**Evidence:** Published `@combric/tokens@1.0.0` resolves the semantic `radius` token to `radius.square`, whose value is `0`; the public token CSS exposes that shared value as `--combric-radius`. Published React CSS consumes that same variable for Button, Card and numerous functional controls/surfaces. The consumer therefore cannot deliver the approved Button/Card `0.250rem` signature while independently giving inputs, switches, slider parts, overlays and other controls their appropriate geometry without overriding the Framework contract.

**Disposition:** Resolved by published 1.1.0 semantic radius roles and Button/Card presets. Browser checks against npm packages verify the default Button/Card radii are 4px (`0.25rem`) and the public presets render square, `sm`, `md`, `lg`, and full geometry. No Web CSS override or markup workaround was added.

### C-02 — Published token/component styles have no dark-theme token contract (resolved in 1.1.0)

**Classification:** Framework defect/gap — `@combric/tokens` and `@combric/react`.

**Evidence:** The published token CSS defines its component-facing color variables in the default `:root` set (white canvas, neutral surfaces/text and blue accent). The published React stylesheet consumes those variables. The installed token stylesheet exposes no corresponding dark selector/media token set, so changing documentation chrome to graphite does not make real published component previews adopt a coherent dark palette.

**Disposition:** Resolved by the published 1.1.0 dark semantic token set. Browser checks verify the real token values and component accessibility in dark mode; Web does not recolor Framework components.

### C-03 — Approved Combric palette is not representable by the published semantic palette (resolved in 1.1.0)

**Classification:** Candidate Framework token/design-system gap — `@combric/tokens`.

**Evidence:** The published token names/values include neutral, blue and red primitives, but not the approved warm canvas `#F2F0EA` or technical accent `#E64A2E`; current semantic canvas/accent resolve to white/blue. The Web documentation shell can use the approved palette through Starlight's own variables, but applying it to actual component previews would require replacing published component tokens and would violate the reference-consumer rule.

**Disposition:** Resolved by the published 1.1.0 semantic palette. Browser checks confirm the expected light and dark canvas, accent, and border values. No Web-only replacement token system or component recoloring was introduced.

### C-04 — Toast live-region role is not allowed on its list item element (resolved in 1.1.0)

**Classification:** Published Framework accessibility defect — `@combric/react` Toast.

**Evidence:** With the published normal and assertive Toast examples rendered on the Toast page, axe 4.13 reports `aria-allowed-role` and `aria-required-children`: the package emits `<li role="status">` and `<li role="alert">` inside the ordered-list viewport. The behavior and live priority can be observed, but the role/host-element pairing fails the accessibility audit.

**Disposition:** Resolved by published 1.1.0 Toast semantics. The current polite/assertive consumer examples pass the Web axe regression without `aria-allowed-role` or `aria-required-children` violations. Web does not change Toast markup or role semantics; the assertive example remains opened on demand.

## Approval and release boundary

- Product Owner visual QA is complete: `VISUAL PASS` confirmed the loaded photograph, hidden fallback text, crop, geometry, demo alignment, and no blocking regression.
- COMBRIC-WEB-1.0 is a separate milestone and was not started as part of this closure.
- Cloudflare Pages and `combric.dev` deployment remain outside COMBRIC-WEB-0.9.1.
