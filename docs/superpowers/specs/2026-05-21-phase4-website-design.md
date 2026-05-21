# Phase 4 — Full Website Design Spec
# veritas-software.net

**Date:** 2026-05-21
**Status:** Approved — ready for implementation planning

---

## 1. Design Philosophy

The site shares direct DNA with [addsubtract.media](https://addsubtract.media): same font stack, same editorial conventions (`// NN` section labels, em-accent headings, crosshair placeholders), same tab-as-theme architecture. Each Veritas app owns a distinct visual "room" pulled from an AddSubtract tab, making the site feel like a coherent family while giving each app personality.

The homepage maps to AddSubtract's homepage palette. Each app page maps to a named tab:

| App | Source tab | Hero bg | Primary accent | CTA color |
|---|---|---|---|---|
| Threadline | Gallery | `#2E2A4F` deep purple | `#FE5D31` coral | `#80FF00` acid |
| Billable | Gear | `#243E35` forest green | `#FF6600` safety orange | `#FF6600` |
| Callsheet | Blog | `#06267B` cobalt blue | `#2FD3DC` cyan | `#FF6600` orange |
| Homepage | Homepage | `#000022` navy-deep | `#80FF00` acid | — |

Future pages (about, blog, etc.) should each map to a remaining AddSubtract tab by the same logic.

---

## 2. Design Tokens

Update `public/styles/global.css` with these revised values. Two tokens change from Phase 3:

```css
:root {
  /* backgrounds */
  --black:    #000022;   /* was #0A0A0A — now navy-deep, matches AddSubtract HP */
  --ink:      #111133;   /* navy-mid */
  --line:     #222255;   /* navy-panel */
  --offwhite: #E8E6E1;
  --muted:    #9A9893;

  /* accents — UPDATED */
  --acid:     #80FF00;   /* was #C5FF3D — more electric, less chartreuse */
  --orange:   #FF6600;   /* was #FF8137 — safety orange (traffic cone) */

  /* app-specific accents */
  --tl-accent:  #FE5D31;   /* Threadline coral (Gallery tab) */
  --tl-cta:     #80FF00;   /* Threadline CTA = acid */
  --bl-accent:  #FF6600;   /* Billable safety orange (Gear tab) */
  --cs-accent:  #2FD3DC;   /* Callsheet cyan (Blog tab) */
  --cs-cta:     #FF6600;   /* Callsheet CTA = orange (matches blog-nav-cta) */

  /* homepage hero zones */
  --hp-hero-right: #3A1A3F;  /* deep purple hero right panel */
  --hp-footer:     #2C0033;  /* dark purple footer */

  /* fonts — unchanged */
  --font-display: 'Bebas Neue', sans-serif;
  --font-cond:    'Barlow Condensed', sans-serif;
  --font-body:    'Barlow', sans-serif;
  --font-mono:    'Space Mono', ui-monospace, Menlo, monospace;
}
```

---

## 3. Typography Conventions

Inherited from AddSubtract. Apply consistently across all pages:

- **Section labels:** `// 01 Label` — `font-family: var(--font-mono)`, `font-size: 9–10px`, `letter-spacing: .28em`, `text-transform: uppercase`, color = page accent.
- **Section titles:** Bebas Neue, `40–44px`, `letter-spacing: .04em`. Key word wrapped in `<em>` and colored with page accent.
- **Hero titles:** Bebas Neue, `56–80px`, `line-height: .92`. Accent word in `<span>` colored with app accent.
- **Eyebrows / cats:** Space Mono, `9–10px`, `.18–.28em` letter-spacing, uppercase, `opacity: .65–.75`.
- **Body copy:** Barlow, `15px`, `line-height: 1.75`, color `rgba(232,230,225,.65)` on dark bg.
- **Feature titles:** Barlow Condensed, `700`, `15–16px`, `.06em`, uppercase.
- **Labels / tags:** Space Mono, `8–9px`, `.14–.18em`, uppercase.

---

## 4. Shared Components

### 4.1 `SiteNav.astro`

Renders the global top navigation. Used on the homepage only (app pages use per-app navs built into their layouts).

```
┌─────────────────────────────────────────────────────────┐
│ VERITAS             Threadline   Billable   Callsheet    │
└─────────────────────────────────────────────────────────┘
```

- Height: `52px`. Background: `var(--black)` (`#000022`).
- Bottom border: `1px solid rgba(128,255,0,.18)` (acid tint).
- Brand: Bebas Neue, `20px`, `.12em` tracking.
- Nav links: Space Mono, `9px`, `.16em`, uppercase. Per-link accent colors:
  - Threadline → `#FE5D31` coral
  - Billable → `#FF6600` safety orange
  - Callsheet → `#2FD3DC` cyan
- Links at `opacity: .55`, hover `opacity: 1`.
- Props: `activePage?: 'threadline' | 'billable' | 'callsheet'` — highlights active app link at full opacity.

### 4.2 `SiteFooter.astro`

Used on the homepage.

- Background: `#2C0033` (AddSubtract HP footer color).
- Top border: `1px solid rgba(47,211,220,.2)` (cyan rule — AddSubtract HP footer).
- Three-column grid: `2fr 1fr 1fr`.
  - Col 1: VERITAS wordmark (Bebas, `28px`) + tagline (mono, `9px`, muted).
  - Col 2: Apps column — label in acid, links in per-app accent colors.
  - Col 3: Legal column — label in acid, links muted.
- Footer bottom bar: copyright left, "Built with Astro · Cloudflare Pages" right. Both mono `8px` muted. Divided by `1px solid rgba(47,211,220,.15)`.

### 4.3 `LegalLayout.astro`

Extracts the repeated header/footer/style block from the 6 existing legal pages. Replaces the current pattern where each page embeds its own copy.

- Wraps `Layout.astro`.
- Adds `<meta name="robots" content="noindex">` (NIT 3 — legal pages out of search results).
- Header: `VERITAS SOFTWARE` brand link + page label (`Privacy` / `Support`).
- Scoped styles shared across all 6 pages.
- Props: `title`, `description`, `app: 'threadline' | 'billable' | 'callsheet'`, `pageType: 'privacy' | 'support'`.

### 4.4 `AppCard.astro`

The card unit used in the homepage hero right panel.

```
┌─────────────────────────────────────────────┐
│ APP NAME              [ghost initials: TL]  │
│ Category · iOS                              │  ← ghost: 64px Bebas, top-right,
│ ▬▬▬                    [LEARN MORE →]       │     opacity ~6%, overflows card top
└─────────────────────────────────────────────┘
```

- Card bg: `rgba(0,0,20,.5)` on the purple hero-right.
- Border: `1px solid rgba([accent-rgb],.2)`.
- Ghost: Bebas Neue, `64px`, `top: -6px; right: -4px`, `opacity: ~6%`, color = app accent.
- Name: Bebas Neue, `22px`, `.06em`. Category: Space Mono, `9px`, muted.
- Accent underline rule: `28px × 2px`, color = app accent.
- CTA button: Space Mono, `8px`, `700`, `.14em`, uppercase. Background = app accent, color `#000`.
- Layout: `display: flex; align-items: center; justify-content: space-between`.
- Props: `app`, `name`, `category`, `href`, `accent` (hex), `ghost` (2-letter initials).

### 4.5 `AppHero.astro`

The hero section at the top of each app page. Used by all three app pages.

```
[nav bar — app-specific bg + accent]
[eyebrow: // 01 Category]
[TITLE WORD]          ← Bebas 56–72px
[ACCENT WORD.]        ← in app accent color
[subtitle: devices]
[──────────────────]  ← border-top with accent tint
[pill] [pill] [pill]  ← feature/tab pills (static, not JS)
```

- Background: app hero bg color.
- Nav bar: app bg, bottom border `1px solid rgba([accent],.2)`. VERITAS · APPNAME brand left, APP STORE → CTA right (placeholder, no live URL yet — button renders but `href="#"`).
- Eyebrow: `// 0N Category` in app accent, mono, `.28em`.
- Filter pills: mono `8px`, bordered, accent `.2` border; active pill = solid accent bg, black text.
- Props: `app`, `heroTitle` (array of lines), `accentLine` (the accent-colored line), `subtitle`, `eyebrow`, `pills`.

---

## 5. Page Designs

### 5.1 Homepage (`/`)

**Layout:** AddSubtract homepage structure.

```
[SiteNav]
[Split hero: left=headline, right=app cards]
[Acid ticker strip]
[// 01 About section]
[SiteFooter]
```

**Hero left** (`#000022` bg):
- Eyebrow: `// SOFTWARE FOR CREATIVE BUSINESSES`, acid.
- Title: `BUILT FOR / CREATIVE / WORK` — `WORK` in acid.
- Sub: `iOS apps for freelancers & studios / Time · Billing · Production`, mono muted.

**Hero right** (`#3A1A3F` bg):
- Acid grid texture: `linear-gradient` crosshatch at `rgba(128,255,0,.04)`, `24px` grid.
- Color wash: `#222255` diagonal clip at bottom `38%`, `opacity: .55`.
- Three `AppCard` components (Threadline / Billable / Callsheet).

**Ticker strip:** Acid `#80FF00` bg, black mono text, `9px`, `.22em`. Content: `THREADLINE · TIME TRACKING · BILLABLE · INVOICING · CALLSHEET · PRODUCTION · iOS · VERITAS SOFTWARE ·` (repeating). Static — no JS marquee required; CSS `overflow: hidden` is fine.

**About section:**
- Section label: `// 01 About`, acid.
- Title: `WHO WE ARE` — `ARE` in acid.
- Body: 2–3 sentences on Veritas. Max-width `560px`.

### 5.2 App Pages (`/threadline/`, `/billable/`, `/callsheet/`)

**Layout B — Magazine Sections** used for all three apps.

```
[AppHero — app-themed nav + hero + filter pills]
[// 02 Features section: features list ↔ iPhone + iPad screenshots]
[// 03 On Your Wrist section: Watch screenshot ↔ additional features + App Store badge]
[App footer strip: Privacy · Support · ← All Apps]
```

**Features section (// 02):**
- Two-column grid: `1fr 1fr`, `40–60px` gap, `align-items: center`.
- Left: numbered feature list (01–03). Each item: number in accent (`.5` opacity), bold condensed title, muted body.
- Right: `display: flex; gap: 12px; align-items: flex-end` — iPhone placeholder (`100px` wide, `9:19.5` aspect ratio) + iPad placeholder (flex `1`, `4:3` aspect ratio).

**Watch section (// 03):**
- Background: slightly darker variant of hero bg (add `~8%` black overlay via bg on the section).
- Two-column: Watch placeholder left (`200px` max, `1:1`) + features (items 04–05) + App Store badge right.
- App Store badge: placeholder block, `border: 1px solid rgba([accent],.25)`, icon + "Download on the / App Store" text. `href="#"` until live.

**Screenshot placeholders:** AddSubtract crosshair style:
- `background: rgba([hero-bg-rgb],.8)`, `border: 1px solid rgba([accent],.12)`.
- `::before` (horizontal line) + `::after` (vertical line) forming a crosshair, both `rgba([accent],.2)`.
- Label: Space Mono, `8px`, `.18em`, accent at `.4` opacity. e.g. `iPhone — Timer View`.

**App footer strip:**
- Background: `8%` darker than hero bg.
- Border-top: `1px solid rgba([accent],.12)`.
- Links left: `Privacy Policy · Support · ← All Apps` — mono `8px`, muted, hover = accent.
- Copyright right: mono `8px`, `.25` opacity.

### 5.3 Legal Pages (existing — refactor only)

The 6 existing pages (`/[app]/privacy`, `/[app]/support`) are refactored to use `LegalLayout.astro`. Content unchanged. No URL changes — ASC URLs are locked.

---

## 6. Infrastructure Pages

### 6.1 `robots.txt` (`public/robots.txt`)

```
User-agent: *
Allow: /
Disallow: /threadline/privacy
Disallow: /threadline/support
Disallow: /billable/privacy
Disallow: /billable/support
Disallow: /callsheet/privacy
Disallow: /callsheet/support

Sitemap: https://veritas-software.net/sitemap-index.xml
```

### 6.2 Favicon + OG Meta Tags (`src/layouts/Layout.astro`)

Add to `<head>` (NIT 2):

```html
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon.ico">
<meta property="og:title" content={title}>
<meta property="og:description" content={description}>
<meta property="og:url" content={Astro.url}>
<meta property="og:type" content="website">
```

Wire `og:title` and `og:description` to the existing `title` and `description` props. Add `og:url` from `Astro.url`.

### 6.3 Sitemap (`@astrojs/sitemap`)

Install and configure. Legal pages excluded via `filter` option (they have `noindex` anyway, belt-and-suspenders).

```js
// astro.config.mjs
import sitemap from '@astrojs/sitemap';
export default defineConfig({
  site: 'https://veritas-software.net',
  integrations: [sitemap({
    filter: (page) => !page.includes('/privacy') && !page.includes('/support'),
  })],
});
```

---

## 7. NITs Resolved in This Phase

| NIT | Resolution |
|---|---|
| NIT 1 — `index.astro` inline styles | Fixed: new homepage uses scoped `<style>` block |
| NIT 2 — Layout.astro favicon link | Fixed: added in § 6.2 |
| NIT 3 — Legal pages noindex | Fixed: added in `LegalLayout.astro` |
| NIT 4 — Redundant Cloudflare adapter | Deferred: remove only if Cloudflare Pages Functions are never needed; safe to leave |

---

## 8. Out of Scope (Phase 4)

- Real App Store URLs (all badges use `href="#"` until submission)
- Real app screenshots (crosshair placeholders throughout)
- Full Billable + Callsheet privacy policy text (expand placeholders — separate task within Phase 4)
- Mobile responsive breakpoints (Phase 5 — desktop-first for now)
- JS interactions (static only — no animated ticker, no filter JS)
- "About", "Blog", or other future pages (those map to remaining AddSubtract tabs per the established pattern)

---

## 9. Implementation Order

1. Update design tokens (`global.css` — acid + orange color change)
2. Extract `LegalLayout.astro` from the 6 existing legal pages
3. Update `Layout.astro` — favicon links + OG meta tags
4. Build `SiteNav.astro` + `SiteFooter.astro`
5. Build `AppCard.astro` + `AppHero.astro`
6. Build homepage (`/`)
7. Build Threadline app page (`/threadline/`)
8. Build Billable app page (`/billable/`)
9. Build Callsheet app page (`/callsheet/`)
10. Expand Billable + Callsheet privacy policies
11. Add `robots.txt` + sitemap integration
12. Build verify: `npm run build` → 10 routes expected
