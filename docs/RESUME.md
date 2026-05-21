# Resume Brief — veritas-software.net

**Last updated:** 2026-05-21 (Phases 1–3 complete — infra, scaffold, all legal pages, iOS URL migration)
**Current HEAD:** `e410fcd` (`chore: ignore .wrangler and .cloudflare build artifacts`)
**Latest tags:** none yet (tagging after Phase 4 ships)
**Resume at:** Phase 4 — Full Website Design. **MUST run `superpowers:brainstorming` FIRST** — the visual direction and IA for the homepage, app pages, and shared component architecture have not been decided yet. Plan scope at `docs/superpowers/plans/2026-05-20-veritas-software-net.md` § Phase 4.

---

## TL;DR for the new session

1. **Repo is clean and pushed.** HEAD `e410fcd`, no uncommitted changes.
2. **Phases 1–3 are done.** Infrastructure plan written, GitHub repo + Astro scaffold live, all 6 legal pages live, iOS app URLs updated, legacy redirect in place.
3. **Cloudflare UI steps still pending** (user action). Email Routing and Cloudflare Pages project connection have not been confirmed complete. Do NOT assume the domain is live — verify before any redirect or link testing.
4. **Design system is established.** Dark bg (`--black: #0A0A0A`), off-white text (`--offwhite`), acid green accent (`--acid: #C5FF3D`), Bebas Neue / Barlow Condensed / Barlow / Space Mono. Defined in `public/styles/global.css`. All 6 legal pages use it.
5. **Phase 4 scope** = homepage, 3 app pages, shared components (`AppCard`, `AppHero`, `SiteNav`, `SiteFooter`, `LegalLayout`), full Billable + Callsheet privacy policies, robots.txt, favicon/OG, sitemap. Details in plan § Phase 4.
6. **Phase 4 requires brainstorm first** — visual direction (dark editorial vs. lighter product aesthetic, hero treatment, app card design) has not been decided.
7. **4 known NITs** to address in Phase 4 (see below).
8. **Build command:** `npm run build` from repo root. No test suite — visual review is the quality gate.

---

## Where we are

### Shipped (no tags yet)

| Phase | Commits | Description |
|---|---|---|
| Phase 1 | — | Domain purchased (user), plan written, GitHub repo created via `gh` CLI |
| Phase 2 | `ec53e6e` | Astro scaffold, Cloudflare adapter, design tokens, Layout.astro, global.css |
| Phase 3 | `2ad75ca`–`e410fcd` | 6 legal pages, .gitignore fix |

### Phase 3 delivery summary (task-by-task)

| Task | Commit | Files |
|---|---|---|
| Threadline privacy page | `2ad75ca` | `src/pages/threadline/privacy.astro` |
| Threadline support page | `3838ddc` | `src/pages/threadline/support.astro` |
| Billable + Callsheet placeholders | `54cd45a` | `src/pages/billable/privacy.astro`, `src/pages/billable/support.astro`, `src/pages/callsheet/privacy.astro`, `src/pages/callsheet/support.astro` |
| .gitignore (.wrangler, .cloudflare) | `e410fcd` | `.gitignore` |

### Related changes in other repos (same session)

| Repo | Commit | Change |
|---|---|---|
| `Veritas_threadline` | `346fa2a` | `AppURLs.privacyPolicy` → `veritas-software.net/threadline/privacy`; new `AppURLs.support` constant added |
| `add-subtract-website` | `674be12` | `public/_redirects`: `/threadline/privacy → https://veritas-software.net/threadline/privacy 301` |

---

## Known NITs (carry into Phase 4)

1. **`src/pages/index.astro` — inline styles.** The placeholder homepage uses inline `style` attributes with hard-coded values (`72px`, `24px`, etc.). Migrate to component-scoped `<style>` block when replacing the placeholder with the real homepage in Phase 4.

2. **`src/layouts/Layout.astro` — no favicon link.** `public/favicon.ico` and `public/favicon.svg` exist but the Layout `<head>` doesn't reference either. Add `<link rel="icon" href="/favicon.svg" type="image/svg+xml"><link rel="icon" href="/favicon.ico">` to Layout.astro in Phase 4.

3. **Legal pages — no `<meta name="robots" content="noindex">`.** Privacy and support pages are valid for ASC but should probably stay out of search results. Add noindex meta to the shared `LegalLayout.astro` component when it's extracted in Phase 4.

4. **`@astrojs/cloudflare` adapter** — redundant for a fully static site (added speculatively). Remove if the site never uses Cloudflare Pages Functions / SSR. Safe to remove; `output: 'static'` builds without it. If removed, also change `output` back to the default (remove the key entirely).

---

## Phase 3 learnings (2026-05-21)

- **Astro scoped styles work well per-page** but will cause style duplication as the page count grows. Extracting a `LegalLayout.astro` component with shared styles should be Phase 4 Task 1 — before touching any existing legal pages, not after.
- **The `swift-format-on-save` hook in the Threadline iOS repo auto-commits** when a Swift file is saved, using a generic "Update [FileName].swift" message. This is expected project behavior, not a bug. Don't fight it.
- **Subagent-driven development** worked well here: 9 tasks, 0 fix-implementer cycles needed. The tasks were well-specified enough that combined spec+quality reviews passed on first attempt for all 9.
- **Cloudflare Email Routing auto-adds MX records** to the DNS zone when enabled — no manual DNS editing needed. The `_redirects` file for Cloudflare Pages redirect rules must live in `public/`, not at the project root.

---

## Where we're going

```
Phase 4 — Full Website Design
  4a. Brainstorm + design decisions (NOT code — human checkpoint required first)
  4b. Shared component extraction (LegalLayout, SiteNav, SiteFooter, AppCard, AppHero)
  4c. Homepage (/, app card grid)
  4d. App pages (/threadline/, /billable/, /callsheet/)
  4e. Full Billable + Callsheet privacy policies
  4f. robots.txt, favicon/OG, sitemap
```

**Gate:** Phase 4 starts with brainstorm. No code before design decisions are locked.

---

## How to start work in the next session

1. **Verify state:**
   ```bash
   cd /Users/seth/Documents/GitHub/veritas-software-net
   git status           # expect: clean, nothing to commit
   git log --oneline -5 # HEAD should be e410fcd
   npm run build        # expect: exit 0, 8 routes prerendered
   ```
2. **Read** `docs/RESUME.md` (this file) — especially TL;DR and NITs.
3. **Invoke `superpowers:brainstorming`** before writing any Phase 4 code. The design direction (dark editorial / lighter product, hero treatment, app card style, navigation, typography scale) must be decided with the user before implementation.
4. **After brainstorm**, write a Phase 4 implementation plan (invoke `superpowers:writing-plans`) and save to `docs/superpowers/plans/2026-05-21-phase4-website-design.md`.
5. Execute Phase 4 via `superpowers:subagent-driven-development`.
6. **Wrap:** tag `phase4-complete` annotated, push tag, refresh this RESUME.md, then STOP.

---

## Conventions

- **Commits:** `area: imperative description`. Examples: `feat: add homepage`, `chore: extract LegalLayout component`
- **Build:** `npm run build` from repo root. No automated tests — build success + browser visual review is the quality gate.
- **No CSS framework.** Use design tokens from `public/styles/global.css` and scoped `<style>` blocks in `.astro` components.
- **Fonts:** loaded globally via Layout.astro's Google Fonts `<link>`. Don't add font loads per-page.
- **Static only:** `output: 'static'` in `astro.config.mjs`. No SSR.
- **Deploy:** push to `main` = auto-deploy on Cloudflare Pages (once the Pages project is connected by the user).
- **URL structure locked:** `veritas-software.net/[app]/privacy` and `/[app]/support` — do not rename these paths.
