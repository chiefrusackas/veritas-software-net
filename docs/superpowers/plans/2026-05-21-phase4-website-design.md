# Phase 4 — Full Website Design Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete veritas-software.net site — homepage, three app pages, legal page refactor, sitemap, robots.txt — matching the approved Phase 4 design spec at `docs/superpowers/specs/2026-05-21-phase4-website-design.md`.

**Architecture:** Astro 6 static site on Cloudflare Pages. Design tokens in `public/styles/global.css`. Shared components in `src/components/`. Two new layouts: `LegalLayout.astro` (legal pages) and `AppLayout.astro` (app marketing pages). App pages use CSS custom properties (`--page-bg`, `--page-accent`) to share one CSS block across three color themes.

**Tech Stack:** Astro 6, `@astrojs/cloudflare` adapter (static output), `@astrojs/sitemap`, Google Fonts (Bebas Neue / Barlow Condensed / Barlow / Space Mono), CSS `color-mix()` for opacity variants of token colors.

---

## File Map

### New files
| File | Purpose |
|---|---|
| `public/favicon.svg` | Minimal "V" SVG favicon so the link tag doesn't 404 |
| `src/layouts/LegalLayout.astro` | Shared chrome (header + footer + wrap) for all 6 legal pages |
| `src/layouts/AppLayout.astro` | Shared CSS scaffold for the 3 app marketing pages |
| `src/components/SiteNav.astro` | Global top nav (homepage only) |
| `src/components/SiteFooter.astro` | Global footer (homepage only) |
| `src/components/AppCard.astro` | App card unit used in homepage hero right panel |
| `src/components/AppHero.astro` | Hero + app nav used at top of each app page |
| `src/pages/threadline/index.astro` | Threadline marketing page |
| `src/pages/billable/index.astro` | Billable marketing page |
| `src/pages/callsheet/index.astro` | Callsheet marketing page |
| `public/robots.txt` | Crawler rules + sitemap URL |

### Modified files
| File | Change |
|---|---|
| `public/styles/global.css` | New color tokens (navy bg, acid green, safety orange, app accents) |
| `src/layouts/Layout.astro` | Add named `head` slot + favicon links + OG meta tags |
| `src/pages/index.astro` | Full homepage (replaces placeholder) |
| `src/pages/threadline/privacy.astro` | Swap to LegalLayout, drop duplicated chrome |
| `src/pages/threadline/support.astro` | Swap to LegalLayout, drop duplicated chrome |
| `src/pages/billable/privacy.astro` | Swap to LegalLayout, drop duplicated chrome + expand policy |
| `src/pages/billable/support.astro` | Swap to LegalLayout, drop duplicated chrome |
| `src/pages/callsheet/privacy.astro` | Swap to LegalLayout, drop duplicated chrome + expand policy |
| `src/pages/callsheet/support.astro` | Swap to LegalLayout, drop duplicated chrome |
| `astro.config.mjs` | Add `site` + `@astrojs/sitemap` integration |

---

## Task 1: Design Tokens

**Files:**
- Modify: `public/styles/global.css`

- [ ] **Step 1: Replace global.css**

Full file replacement. Two tokens change from Phase 3 (`--acid`, `--orange`). Three tokens shift to navy (`--black`, `--ink`, `--line`). App-specific accents and homepage hero tokens are new.

```css
:root {
  /* backgrounds */
  --black:    #000022;   /* nav-deep (was #0A0A0A) */
  --ink:      #111133;   /* navy-mid */
  --line:     #222255;   /* navy-panel */
  --offwhite: #E8E6E1;
  --muted:    #9A9893;

  /* accents */
  --acid:     #80FF00;   /* electric acid green (was #C5FF3D) */
  --orange:   #FF6600;   /* safety orange (was #FF8137) */

  /* app-specific accents */
  --tl-accent:  #FE5D31;   /* Threadline coral */
  --tl-cta:     #80FF00;   /* Threadline CTA = acid */
  --bl-accent:  #FF6600;   /* Billable safety orange */
  --cs-accent:  #2FD3DC;   /* Callsheet cyan */
  --cs-cta:     #FF6600;   /* Callsheet CTA = orange */

  /* homepage hero zones */
  --hp-hero-right: #3A1A3F;
  --hp-footer:     #2C0033;

  /* fonts */
  --font-display: 'Bebas Neue', sans-serif;
  --font-cond:    'Barlow Condensed', sans-serif;
  --font-body:    'Barlow', sans-serif;
  --font-mono:    'Space Mono', ui-monospace, Menlo, monospace;
}
*, *::before, *::after { box-sizing: border-box; }
html, body {
  margin: 0; padding: 0;
  background: var(--black);
  color: var(--offwhite);
  font-family: var(--font-body);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}
a { color: inherit; }
```

- [ ] **Step 2: Build check**

```bash
cd /Users/seth/Documents/GitHub/veritas-software-net
npm run build
```

Expected: build succeeds, 7 routes. The existing placeholder homepage and legal pages will now use navy backgrounds instead of near-black — that's correct.

- [ ] **Step 3: Commit**

```bash
git add public/styles/global.css
git commit -m "tokens: update to navy bg + acid green + safety orange" -- public/styles/global.css
```

---

## Task 2: Update Layout.astro + Create favicon.svg

**Files:**
- Modify: `src/layouts/Layout.astro`
- Create: `public/favicon.svg`

- [ ] **Step 1: Create minimal favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" fill="#000022"/>
  <text x="16" y="23" font-family="sans-serif" font-weight="700" font-size="22"
        text-anchor="middle" fill="#80FF00">V</text>
</svg>
```

Write this to `public/favicon.svg`.

- [ ] **Step 2: Update Layout.astro**

Add the named `head` slot (needed by LegalLayout in Task 3 to inject `noindex`), favicon links, and OG meta tags.

```astro
---
interface Props {
  title: string;
  description?: string;
}
const { title, description = 'Veritas software for creative businesses.' } = Astro.props;
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="description" content={description} />
    <title>{title}</title>
    <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="/favicon.ico" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:url" content={Astro.url} />
    <meta property="og:type" content="website" />
    <slot name="head" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow+Condensed:wght@300;400;700&family=Barlow:wght@300;400;500;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/styles/global.css" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: 7 routes, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/layouts/Layout.astro public/favicon.svg
git commit -m "layout: add head slot, favicon links, OG meta tags" -- src/layouts/Layout.astro public/favicon.svg
```

---

## Task 3: LegalLayout.astro + Refactor 6 Legal Pages

**Files:**
- Create: `src/layouts/LegalLayout.astro`
- Modify: `src/pages/threadline/privacy.astro`
- Modify: `src/pages/threadline/support.astro`
- Modify: `src/pages/billable/privacy.astro`
- Modify: `src/pages/billable/support.astro`
- Modify: `src/pages/callsheet/privacy.astro`
- Modify: `src/pages/callsheet/support.astro`

- [ ] **Step 1: Create LegalLayout.astro**

Contains the shared chrome (wrap, header, footer) and scoped styles. The named `head` slot in Layout.astro lets this layout inject the `noindex` meta.

```astro
---
import Layout from './Layout.astro';

interface Props {
  title: string;
  description?: string;
  app: 'threadline' | 'billable' | 'callsheet';
  pageType: 'privacy' | 'support';
}
const { title, description, pageType } = Astro.props;
const pageLabel = pageType === 'privacy' ? 'Privacy' : 'Support';
---
<Layout title={title} description={description}>
  <meta name="robots" content="noindex" slot="head" />
  <div class="wrap">
    <header class="top">
      <a href="/" class="brand">VERITAS <em>SOFTWARE</em></a>
      <span class="tagline">{pageLabel}</span>
    </header>
    <slot />
    <footer class="foot">
      <span>© {new Date().getFullYear()} Veritas Software</span>
    </footer>
  </div>
</Layout>

<style>
  .wrap {
    max-width: 780px;
    margin: 0 auto;
    padding: 0 24px;
  }
  header.top {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    border-bottom: 1px solid var(--line);
    padding: 28px 0 12px;
  }
  .brand {
    font-family: var(--font-display);
    font-size: 28px;
    letter-spacing: .08em;
    text-decoration: none;
    color: var(--offwhite);
  }
  .brand em {
    color: var(--acid);
    font-style: normal;
  }
  .tagline {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: var(--muted);
  }
  footer.foot {
    border-top: 1px solid var(--line);
    padding: 20px 0 40px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: var(--muted);
    letter-spacing: .12em;
  }
</style>
```

- [ ] **Step 2: Refactor `src/pages/threadline/privacy.astro`**

Drop the chrome HTML + chrome styles. Keep article content and article-specific styles.

```astro
---
import LegalLayout from '../../layouts/LegalLayout.astro';
const title = 'Threadline — Privacy Policy';
const description = 'Privacy policy for Threadline, a shop-management app for custom-decoration businesses. Local-first, with optional iCloud sync and an optional AI tier.';
---

<LegalLayout {title} {description} app="threadline" pageType="privacy">
  <article class="policy">
    <h1>Threadline Privacy Policy</h1>
    <p class="meta">Effective: 2026-05-20</p>

    <p>Threadline is a shop-management app for custom-decoration businesses. This
    policy explains what data Threadline collects, where it's stored, and how
    to delete it.</p>

    <h2>What we collect</h2>

    <h3>Data you enter</h3>

    <p>You enter business information during onboarding and through normal app use:</p>

    <ul>
      <li>Your business identity (name, address, phone, email, EIN, logo, signature).</li>
      <li>Your clients (names, contact methods, addresses, notes).</li>
      <li>Your orders, line items, production status, photos, shipments.</li>
      <li>Your catalog products, inventory items, invoices, expenses, payments.</li>
      <li>Your mileage entries, asset depreciation records, and 1099 records.</li>
      <li>AI "Ask My Business" questions and answers (stored locally as a queryable corpus).</li>
    </ul>

    <h3>Data Apple collects on our behalf</h3>

    <p>If you sign in with Apple, we receive your Apple ID identifier (a stable
    opaque string — not your real Apple ID email unless you explicitly share
    it). We use this only to associate your account across your own devices
    via Apple's Sign In With Apple service.</p>

    <p>If you subscribe to the AI tier, Apple processes your payment and
    provides us a receipt token. We never see your payment method.</p>

    <h3>Optional cloud features</h3>

    <p>If you enable the <strong>AI tier</strong> (a paid in-app subscription), Threadline may
    send aggregated business data to our backend for two purposes:</p>

    <ul>
      <li>Year-end financial narrative composition — text-based summaries of your annual totals.</li>
      <li>"Ask My Business" cloud fallback — only when the on-device Foundation Models runtime can't handle a query.</li>
    </ul>

    <p>Cloud requests are scoped to the minimum data needed to compose a
    response. We do not retain queries beyond the response cycle.</p>

    <p>If you enable <strong>iCloud sync</strong> (an Apple feature), your business data
    syncs across your Apple devices via Apple's CloudKit private database.
    CloudKit is a service Apple operates; we use the <strong>private</strong> database,
    which means <strong>only you have access</strong> — Threadline cannot read your records
    without your iCloud credentials.</p>

    <h2>What we don't collect</h2>

    <ul>
      <li>No location data.</li>
      <li>No analytics. We ship zero analytics SDKs in v1.0.</li>
      <li>No advertising identifiers.</li>
      <li>No browsing history or search history.</li>
      <li>No health, fitness, or sensitive personal data.</li>
      <li>No biometric data. Face ID / Touch ID is processed entirely on-device by Apple; we never see your face or fingerprint.</li>
    </ul>

    <h2>How we use the data</h2>

    <ul>
      <li>To render and edit your business records on your device.</li>
      <li>To sync your data across your own devices via iCloud (if you enable it).</li>
      <li>To compose AI-generated summaries when you ask (if you subscribe to the AI tier).</li>
      <li>To verify your in-app subscription status with the App Store.</li>
    </ul>

    <p>We do <strong>not</strong>:</p>

    <ul>
      <li>Sell your data to third parties.</li>
      <li>Share your data with advertisers.</li>
      <li>Use your data to train machine-learning models.</li>
      <li>Combine your data with data from other sources to identify you.</li>
    </ul>

    <h2>Where the data lives</h2>

    <ul>
      <li><strong>On your device</strong>: SwiftData local store (encrypted at rest by the iOS file system when your device is locked).</li>
      <li><strong>In your iCloud private database</strong> (if you enable sync): managed by Apple under your iCloud credentials.</li>
      <li><strong>On Threadline's backend</strong>: only when you use the AI tier, only for the duration of the request, not retained.</li>
      <li><strong>With Apple</strong>: Sign In With Apple identifier (if you signed in), IAP receipt token (if you subscribed).</li>
    </ul>

    <h2>How to delete your data</h2>

    <p><strong>In the app</strong>: Settings → Account → Delete Account. This:</p>

    <ul>
      <li>Removes your data from your device.</li>
      <li>Marks your records in CloudKit for deletion (if iCloud sync was enabled).</li>
      <li>Revokes the Sign In With Apple token (per App Store Guideline 5.1.1(v)).</li>
      <li>Cancels any active in-app subscription on a forward-looking basis; to immediately stop billing, also confirm cancellation via App Store → Subscriptions.</li>
    </ul>

    <p><strong>At the iCloud level</strong>: Settings → [your name] → iCloud → Manage
    Account Storage → Threadline → Delete Data removes the CloudKit private
    database contents.</p>

    <p><strong>At the App Store level</strong>: App Store → [your account] → Subscriptions
    → Threadline AI Tier → Cancel.</p>

    <p>We do not retain data after you delete your account. Backup snapshots
    held by CloudKit and the App Store follow Apple's standard retention
    windows (typically 30 days for billing records, plus any regulatory
    hold periods Apple applies).</p>

    <h2>Children's privacy</h2>

    <p>Threadline is a business app, not intended for use by children under 13.
    We do not knowingly collect data from children.</p>

    <h2>Contact</h2>

    <p>For privacy questions: <a href="mailto:privacy@veritas-software.net">privacy@veritas-software.net</a></p>

    <p>For data subject requests (delete, export, correct): same address, and
    use the in-app Settings → Account → Delete Account flow for fastest results.</p>

    <h2>Changes to this policy</h2>

    <p>If we change this policy, we'll update the version + effective date at
    the top of this document and surface the change in the app's release notes.</p>

    <h2>Jurisdiction</h2>

    <p>Threadline is operated from the United States. By using the app, you
    consent to your data being processed under U.S. law.</p>

  </article>
</LegalLayout>

<style>
  article.policy h1 {
    font-family: var(--font-display);
    font-size: 48px;
    letter-spacing: .04em;
    margin: 40px 0 4px;
  }
  .meta {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: .12em;
    text-transform: uppercase;
    margin: 0 0 40px;
  }
  article.policy h2 {
    font-family: var(--font-cond);
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    border-top: 1px solid var(--line);
    padding-top: 20px;
    margin: 40px 0 12px;
  }
  article.policy h3 {
    font-family: var(--font-cond);
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--muted);
    margin: 24px 0 8px;
  }
  article.policy p,
  article.policy li {
    font-size: 15px;
    max-width: 68ch;
  }
  article.policy ul {
    padding-left: 1.4em;
  }
  article.policy ul li {
    margin-bottom: 4px;
  }
  article.policy a {
    color: var(--acid);
  }
</style>
```

- [ ] **Step 3: Refactor `src/pages/threadline/support.astro`**

```astro
---
import LegalLayout from '../../layouts/LegalLayout.astro';
const title = 'Threadline — Support';
const description = 'Get help with Threadline, the shop-management app for custom-decoration businesses.';
---

<LegalLayout {title} {description} app="threadline" pageType="support">
  <article class="support">
    <h1>Threadline Support</h1>
    <p class="meta">Shop management for custom-decoration businesses</p>

    <section>
      <h2>Contact</h2>
      <p>Email us at <a href="mailto:support@veritas-software.net">support@veritas-software.net</a> and we'll respond within one business day.</p>
    </section>

    <section>
      <h2>Delete your account</h2>
      <p>Open Threadline → Settings → Account → Delete Account. This removes all your data from the device and from iCloud (if sync was enabled) and cancels any active subscription on a forward-looking basis.</p>
    </section>

    <section>
      <h2>Cancel your subscription</h2>
      <p>App Store → your account icon → Subscriptions → Threadline AI Tier → Cancel. Alternatively, use the Delete Account flow above.</p>
    </section>

    <section>
      <h2>Privacy</h2>
      <p><a href="/threadline/privacy">Read the Threadline Privacy Policy →</a></p>
    </section>
  </article>
</LegalLayout>

<style>
  article.support h1 {
    font-family: var(--font-display);
    font-size: 48px;
    letter-spacing: .04em;
    margin: 40px 0 4px;
  }
  .meta {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: .12em;
    text-transform: uppercase;
    margin: 0 0 40px;
  }
  section {
    margin-bottom: 40px;
  }
  article.support h2 {
    font-family: var(--font-cond);
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    border-top: 1px solid var(--line);
    padding-top: 20px;
    margin: 0 0 12px;
  }
  article.support p {
    font-size: 15px;
    max-width: 68ch;
  }
  article.support a {
    color: var(--acid);
  }
</style>
```

- [ ] **Step 4: Refactor `src/pages/billable/privacy.astro`**

Note: policy content is currently a placeholder — full text is written in Task 10. For now, swap the layout but keep the placeholder text.

```astro
---
import LegalLayout from '../../layouts/LegalLayout.astro';
const title = 'Veritas Billable — Privacy Policy';
const description = 'Privacy policy for Veritas Billable, a time-tracking and invoicing app for freelancers and studios.';
---

<LegalLayout {title} {description} app="billable" pageType="privacy">
  <article class="policy">
    <h1>Veritas Billable Privacy Policy</h1>
    <p class="meta">Effective: 2026-05-21</p>

    <p>Veritas Billable is a time-tracking and invoicing app for freelancers and creative studios. A complete privacy policy will be published here before the app's App Store launch.</p>

    <p>Questions: <a href="mailto:privacy@veritas-software.net">privacy@veritas-software.net</a></p>
  </article>
</LegalLayout>

<style>
  article.policy h1 {
    font-family: var(--font-display);
    font-size: 48px;
    letter-spacing: .04em;
    margin: 40px 0 4px;
  }
  .meta {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: .12em;
    text-transform: uppercase;
    margin: 0 0 40px;
  }
  article.policy p,
  article.policy li {
    font-size: 15px;
    max-width: 68ch;
  }
  article.policy ul {
    padding-left: 1.4em;
  }
  article.policy ul li {
    margin-bottom: 4px;
  }
  article.policy h2 {
    font-family: var(--font-cond);
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    border-top: 1px solid var(--line);
    padding-top: 20px;
    margin: 40px 0 12px;
  }
  article.policy h3 {
    font-family: var(--font-cond);
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--muted);
    margin: 24px 0 8px;
  }
  article.policy a {
    color: var(--acid);
  }
</style>
```

- [ ] **Step 5: Refactor `src/pages/billable/support.astro`**

```astro
---
import LegalLayout from '../../layouts/LegalLayout.astro';
const title = 'Veritas Billable — Support';
const description = 'Get help with Veritas Billable.';
---

<LegalLayout {title} {description} app="billable" pageType="support">
  <article class="support">
    <h1>Veritas Billable Support</h1>
    <p class="meta">Time-tracking and invoicing for creative studios</p>

    <section>
      <h2>Contact</h2>
      <p>Email <a href="mailto:support@veritas-software.net">support@veritas-software.net</a> and we'll respond within one business day.</p>
    </section>

    <section>
      <h2>Privacy</h2>
      <p><a href="/billable/privacy">Privacy Policy →</a></p>
    </section>
  </article>
</LegalLayout>

<style>
  article.support h1 {
    font-family: var(--font-display);
    font-size: 48px;
    letter-spacing: .04em;
    margin: 40px 0 4px;
  }
  .meta {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: .12em;
    text-transform: uppercase;
    margin: 0 0 40px;
  }
  section {
    margin-bottom: 40px;
  }
  article.support h2 {
    font-family: var(--font-cond);
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    border-top: 1px solid var(--line);
    padding-top: 20px;
    margin: 0 0 12px;
  }
  article.support p {
    font-size: 15px;
    max-width: 68ch;
  }
  article.support a {
    color: var(--acid);
  }
</style>
```

- [ ] **Step 6: Refactor `src/pages/callsheet/privacy.astro`**

```astro
---
import LegalLayout from '../../layouts/LegalLayout.astro';
const title = 'Veritas Callsheet — Privacy Policy';
const description = 'Privacy policy for Veritas Callsheet, a production call sheet app for film and video crews.';
---

<LegalLayout {title} {description} app="callsheet" pageType="privacy">
  <article class="policy">
    <h1>Veritas Callsheet Privacy Policy</h1>
    <p class="meta">Effective: 2026-05-21</p>

    <p>Veritas Callsheet is a production call sheet app for film and video crews. A complete privacy policy will be published here before the app's App Store launch.</p>

    <p>Questions: <a href="mailto:privacy@veritas-software.net">privacy@veritas-software.net</a></p>
  </article>
</LegalLayout>

<style>
  article.policy h1 {
    font-family: var(--font-display);
    font-size: 48px;
    letter-spacing: .04em;
    margin: 40px 0 4px;
  }
  .meta {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: .12em;
    text-transform: uppercase;
    margin: 0 0 40px;
  }
  article.policy p,
  article.policy li {
    font-size: 15px;
    max-width: 68ch;
  }
  article.policy ul {
    padding-left: 1.4em;
  }
  article.policy ul li {
    margin-bottom: 4px;
  }
  article.policy h2 {
    font-family: var(--font-cond);
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    border-top: 1px solid var(--line);
    padding-top: 20px;
    margin: 40px 0 12px;
  }
  article.policy h3 {
    font-family: var(--font-cond);
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--muted);
    margin: 24px 0 8px;
  }
  article.policy a {
    color: var(--acid);
  }
</style>
```

- [ ] **Step 7: Refactor `src/pages/callsheet/support.astro`**

```astro
---
import LegalLayout from '../../layouts/LegalLayout.astro';
const title = 'Veritas Callsheet — Support';
const description = 'Get help with Veritas Callsheet.';
---

<LegalLayout {title} {description} app="callsheet" pageType="support">
  <article class="support">
    <h1>Veritas Callsheet Support</h1>
    <p class="meta">Production call sheets for film and video crews</p>

    <section>
      <h2>Contact</h2>
      <p>Email <a href="mailto:support@veritas-software.net">support@veritas-software.net</a> and we'll respond within one business day.</p>
    </section>

    <section>
      <h2>Privacy</h2>
      <p><a href="/callsheet/privacy">Privacy Policy →</a></p>
    </section>
  </article>
</LegalLayout>

<style>
  article.support h1 {
    font-family: var(--font-display);
    font-size: 48px;
    letter-spacing: .04em;
    margin: 40px 0 4px;
  }
  .meta {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: .12em;
    text-transform: uppercase;
    margin: 0 0 40px;
  }
  section {
    margin-bottom: 40px;
  }
  article.support h2 {
    font-family: var(--font-cond);
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    border-top: 1px solid var(--line);
    padding-top: 20px;
    margin: 0 0 12px;
  }
  article.support p {
    font-size: 15px;
    max-width: 68ch;
  }
  article.support a {
    color: var(--acid);
  }
</style>
```

- [ ] **Step 8: Build check**

```bash
npm run build
```

Expected: 7 routes, build succeeds. Legal pages now served through LegalLayout.

- [ ] **Step 9: Commit**

```bash
git add src/layouts/LegalLayout.astro \
  src/pages/threadline/privacy.astro src/pages/threadline/support.astro \
  src/pages/billable/privacy.astro src/pages/billable/support.astro \
  src/pages/callsheet/privacy.astro src/pages/callsheet/support.astro
git commit -m "legal: extract LegalLayout, refactor all 6 pages" -- \
  src/layouts/LegalLayout.astro \
  src/pages/threadline/privacy.astro src/pages/threadline/support.astro \
  src/pages/billable/privacy.astro src/pages/billable/support.astro \
  src/pages/callsheet/privacy.astro src/pages/callsheet/support.astro
```

---

## Task 4: SiteNav.astro + SiteFooter.astro

**Files:**
- Create: `src/components/SiteNav.astro`
- Create: `src/components/SiteFooter.astro`

- [ ] **Step 1: Create `src/components/SiteNav.astro`**

```astro
---
interface Props {
  activePage?: 'threadline' | 'billable' | 'callsheet';
}
const { activePage } = Astro.props;
---
<nav class="site-nav">
  <a href="/" class="brand">VERITAS</a>
  <ul class="nav-links">
    <li class="nav-tl">
      <a href="/threadline/" class:list={['nav-link', { active: activePage === 'threadline' }]}>Threadline</a>
    </li>
    <li class="nav-bl">
      <a href="/billable/" class:list={['nav-link', { active: activePage === 'billable' }]}>Billable</a>
    </li>
    <li class="nav-cs">
      <a href="/callsheet/" class:list={['nav-link', { active: activePage === 'callsheet' }]}>Callsheet</a>
    </li>
  </ul>
</nav>

<style>
  .site-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    height: 52px;
    background: var(--black);
    border-bottom: 1px solid rgba(128, 255, 0, .18);
  }
  .brand {
    font-family: var(--font-display);
    font-size: 20px;
    letter-spacing: .12em;
    text-decoration: none;
    color: var(--offwhite);
  }
  .nav-links {
    display: flex;
    gap: 28px;
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .nav-link {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .16em;
    text-transform: uppercase;
    text-decoration: none;
    opacity: .55;
    transition: opacity .15s;
  }
  .nav-link:hover,
  .nav-link.active {
    opacity: 1;
  }
  .nav-tl .nav-link { color: #FE5D31; }
  .nav-bl .nav-link { color: #FF6600; }
  .nav-cs .nav-link { color: #2FD3DC; }
</style>
```

- [ ] **Step 2: Create `src/components/SiteFooter.astro`**

```astro
---
---
<footer class="site-footer">
  <div class="footer-inner">
    <div class="col-brand">
      <div class="footer-wordmark">VERITAS</div>
      <div class="footer-tagline">Software for creative businesses</div>
    </div>
    <div class="col-apps">
      <div class="col-label">Apps</div>
      <ul>
        <li><a href="/threadline/" class="link-tl">Threadline</a></li>
        <li><a href="/billable/" class="link-bl">Billable</a></li>
        <li><a href="/callsheet/" class="link-cs">Callsheet</a></li>
      </ul>
    </div>
    <div class="col-legal">
      <div class="col-label">Legal</div>
      <ul>
        <li><a href="/threadline/privacy">Threadline Privacy</a></li>
        <li><a href="/billable/privacy">Billable Privacy</a></li>
        <li><a href="/callsheet/privacy">Callsheet Privacy</a></li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© {new Date().getFullYear()} Veritas Software</span>
    <span>Built with Astro · Cloudflare Pages</span>
  </div>
</footer>

<style>
  .site-footer {
    background: var(--hp-footer);
    border-top: 1px solid rgba(47, 211, 220, .2);
  }
  .footer-inner {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 40px;
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 40px 40px;
  }
  .footer-wordmark {
    font-family: var(--font-display);
    font-size: 28px;
    letter-spacing: .08em;
    color: var(--offwhite);
    margin-bottom: 8px;
  }
  .footer-tagline {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: var(--muted);
  }
  .col-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: var(--acid);
    margin-bottom: 14px;
  }
  ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  ul a {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .14em;
    text-transform: uppercase;
    text-decoration: none;
    opacity: .65;
    transition: opacity .15s;
  }
  ul a:hover { opacity: 1; }
  .link-tl { color: #FE5D31; }
  .link-bl { color: #FF6600; }
  .link-cs { color: #2FD3DC; }
  .col-legal a { color: var(--muted); }
  .footer-bottom {
    border-top: 1px solid rgba(47, 211, 220, .15);
    display: flex;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 16px 40px;
    font-family: var(--font-mono);
    font-size: 8px;
    letter-spacing: .12em;
    color: var(--muted);
    opacity: .65;
  }
</style>
```

- [ ] **Step 3: Build check** (components not yet wired to any page — build still succeeds because Astro ignores unused components)

```bash
npm run build
```

Expected: 7 routes, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/components/SiteNav.astro src/components/SiteFooter.astro
git commit -m "components: add SiteNav and SiteFooter" -- src/components/SiteNav.astro src/components/SiteFooter.astro
```

---

## Task 5: AppCard.astro + AppHero.astro + AppLayout.astro

**Files:**
- Create: `src/components/AppCard.astro`
- Create: `src/components/AppHero.astro`
- Create: `src/layouts/AppLayout.astro`

- [ ] **Step 1: Create `src/components/AppCard.astro`**

Uses `--card-accent` CSS custom property so border, ghost, rule, and CTA button all derive from one value. `color-mix()` handles opacity variants without rgba() math at the call site.

```astro
---
interface Props {
  name: string;
  category: string;
  href: string;
  accent: string;  /* hex value, e.g. '#FE5D31' */
  ghost: string;   /* 2-letter initials, e.g. 'TL' */
}
const { name, category, href, accent, ghost } = Astro.props;
---
<div class="app-card" style={`--card-accent: ${accent};`}>
  <div class="ghost" aria-hidden="true">{ghost}</div>
  <div class="card-body">
    <div class="card-name">{name}</div>
    <div class="card-cat">{category} · iOS</div>
    <div class="card-rule"></div>
  </div>
  <a {href} class="card-cta">LEARN MORE →</a>
</div>

<style>
  .app-card {
    padding: 18px 20px;
    background: rgba(0, 0, 20, .5);
    border: 1px solid color-mix(in srgb, var(--card-accent) 20%, transparent);
    position: relative;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ghost {
    position: absolute;
    right: -4px;
    top: -6px;
    font-family: var(--font-display);
    font-size: 96px;
    line-height: 1;
    letter-spacing: .04em;
    color: color-mix(in srgb, var(--card-accent) 8%, transparent);
    pointer-events: none;
    user-select: none;
  }
  .card-body {
    position: relative;
  }
  .card-name {
    font-family: var(--font-display);
    font-size: 22px;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--offwhite);
  }
  .card-cat {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: rgba(232, 230, 225, .35);
    margin-top: 3px;
  }
  .card-rule {
    width: 28px;
    height: 2px;
    background: var(--card-accent);
    margin-top: 10px;
  }
  .card-cta {
    font-family: var(--font-mono);
    font-size: 8px;
    font-weight: 700;
    letter-spacing: .14em;
    text-transform: uppercase;
    padding: 7px 13px;
    text-decoration: none;
    background: var(--card-accent);
    color: #000;
    white-space: nowrap;
    flex-shrink: 0;
    margin-left: 20px;
    position: relative;
  }
</style>
```

- [ ] **Step 2: Create `src/components/AppHero.astro`**

```astro
---
interface Props {
  heroBg: string;
  accent: string;
  appName: string;
  eyebrow: string;
  heroTitle: string[];
  accentLine: string;
  subtitle: string;
  pills: string[];
  activePill?: string;
}
const {
  heroBg, accent, appName, eyebrow,
  heroTitle, accentLine, subtitle, pills,
  activePill = pills[0],
} = Astro.props;
---
<div class="app-hero" style={`--hero-bg: ${heroBg}; --accent: ${accent};`}>
  <nav class="app-nav">
    <div class="app-nav-brand">
      VERITAS · <span class="app-nav-name">{appName}</span>
    </div>
    <a href="#" class="app-nav-cta">APP STORE →</a>
  </nav>
  <div class="hero-content">
    <div class="eyebrow">{eyebrow}</div>
    <h1 class="hero-title">
      {heroTitle.map((line, i) => (
        <span class:list={['title-line', { 'accent-line': line === accentLine }]}>
          {line}
        </span>
      ))}
    </h1>
    <div class="hero-sub">{subtitle}</div>
    <div class="hero-divider"></div>
    <div class="pills" role="list">
      {pills.map((pill) => (
        <span class:list={['pill', { active: pill === activePill }]} role="listitem">
          {pill}
        </span>
      ))}
    </div>
  </div>
</div>

<style>
  .app-hero {
    background: var(--hero-bg);
  }
  .app-nav {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    height: 52px;
    background: var(--hero-bg);
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
  }
  .app-nav-brand {
    font-family: var(--font-display);
    font-size: 18px;
    letter-spacing: .1em;
    color: var(--offwhite);
  }
  .app-nav-name {
    color: var(--accent);
  }
  .app-nav-cta {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .16em;
    text-transform: uppercase;
    text-decoration: none;
    color: var(--accent);
    opacity: .75;
    transition: opacity .15s;
  }
  .app-nav-cta:hover { opacity: 1; }
  .hero-content {
    padding: 56px 40px 48px;
    max-width: 760px;
  }
  .eyebrow {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: var(--accent);
    margin-bottom: 16px;
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: 72px;
    line-height: .92;
    letter-spacing: .04em;
    color: var(--offwhite);
    margin: 0 0 20px;
    display: flex;
    flex-direction: column;
  }
  .title-line {
    display: block;
  }
  .title-line.accent-line {
    color: var(--accent);
  }
  .hero-sub {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: rgba(232, 230, 225, .45);
    margin-bottom: 24px;
  }
  .hero-divider {
    border-top: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
    margin-bottom: 20px;
  }
  .pills {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .pill {
    font-family: var(--font-mono);
    font-size: 8px;
    letter-spacing: .14em;
    text-transform: uppercase;
    padding: 6px 12px;
    border: 1px solid color-mix(in srgb, var(--accent) 20%, transparent);
    color: color-mix(in srgb, var(--accent) 60%, var(--offwhite));
    cursor: default;
  }
  .pill.active {
    background: var(--accent);
    color: #000;
    border-color: var(--accent);
  }
</style>
```

- [ ] **Step 3: Create `src/layouts/AppLayout.astro`**

Shared CSS scaffold for all three app marketing pages. Sets `--page-bg` and `--page-accent` from props on a wrapper div. Sections, feature items, crosshair placeholders, and the app footer strip all use these vars.

```astro
---
import Layout from './Layout.astro';

interface Props {
  title: string;
  description: string;
  heroBg: string;
  accent: string;
}
const { title, description, heroBg, accent } = Astro.props;
---
<Layout {title} {description}>
  <div class="app-page" style={`--page-bg: ${heroBg}; --page-accent: ${accent};`}>
    <slot />
  </div>
</Layout>

<style>
  .app-page {
    background: var(--page-bg);
    min-height: 100vh;
  }

  /* ── Section shared ──────────────────────────────── */
  :global(.features-section) {
    background: var(--page-bg);
    padding: 72px 0;
  }
  :global(.watch-section) {
    background: color-mix(in srgb, var(--page-bg) 92%, #000);
    padding: 72px 0;
  }
  :global(.section-inner) {
    max-width: 1100px;
    margin: 0 auto;
    padding: 0 40px;
  }
  :global(.section-label) {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: var(--page-accent);
    margin-bottom: 40px;
  }

  /* ── Features grid ───────────────────────────────── */
  :global(.features-grid) {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;
  }
  :global(.feature-item) {
    display: flex;
    gap: 16px;
    margin-bottom: 32px;
  }
  :global(.feature-num) {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: .12em;
    color: color-mix(in srgb, var(--page-accent) 50%, transparent);
    flex-shrink: 0;
    padding-top: 2px;
    min-width: 24px;
  }
  :global(.feature-title) {
    font-family: var(--font-cond);
    font-size: 15px;
    font-weight: 700;
    letter-spacing: .06em;
    text-transform: uppercase;
    color: var(--offwhite);
    margin-bottom: 6px;
  }
  :global(.feature-body) {
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.75;
    color: rgba(232, 230, 225, .65);
    margin: 0;
    max-width: 40ch;
  }

  /* ── Screenshot placeholders ─────────────────────── */
  :global(.screenshots) {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }
  :global(.ph) {
    position: relative;
    background: color-mix(in srgb, var(--page-bg) 80%, transparent);
    border: 1px solid color-mix(in srgb, var(--page-accent) 12%, transparent);
    overflow: hidden;
  }
  :global(.ph::before) {
    content: '';
    position: absolute;
    left: 0; right: 0;
    top: 50%;
    height: 1px;
    background: color-mix(in srgb, var(--page-accent) 20%, transparent);
  }
  :global(.ph::after) {
    content: '';
    position: absolute;
    top: 0; bottom: 0;
    left: 50%;
    width: 1px;
    background: color-mix(in srgb, var(--page-accent) 20%, transparent);
  }
  :global(.ph-label) {
    position: absolute;
    bottom: 8px;
    left: 10px;
    font-family: var(--font-mono);
    font-size: 8px;
    letter-spacing: .18em;
    text-transform: uppercase;
    color: color-mix(in srgb, var(--page-accent) 40%, transparent);
    pointer-events: none;
  }
  :global(.ph-iphone) {
    width: 100px;
    aspect-ratio: 9 / 19.5;
    flex-shrink: 0;
  }
  :global(.ph-ipad) {
    flex: 1;
    aspect-ratio: 4 / 3;
  }
  :global(.ph-watch) {
    width: 160px;
    aspect-ratio: 1 / 1;
    flex-shrink: 0;
  }

  /* ── Watch grid ──────────────────────────────────── */
  :global(.watch-grid) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 60px;
    align-items: start;
  }
  :global(.watch-content) {
    display: flex;
    flex-direction: column;
  }

  /* ── App Store badge ─────────────────────────────── */
  :global(.app-store-badge) {
    display: flex;
    align-items: center;
    gap: 14px;
    border: 1px solid color-mix(in srgb, var(--page-accent) 25%, transparent);
    padding: 14px 20px;
    margin-top: 32px;
    width: fit-content;
    cursor: default;
  }
  :global(.badge-icon) {
    font-size: 22px;
    color: var(--page-accent);
    line-height: 1;
  }
  :global(.badge-text) {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  :global(.badge-sub) {
    font-family: var(--font-mono);
    font-size: 8px;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: var(--muted);
  }
  :global(.badge-main) {
    font-family: var(--font-display);
    font-size: 20px;
    letter-spacing: .06em;
    color: var(--offwhite);
  }

  /* ── App footer strip ────────────────────────────── */
  :global(.app-footer) {
    background: color-mix(in srgb, var(--page-bg) 92%, #000);
    border-top: 1px solid color-mix(in srgb, var(--page-accent) 12%, transparent);
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 16px 40px;
  }
  :global(.footer-links) {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: var(--font-mono);
    font-size: 8px;
    letter-spacing: .14em;
    text-transform: uppercase;
  }
  :global(.footer-links a) {
    color: var(--muted);
    text-decoration: none;
    transition: color .15s;
  }
  :global(.footer-links a:hover) {
    color: var(--page-accent);
  }
  :global(.footer-links .sep) {
    color: var(--muted);
    opacity: .4;
  }
  :global(.app-footer .copyright) {
    font-family: var(--font-mono);
    font-size: 8px;
    letter-spacing: .12em;
    color: rgba(232, 230, 225, .25);
  }
</style>
```

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: 7 routes, build succeeds. Components not yet wired to pages.

- [ ] **Step 5: Commit**

```bash
git add src/components/AppCard.astro src/components/AppHero.astro src/layouts/AppLayout.astro
git commit -m "components: add AppCard, AppHero, AppLayout" -- \
  src/components/AppCard.astro src/components/AppHero.astro src/layouts/AppLayout.astro
```

---

## Task 6: Homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Replace `src/pages/index.astro` with full homepage**

```astro
---
import Layout from '../layouts/Layout.astro';
import SiteNav from '../components/SiteNav.astro';
import SiteFooter from '../components/SiteFooter.astro';
import AppCard from '../components/AppCard.astro';
---
<Layout
  title="Veritas Software — Apps for Creative Businesses"
  description="iOS apps for freelancers and studios. Time tracking, invoicing, and production management."
>
  <SiteNav />

  <section class="hero">
    <div class="hero-left">
      <div class="eyebrow">// SOFTWARE FOR CREATIVE BUSINESSES</div>
      <h1 class="hero-title">
        BUILT FOR<br>
        CREATIVE<br>
        <em>WORK</em>
      </h1>
      <div class="hero-sub">
        iOS apps for freelancers &amp; studios<br>
        Time · Billing · Production
      </div>
    </div>
    <div class="hero-right">
      <div class="hero-wash" aria-hidden="true"></div>
      <div class="hero-grid" aria-hidden="true"></div>
      <div class="cards">
        <AppCard
          name="THREADLINE"
          category="Time Tracking"
          href="/threadline/"
          accent="#FE5D31"
          ghost="TL"
        />
        <AppCard
          name="BILLABLE"
          category="Invoicing"
          href="/billable/"
          accent="#FF6600"
          ghost="BL"
        />
        <AppCard
          name="CALLSHEET"
          category="Production"
          href="/callsheet/"
          accent="#2FD3DC"
          ghost="CS"
        />
      </div>
    </div>
  </section>

  <div class="ticker" aria-hidden="true">
    THREADLINE &nbsp;·&nbsp; TIME TRACKING &nbsp;·&nbsp;
    BILLABLE &nbsp;·&nbsp; INVOICING &nbsp;·&nbsp;
    CALLSHEET &nbsp;·&nbsp; PRODUCTION &nbsp;·&nbsp;
    iOS &nbsp;·&nbsp; VERITAS SOFTWARE &nbsp;·&nbsp;
  </div>

  <section class="about">
    <div class="about-inner">
      <div class="section-label">// 01 About</div>
      <h2 class="section-title">WHO WE <em>ARE</em></h2>
      <p class="body-copy">
        Veritas Software builds focused iOS tools for creative professionals.
        We make software that stays out of the way while keeping your business
        organized — so you can spend more time on the work that matters.
      </p>
    </div>
  </section>

  <SiteFooter />
</Layout>

<style>
  /* ── Hero ──────────────────────────────────────────── */
  .hero {
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 420px;
  }
  .hero-left {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 48px 40px;
    border-right: 1px solid rgba(128, 255, 0, .2);
    background: var(--black);
  }
  .eyebrow {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: rgba(128, 255, 0, .6);
    margin-bottom: 14px;
  }
  .hero-title {
    font-family: var(--font-display);
    font-size: 76px;
    line-height: .92;
    letter-spacing: .04em;
    color: var(--offwhite);
    margin: 0 0 20px;
  }
  .hero-title em {
    font-style: normal;
    color: var(--acid);
  }
  .hero-sub {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(232, 230, 225, .35);
    line-height: 1.9;
  }

  /* ── Hero right panel ──────────────────────────────── */
  .hero-right {
    background: var(--hp-hero-right);
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 40px;
  }
  .hero-wash {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    height: 38%;
    background: #222255;
    clip-path: polygon(0 28%, 100% 0%, 100% 100%, 0% 100%);
    opacity: .55;
    pointer-events: none;
  }
  .hero-grid {
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      linear-gradient(rgba(128, 255, 0, .04) 1px, transparent 1px),
      linear-gradient(90deg, rgba(128, 255, 0, .04) 1px, transparent 1px);
    background-size: 24px 24px;
  }
  .cards {
    display: flex;
    flex-direction: column;
    gap: 10px;
    position: relative;
    z-index: 1;
  }

  /* ── Ticker ─────────────────────────────────────────── */
  .ticker {
    background: var(--acid);
    padding: 8px 40px;
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .22em;
    text-transform: uppercase;
    color: #000;
    overflow: hidden;
    white-space: nowrap;
  }

  /* ── About section ──────────────────────────────────── */
  .about {
    padding: 80px 0;
  }
  .about-inner {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 40px;
  }
  .section-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: var(--acid);
    margin-bottom: 16px;
  }
  .section-title {
    font-family: var(--font-display);
    font-size: 44px;
    letter-spacing: .04em;
    color: var(--offwhite);
    margin: 0 0 24px;
  }
  .section-title em {
    font-style: normal;
    color: var(--acid);
  }
  .body-copy {
    font-family: var(--font-body);
    font-size: 15px;
    line-height: 1.75;
    color: rgba(232, 230, 225, .65);
    max-width: 560px;
    margin: 0;
  }
</style>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: 7 routes (still — `/threadline/` etc. don't exist yet), build succeeds, no import errors.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "homepage: build full split-hero layout with app cards" -- src/pages/index.astro
```

---

## Task 7: Threadline App Page

**Files:**
- Create: `src/pages/threadline/index.astro`

- [ ] **Step 1: Create `src/pages/threadline/index.astro`**

```astro
---
import AppLayout from '../../layouts/AppLayout.astro';
import AppHero from '../../components/AppHero.astro';
---
<AppLayout
  title="Threadline — Time Tracking for iOS"
  description="Track billable time, organize projects, and export reports. Threadline is the focused time-tracking app for creative professionals."
  heroBg="#2E2A4F"
  accent="#FE5D31"
>
  <AppHero
    heroBg="#2E2A4F"
    accent="#FE5D31"
    appName="THREADLINE"
    eyebrow="// 01 Time Tracking"
    heroTitle={["TRACK", "YOUR", "TIME."]}
    accentLine="TIME."
    subtitle="iPhone · iPad · Apple Watch"
    pills={["Overview", "Timer", "Projects", "Reports", "Watch"]}
    activePill="Overview"
  />

  <!-- // 02 Features -->
  <section class="features-section">
    <div class="section-inner">
      <div class="section-label">// 02 Features</div>
      <div class="features-grid">
        <div class="features-list">
          <div class="feature-item">
            <span class="feature-num">01</span>
            <div>
              <div class="feature-title">TRACK TIME</div>
              <p class="feature-body">Log billable hours with one tap. Background timers keep running while you switch apps — nothing falls through the cracks.</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">02</span>
            <div>
              <div class="feature-title">ORGANIZE PROJECTS</div>
              <p class="feature-body">Group entries by client and project. Instantly see where your time goes and how it maps to what you've quoted.</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">03</span>
            <div>
              <div class="feature-title">EXPORT & REPORT</div>
              <p class="feature-body">Generate clean time reports and send them directly to Billable for invoicing without double-entry.</p>
            </div>
          </div>
        </div>
        <div class="screenshots">
          <div class="ph ph-iphone">
            <span class="ph-label">iPhone — Timer View</span>
          </div>
          <div class="ph ph-ipad">
            <span class="ph-label">iPad — Projects View</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- // 03 On Your Wrist -->
  <section class="watch-section">
    <div class="section-inner">
      <div class="section-label">// 03 On Your Wrist</div>
      <div class="watch-grid">
        <div class="ph ph-watch">
          <span class="ph-label">Apple Watch</span>
        </div>
        <div class="watch-content">
          <div class="feature-item">
            <span class="feature-num">04</span>
            <div>
              <div class="feature-title">GLANCE AT YOUR WRIST</div>
              <p class="feature-body">Check running timers, start and stop sessions, and review the day — all from your Apple Watch.</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">05</span>
            <div>
              <div class="feature-title">LIVE ACTIVITY</div>
              <p class="feature-body">Keep a live timer on your Lock Screen and Dynamic Island while you work.</p>
            </div>
          </div>
          <div class="app-store-badge">
            <div class="badge-icon">⬇</div>
            <div class="badge-text">
              <span class="badge-sub">Download on the</span>
              <span class="badge-main">App Store</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="app-footer">
    <div class="footer-links">
      <a href="/threadline/privacy">Privacy Policy</a>
      <span class="sep">·</span>
      <a href="/threadline/support">Support</a>
      <span class="sep">·</span>
      <a href="/">← All Apps</a>
    </div>
    <span class="copyright">© {new Date().getFullYear()} Veritas Software</span>
  </footer>
</AppLayout>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: 8 routes — `/threadline/` is now live.

- [ ] **Step 3: Commit**

```bash
git add src/pages/threadline/index.astro
git commit -m "threadline: add app marketing page" -- src/pages/threadline/index.astro
```

---

## Task 8: Billable App Page

**Files:**
- Create: `src/pages/billable/index.astro`

- [ ] **Step 1: Create `src/pages/billable/index.astro`**

```astro
---
import AppLayout from '../../layouts/AppLayout.astro';
import AppHero from '../../components/AppHero.astro';
---
<AppLayout
  title="Billable — Invoicing for iOS"
  description="Turn tracked time into professional invoices. Billable is the focused invoicing app for freelancers and creative studios."
  heroBg="#243E35"
  accent="#FF6600"
>
  <AppHero
    heroBg="#243E35"
    accent="#FF6600"
    appName="BILLABLE"
    eyebrow="// 01 Invoicing"
    heroTitle={["BUILD", "YOUR", "BUSINESS."]}
    accentLine="BUSINESS."
    subtitle="iPhone · iPad · Apple Watch"
    pills={["Overview", "Invoices", "Time", "Expenses", "Reports"]}
    activePill="Overview"
  />

  <!-- // 02 Features -->
  <section class="features-section">
    <div class="section-inner">
      <div class="section-label">// 02 Features</div>
      <div class="features-grid">
        <div class="features-list">
          <div class="feature-item">
            <span class="feature-num">01</span>
            <div>
              <div class="feature-title">CREATE INVOICES</div>
              <p class="feature-body">Turn tracked time and expenses into professional invoices with your branding, line items, and payment terms.</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">02</span>
            <div>
              <div class="feature-title">TRACK EXPENSES</div>
              <p class="feature-body">Capture expenses on the go and add them to any client invoice without hunting for receipts.</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">03</span>
            <div>
              <div class="feature-title">MONITOR PAYMENTS</div>
              <p class="feature-body">Mark invoices paid, track outstanding balances, and see exactly what every client owes at a glance.</p>
            </div>
          </div>
        </div>
        <div class="screenshots">
          <div class="ph ph-iphone">
            <span class="ph-label">iPhone — Invoice View</span>
          </div>
          <div class="ph ph-ipad">
            <span class="ph-label">iPad — Dashboard</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- // 03 On Your Wrist -->
  <section class="watch-section">
    <div class="section-inner">
      <div class="section-label">// 03 On Your Wrist</div>
      <div class="watch-grid">
        <div class="ph ph-watch">
          <span class="ph-label">Apple Watch</span>
        </div>
        <div class="watch-content">
          <div class="feature-item">
            <span class="feature-num">04</span>
            <div>
              <div class="feature-title">INCOME AT A GLANCE</div>
              <p class="feature-body">Check outstanding invoices and recent payments directly from your Apple Watch.</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">05</span>
            <div>
              <div class="feature-title">YEAR-END REPORTS</div>
              <p class="feature-body">Year-end revenue summaries and expense breakdowns — ready when your accountant asks.</p>
            </div>
          </div>
          <div class="app-store-badge">
            <div class="badge-icon">⬇</div>
            <div class="badge-text">
              <span class="badge-sub">Download on the</span>
              <span class="badge-main">App Store</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="app-footer">
    <div class="footer-links">
      <a href="/billable/privacy">Privacy Policy</a>
      <span class="sep">·</span>
      <a href="/billable/support">Support</a>
      <span class="sep">·</span>
      <a href="/">← All Apps</a>
    </div>
    <span class="copyright">© {new Date().getFullYear()} Veritas Software</span>
  </footer>
</AppLayout>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: 9 routes.

- [ ] **Step 3: Commit**

```bash
git add src/pages/billable/index.astro
git commit -m "billable: add app marketing page" -- src/pages/billable/index.astro
```

---

## Task 9: Callsheet App Page

**Files:**
- Create: `src/pages/callsheet/index.astro`

- [ ] **Step 1: Create `src/pages/callsheet/index.astro`**

```astro
---
import AppLayout from '../../layouts/AppLayout.astro';
import AppHero from '../../components/AppHero.astro';
---
<AppLayout
  title="Callsheet — Production Management for iOS"
  description="Build call sheets, manage crew, and run productions from your iPhone. Callsheet is the production app for film and video professionals."
  heroBg="#06267B"
  accent="#2FD3DC"
>
  <AppHero
    heroBg="#06267B"
    accent="#2FD3DC"
    appName="CALLSHEET"
    eyebrow="// 01 Production"
    heroTitle={["RUN YOUR", "PRODUCTION."]}
    accentLine="PRODUCTION."
    subtitle="iPhone · iPad · Apple Watch"
    pills={["Overview", "Call Sheets", "Crew", "Schedule", "Share"]}
    activePill="Overview"
  />

  <!-- // 02 Features -->
  <section class="features-section">
    <div class="section-inner">
      <div class="section-label">// 02 Features</div>
      <div class="features-grid">
        <div class="features-list">
          <div class="feature-item">
            <span class="feature-num">01</span>
            <div>
              <div class="feature-title">BUILD CALL SHEETS</div>
              <p class="feature-body">Create professional call sheets in minutes. Add scenes, locations, call times, and crew — all in one place.</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">02</span>
            <div>
              <div class="feature-title">MANAGE YOUR CREW</div>
              <p class="feature-body">Keep contact info, rates, and notes for every crew member. Assign roles and call times without email chains.</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">03</span>
            <div>
              <div class="feature-title">TALENT SCHEDULING</div>
              <p class="feature-body">Organize talent call times, scenes, and location details in a clear, shareable schedule.</p>
            </div>
          </div>
        </div>
        <div class="screenshots">
          <div class="ph ph-iphone">
            <span class="ph-label">iPhone — Call Sheet</span>
          </div>
          <div class="ph ph-ipad">
            <span class="ph-label">iPad — Crew View</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- // 03 On Your Wrist -->
  <section class="watch-section">
    <div class="section-inner">
      <div class="section-label">// 03 On Your Wrist</div>
      <div class="watch-grid">
        <div class="ph ph-watch">
          <span class="ph-label">Apple Watch</span>
        </div>
        <div class="watch-content">
          <div class="feature-item">
            <span class="feature-num">04</span>
            <div>
              <div class="feature-title">DAY-OF VIEW</div>
              <p class="feature-body">Check the shooting schedule, crew status, and scene notes from your Apple Watch — hands-free on set.</p>
            </div>
          </div>
          <div class="feature-item">
            <span class="feature-num">05</span>
            <div>
              <div class="feature-title">SHARE INSTANTLY</div>
              <p class="feature-body">Send call sheets directly from the app via email or shareable link. Crew gets what they need, when they need it.</p>
            </div>
          </div>
          <div class="app-store-badge">
            <div class="badge-icon">⬇</div>
            <div class="badge-text">
              <span class="badge-sub">Download on the</span>
              <span class="badge-main">App Store</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <footer class="app-footer">
    <div class="footer-links">
      <a href="/callsheet/privacy">Privacy Policy</a>
      <span class="sep">·</span>
      <a href="/callsheet/support">Support</a>
      <span class="sep">·</span>
      <a href="/">← All Apps</a>
    </div>
    <span class="copyright">© {new Date().getFullYear()} Veritas Software</span>
  </footer>
</AppLayout>
```

- [ ] **Step 2: Build check**

```bash
npm run build
```

Expected: 10 routes.

- [ ] **Step 3: Commit**

```bash
git add src/pages/callsheet/index.astro
git commit -m "callsheet: add app marketing page" -- src/pages/callsheet/index.astro
```

---

## Task 10: Expand Billable + Callsheet Privacy Policies

**Files:**
- Modify: `src/pages/billable/privacy.astro`
- Modify: `src/pages/callsheet/privacy.astro`

- [ ] **Step 1: Expand `src/pages/billable/privacy.astro`**

Replace the placeholder article content with a full policy (same structure as Threadline's). Keep the existing LegalLayout wrapper and style block from Task 3.

```astro
---
import LegalLayout from '../../layouts/LegalLayout.astro';
const title = 'Veritas Billable — Privacy Policy';
const description = 'Privacy policy for Veritas Billable, a time-tracking and invoicing app for freelancers and studios.';
---

<LegalLayout {title} {description} app="billable" pageType="privacy">
  <article class="policy">
    <h1>Veritas Billable Privacy Policy</h1>
    <p class="meta">Effective: 2026-05-21</p>

    <p>Veritas Billable is a time-tracking and invoicing app for freelancers and
    creative studios. This policy explains what data Billable collects, where
    it's stored, and how to delete it.</p>

    <h2>What we collect</h2>

    <h3>Data you enter</h3>

    <p>You enter business and client information through normal app use:</p>

    <ul>
      <li>Your business identity (name, address, phone, email, logo, signature).</li>
      <li>Your clients (names, contact methods, addresses, notes).</li>
      <li>Your time entries (duration, project, client, description, billable rate).</li>
      <li>Your invoices (line items, rates, totals, payment status, due dates).</li>
      <li>Your expenses (amount, category, date, client association, receipts).</li>
    </ul>

    <h3>Data Apple collects on our behalf</h3>

    <p>If you subscribe to a paid tier, Apple processes your payment and provides
    us a receipt token. We never see your payment method or card details.</p>

    <h3>Optional cloud sync</h3>

    <p>If you enable <strong>iCloud sync</strong>, your data syncs across your Apple devices
    via Apple's CloudKit private database — accessible only with your iCloud
    credentials. Veritas Billable cannot read your CloudKit records without
    your consent.</p>

    <h2>What we don't collect</h2>

    <ul>
      <li>No location data.</li>
      <li>No analytics SDKs in v1.0.</li>
      <li>No advertising identifiers.</li>
      <li>No browsing or search history.</li>
      <li>No health or sensitive personal data.</li>
      <li>No biometric data. Face ID / Touch ID is processed on-device by Apple.</li>
    </ul>

    <h2>How we use the data</h2>

    <ul>
      <li>To render and edit your business records on your device.</li>
      <li>To sync your data across your own devices via iCloud (if you enable it).</li>
      <li>To verify your in-app subscription status with the App Store.</li>
    </ul>

    <p>We do <strong>not</strong>:</p>

    <ul>
      <li>Sell your data to third parties.</li>
      <li>Share your data with advertisers.</li>
      <li>Use your data to train machine-learning models.</li>
      <li>Combine your data with data from other sources to identify you.</li>
    </ul>

    <h2>Where the data lives</h2>

    <ul>
      <li><strong>On your device</strong>: SwiftData local store, encrypted at rest by the iOS file system when your device is locked.</li>
      <li><strong>In your iCloud private database</strong> (if you enable sync): managed by Apple under your iCloud credentials.</li>
      <li><strong>With Apple</strong>: IAP receipt token (if you subscribed).</li>
    </ul>

    <h2>How to delete your data</h2>

    <p><strong>In the app</strong>: Settings → Account → Delete Account. This:</p>

    <ul>
      <li>Removes your data from your device.</li>
      <li>Marks your records in CloudKit for deletion (if iCloud sync was enabled).</li>
      <li>Cancels any active in-app subscription on a forward-looking basis.</li>
    </ul>

    <p><strong>At the iCloud level</strong>: Settings → [your name] → iCloud →
    Manage Account Storage → Billable → Delete Data.</p>

    <h2>Children's privacy</h2>

    <p>Veritas Billable is a business app, not intended for use by children
    under 13. We do not knowingly collect data from children.</p>

    <h2>Contact</h2>

    <p>For privacy questions: <a href="mailto:privacy@veritas-software.net">privacy@veritas-software.net</a></p>

    <h2>Changes to this policy</h2>

    <p>If we change this policy, we'll update the version + effective date at
    the top of this document and note it in the app's release notes.</p>

    <h2>Jurisdiction</h2>

    <p>Veritas Billable is operated from the United States. By using the app,
    you consent to your data being processed under U.S. law.</p>

  </article>
</LegalLayout>

<style>
  article.policy h1 {
    font-family: var(--font-display);
    font-size: 48px;
    letter-spacing: .04em;
    margin: 40px 0 4px;
  }
  .meta {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: .12em;
    text-transform: uppercase;
    margin: 0 0 40px;
  }
  article.policy h2 {
    font-family: var(--font-cond);
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    border-top: 1px solid var(--line);
    padding-top: 20px;
    margin: 40px 0 12px;
  }
  article.policy h3 {
    font-family: var(--font-cond);
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--muted);
    margin: 24px 0 8px;
  }
  article.policy p,
  article.policy li {
    font-size: 15px;
    max-width: 68ch;
  }
  article.policy ul {
    padding-left: 1.4em;
  }
  article.policy ul li {
    margin-bottom: 4px;
  }
  article.policy a {
    color: var(--acid);
  }
</style>
```

- [ ] **Step 2: Expand `src/pages/callsheet/privacy.astro`**

```astro
---
import LegalLayout from '../../layouts/LegalLayout.astro';
const title = 'Veritas Callsheet — Privacy Policy';
const description = 'Privacy policy for Veritas Callsheet, a production call sheet app for film and video crews.';
---

<LegalLayout {title} {description} app="callsheet" pageType="privacy">
  <article class="policy">
    <h1>Veritas Callsheet Privacy Policy</h1>
    <p class="meta">Effective: 2026-05-21</p>

    <p>Veritas Callsheet is a production management app for film and video
    professionals. This policy explains what data Callsheet collects, where
    it's stored, and how to delete it.</p>

    <h2>What we collect</h2>

    <h3>Data you enter</h3>

    <p>You enter production information through normal app use:</p>

    <ul>
      <li>Your production details (title, dates, locations, shoot schedule).</li>
      <li>Your crew (names, roles, contact information, call times, rates).</li>
      <li>Your talent (names, contact information, scenes, call times).</li>
      <li>Your call sheets (scene breakdowns, equipment lists, notes, distribution lists).</li>
      <li>Your location information (addresses, parking, access notes).</li>
    </ul>

    <h3>Data Apple collects on our behalf</h3>

    <p>If you subscribe to a paid tier, Apple processes your payment and provides
    us a receipt token. We never see your payment method or card details.</p>

    <h3>Optional cloud sync</h3>

    <p>If you enable <strong>iCloud sync</strong>, your data syncs across your Apple devices
    via Apple's CloudKit private database — accessible only with your iCloud
    credentials. Veritas Callsheet cannot read your CloudKit records without
    your consent.</p>

    <h2>What we don't collect</h2>

    <ul>
      <li>No passive location tracking. Location data you enter into call sheets is stored only on your device and in your private iCloud database.</li>
      <li>No analytics SDKs in v1.0.</li>
      <li>No advertising identifiers.</li>
      <li>No browsing or search history.</li>
      <li>No health or sensitive personal data.</li>
      <li>No biometric data. Face ID / Touch ID is processed on-device by Apple.</li>
    </ul>

    <h2>How we use the data</h2>

    <ul>
      <li>To render and edit your production records on your device.</li>
      <li>To sync your data across your own devices via iCloud (if you enable it).</li>
      <li>To generate and share call sheets when you explicitly initiate a share action.</li>
      <li>To verify your in-app subscription status with the App Store.</li>
    </ul>

    <p>We do <strong>not</strong>:</p>

    <ul>
      <li>Sell your data to third parties.</li>
      <li>Share your data with advertisers.</li>
      <li>Use your data to train machine-learning models.</li>
      <li>Combine your data with data from other sources to identify you.</li>
    </ul>

    <h2>Where the data lives</h2>

    <ul>
      <li><strong>On your device</strong>: SwiftData local store, encrypted at rest by the iOS file system when your device is locked.</li>
      <li><strong>In your iCloud private database</strong> (if you enable sync): managed by Apple under your iCloud credentials.</li>
      <li><strong>With Apple</strong>: IAP receipt token (if you subscribed).</li>
    </ul>

    <h2>How to delete your data</h2>

    <p><strong>In the app</strong>: Settings → Account → Delete Account. This:</p>

    <ul>
      <li>Removes your data from your device.</li>
      <li>Marks your records in CloudKit for deletion (if iCloud sync was enabled).</li>
      <li>Cancels any active in-app subscription on a forward-looking basis.</li>
    </ul>

    <p><strong>At the iCloud level</strong>: Settings → [your name] → iCloud →
    Manage Account Storage → Callsheet → Delete Data.</p>

    <h2>Children's privacy</h2>

    <p>Veritas Callsheet is a professional production tool, not intended for use
    by children under 13. We do not knowingly collect data from children.</p>

    <h2>Contact</h2>

    <p>For privacy questions: <a href="mailto:privacy@veritas-software.net">privacy@veritas-software.net</a></p>

    <h2>Changes to this policy</h2>

    <p>If we change this policy, we'll update the version + effective date at
    the top of this document and note it in the app's release notes.</p>

    <h2>Jurisdiction</h2>

    <p>Veritas Callsheet is operated from the United States. By using the app,
    you consent to your data being processed under U.S. law.</p>

  </article>
</LegalLayout>

<style>
  article.policy h1 {
    font-family: var(--font-display);
    font-size: 48px;
    letter-spacing: .04em;
    margin: 40px 0 4px;
  }
  .meta {
    font-family: var(--font-mono);
    font-size: 11px;
    color: var(--muted);
    letter-spacing: .12em;
    text-transform: uppercase;
    margin: 0 0 40px;
  }
  article.policy h2 {
    font-family: var(--font-cond);
    font-size: 22px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    border-top: 1px solid var(--line);
    padding-top: 20px;
    margin: 40px 0 12px;
  }
  article.policy h3 {
    font-family: var(--font-cond);
    font-size: 16px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: .06em;
    color: var(--muted);
    margin: 24px 0 8px;
  }
  article.policy p,
  article.policy li {
    font-size: 15px;
    max-width: 68ch;
  }
  article.policy ul {
    padding-left: 1.4em;
  }
  article.policy ul li {
    margin-bottom: 4px;
  }
  article.policy a {
    color: var(--acid);
  }
</style>
```

- [ ] **Step 3: Build check**

```bash
npm run build
```

Expected: 10 routes, build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/pages/billable/privacy.astro src/pages/callsheet/privacy.astro
git commit -m "legal: expand Billable and Callsheet privacy policies" -- \
  src/pages/billable/privacy.astro src/pages/callsheet/privacy.astro
```

---

## Task 11: robots.txt + Sitemap

**Files:**
- Create: `public/robots.txt`
- Modify: `astro.config.mjs`

- [ ] **Step 1: Install `@astrojs/sitemap`**

```bash
cd /Users/seth/Documents/GitHub/veritas-software-net
npm install @astrojs/sitemap
```

- [ ] **Step 2: Create `public/robots.txt`**

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

- [ ] **Step 3: Update `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://veritas-software.net',
  adapter: cloudflare(),
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes('/privacy') && !page.includes('/support'),
    }),
  ],
});
```

- [ ] **Step 4: Build check**

```bash
npm run build
```

Expected: 10 routes, build succeeds. Verify the sitemap was generated:

```bash
ls dist/sitemap*.xml
```

Expected output includes `dist/sitemap-0.xml` (or `dist/sitemap-index.xml`). Verify it contains the 4 public routes (`/`, `/threadline/`, `/billable/`, `/callsheet/`) and excludes the 6 legal routes.

```bash
cat dist/sitemap-0.xml
```

Should show URLs for `/`, `/threadline/`, `/billable/`, `/callsheet/` only.

- [ ] **Step 5: Commit**

```bash
git add public/robots.txt astro.config.mjs package.json package-lock.json
git commit -m "infra: add robots.txt and sitemap" -- \
  public/robots.txt astro.config.mjs package.json package-lock.json
```

---

## Task 12: Final Build Verify

**Files:** None changed.

- [ ] **Step 1: Clean build**

```bash
rm -rf dist
npm run build
```

Expected output: 10 routes total:
```
▶ src/pages/index.astro
▶ src/pages/threadline/index.astro
▶ src/pages/threadline/privacy.astro
▶ src/pages/threadline/support.astro
▶ src/pages/billable/index.astro
▶ src/pages/billable/privacy.astro
▶ src/pages/billable/support.astro
▶ src/pages/callsheet/index.astro
▶ src/pages/callsheet/privacy.astro
▶ src/pages/callsheet/support.astro
```

- [ ] **Step 2: Confirm robots.txt and sitemap in dist**

```bash
ls dist/robots.txt dist/sitemap*.xml
cat dist/robots.txt
```

Expected: robots.txt present, 6 Disallow entries, Sitemap URL points to `https://veritas-software.net/sitemap-index.xml`.

- [ ] **Step 3: Final commit tag**

```bash
git tag phase-4-complete
```

---

## Self-Review Checklist

### Spec coverage

| Spec section | Plan task |
|---|---|
| § 2 Design Tokens | Task 1 |
| § 3 Typography (applied via component CSS) | Tasks 4–9 |
| § 4.1 SiteNav | Task 4 |
| § 4.2 SiteFooter | Task 4 |
| § 4.3 LegalLayout | Task 3 |
| § 4.4 AppCard | Task 5 |
| § 4.5 AppHero | Task 5 |
| § 5.1 Homepage | Task 6 |
| § 5.2 App pages (3×) | Tasks 7–9 |
| § 5.3 Legal page refactor | Task 3 |
| § 6.1 robots.txt | Task 11 |
| § 6.2 favicon + OG meta | Task 2 |
| § 6.3 sitemap | Task 11 |
| § 7 NITs 1–3 | Tasks 1, 2, 3 |
| § 8 Out of scope | `href="#"` placeholders throughout; no mobile breakpoints |
| § 10 Privacy policy expansion | Task 10 |

### Type consistency

- `AppCard` props: `name`, `category`, `href`, `accent`, `ghost` — used consistently in Tasks 5 and 6.
- `AppHero` props: `heroBg`, `accent`, `appName`, `eyebrow`, `heroTitle`, `accentLine`, `subtitle`, `pills`, `activePill?` — used consistently in Tasks 5, 7, 8, 9.
- `AppLayout` props: `title`, `description`, `heroBg`, `accent` — used consistently in Tasks 5, 7, 8, 9.
- `LegalLayout` props: `title`, `description`, `app`, `pageType` — used consistently in Tasks 3, 10.
- All CSS class names in `AppLayout`'s `:global()` blocks (`.features-section`, `.watch-section`, `.section-inner`, `.section-label`, `.features-grid`, `.feature-item`, `.feature-num`, `.feature-title`, `.feature-body`, `.screenshots`, `.ph`, `.ph-iphone`, `.ph-ipad`, `.ph-watch`, `.ph-label`, `.watch-grid`, `.watch-content`, `.app-store-badge`, `.badge-icon`, `.badge-text`, `.badge-sub`, `.badge-main`, `.app-footer`, `.footer-links`, `.sep`, `.copyright`) are used in Tasks 7, 8, and 9 — names match exactly.

### Placeholder scan

- All `href="#"` are intentional (App Store badges, app nav CTA) — noted as out-of-scope in spec § 8.
- All screenshot placeholders are intentional — noted as out-of-scope in spec § 8.
- No "TBD", "TODO", or "implement later" found.
- Privacy policy text for Billable and Callsheet: written in full in Task 10, not deferred.
