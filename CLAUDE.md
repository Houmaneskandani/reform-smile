# Reform Smile & Dental Implant Center — AI Project Log

## Project Overview
- **Client:** Dr. Ava Pournejad, DDS
- **Practice:** Reform Smile & Dental Implant Center
- **Focus:** All-on-X / Full Arch Dental Implants for patients with missing teeth
- **Built by:** Houman Eskandani (for Dr. Ava)
- **AI Assistant:** Claude (Anthropic) — used throughout development
- **Started:** April 29, 2026

## Quick Start
```bash
npm install          # Install dependencies
npm run dev          # Start dev server (http://localhost:3000)
npm run dev:admin    # Website editor, this computer only (http://127.0.0.1:3000/keystatic)
npm run build        # Production build + content check + post-build name scan
npm run lint         # Run linter
```

## Git + Deploy Workflow
**IMPORTANT:** This is how every change gets committed and deployed. Pushing to `main` **is** the production deploy: Vercel's GitHub integration builds every push to `main` and puts it live (about 1–3 minutes). There is no separate deploy command. Follow these exact steps:

### 1. Build first (catch errors before committing)
```bash
npm run build
```
This also runs the content check and the post-build name scan (see "Admin panel → Guardrails").

### 2. Stage and commit
```bash
git add -A
git commit -m "Short description of what changed"
```

### 3. Get the latest `main` (every time, right before pushing)
```bash
git pull --rebase origin main
```
If this brings in new commits (for example her saves from the website editor), run `npm run build` once more. If it stops on a conflict, fix the file, `git add` it, then `git rebase --continue`.

### 4. Push to GitHub (this deploys to production)
```bash
git push origin main
```
Watch the build in Vercel → Project `ava` → Deployments. If it fails, the live site keeps the last good version.

### All-in-one command (build + commit + pull + push):
```bash
npm run build && git add -A && git commit -m "Your message here" && git pull --rebase origin main && git push origin main
```

### Why there is no `vercel --prod` any more
Once the website editor is live in production, every Save she makes is a commit on `main` (made by the Keystatic bot), and Vercel deploys it from GitHub. `vercel --prod` deploys **your local folder**, not GitHub's `main`. From a folder that hasn't pulled her latest saves, it would put the old text back on the live site, even though her edits are still in git. So production deploys only ever come from pushes to `main`, and you always `git pull --rebase` first. Also, don't hand-edit `content/*.json` while she is editing in the editor: commits made outside the editor are suspected of putting the cloud editor out of sync (Keystatic issues #1625 and #1627). If you must change a content file, do it when she isn't editing, push, and ask her to reload the editor.

### If something bad goes live (rollback)
- **Wrong text or a bad code change:** `git revert <commit>`, then `git pull --rebase origin main` and `git push origin main`. That is a normal deploy, so everything keeps working.
- **Emergency (the site is broken and must be back in seconds):** Vercel → Deployments → the last good deployment → Instant Rollback. **After an Instant Rollback, Vercel stops putting new production builds live automatically.** Her saves and your pushes still build, but nothing goes live until you **Promote** a deployment again (https://vercel.com/docs/instant-rollback). Fix forward with a revert commit, then promote that deployment.
- **A content build failed:** there is nothing to roll back. Vercel keeps serving the last good deployment. The build log names the file and field (for example `FAQ (content/faq.json) › item 1 › answer: …`); fix it in the editor or in the file, then save or push again.

### Preview deploy (for testing before production):
```bash
vercel --yes
```
This gives a temporary preview URL without affecting the live site.

### Branch workflow (for experimental versions):
```bash
git checkout -b v2           # Create new branch
# ... make changes ...
git add -A && git commit -m "message"
git push origin v2
vercel --yes                 # Deploys as preview (not production)
git checkout main            # Switch back to main
```

## Accounts & Access
- **GitHub:** https://github.com/Houmaneskandani/reform-smile
- **Vercel:** Linked to GitHub account (Houmaneskandani)
- **Live URL (V1):** https://ava-green.vercel.app
- **Domain:** reformdentalimplantcenter.com — registered at Squarespace (renewed to Nov 2027). Added to the Vercel project `ava` (www redirects to the main domain). DNS still points at Squarespace until the records in "Step 5: Connect Domain" are switched.
- **Keystatic Cloud (sign-in for the website editor in production):** not set up yet. See "Admin panel (Keystatic website editor) → Turning it on in production".

### How to authenticate (if needed):
```bash
gh auth login        # GitHub CLI — follow browser prompts
vercel login         # Vercel CLI — follow browser prompts
```

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **SEO:** Built-in Next.js metadata + structured data (schema.org/Dentist)
- **Content editing:** Keystatic website editor (`@keystatic/core` 0.6.9 + `@keystatic/next` 5.0.5, pinned exactly). Site text lives in `content/*.json`
- **Deployment:** Vercel (free tier). Every push to `main` deploys (GitHub integration)
- **Repository:** GitHub

## Brand Guidelines
- **Primary color (Navy):** #1B3A5C
- **Accent color (Gold):** #C4A265
- **Background (Cream):** #F5F0EB
- **Text (Dark):** #1A1A2E
- **Heading font:** Playfair Display (serif — matches logo elegance)
- **Body font:** Inter (clean sans-serif)
- **Logo files:**
  - `/public/logo.png` — Original with white background
  - `/public/logo-transparent.png` — Color logo, transparent background (for white headers)
  - `/public/logo-white.png` — White logo, transparent background (for dark backgrounds)

## Architecture
```
content/                        # Site text edited in the website editor (/keystatic). JSON, imported at build time
├── practice.json               # Phone, email, address, opening hours, social links, header tagline, footer blurb
├── pricing.json                # Prices + the homepage limited-time offer (on/off, optional last day)
├── services.json               # Text of the 5 services (ids are fixed in src/content/rules.ts)
├── faq.json                    # Homepage FAQ
└── testimonials.json           # Patient reviews (sample flag, permission on file, where each one shows)
keystatic.config.ts             # Website editor: the 5 editable pages, labels, help text and field checks
scripts/
└── check-built-html.mjs        # Post-build scan, run by `npm run build` (name rules on the built site)
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout: fonts, metadata, <html>/<body> only (no CSS, no site chrome)
│   ├── not-found.tsx           # Site-wide 404 for unknown URLs (brings its own CSS + site chrome)
│   ├── (site)/                 # Route group for every public page. "(site)" is not part of the URL
│   │   ├── layout.tsx          # globals.css + SiteChrome + the build-time content check (validateContent)
│   │   ├── not-found.tsx       # 404 for notFound() inside a public page (no second header/footer)
│   │   ├── page.tsx            # Homepage
│   │   ├── about/              # About Dr. Ava (hero + bio + mission + technology)
│   │   ├── services/           # Services (hero + detailed service list; photos in ServicesList.tsx, text from content/)
│   │   ├── gallery/            # Smile gallery / before-after grid
│   │   ├── blog/               # Blog articles placeholder (SEO)
│   │   ├── contact/            # Contact page (info + validated form + map placeholder)
│   │   ├── book/               # Appointment booking (full form with date/time picker)
│   │   └── consultation/       # Marketing landing page — has its own minimal layout (no header/footer)
│   ├── keystatic/              # Website editor UI at /keystatic. Outside (site): no site CSS, chrome or trackers.
│   │                           #   404 in production until Keystatic Cloud is set up; locally only under dev:admin
│   │                           #   (local-mode.ts is that switch)
│   ├── api/chat/route.ts       # Server-side AI chat (Claude). Reads ANTHROPIC_API_KEY on the server only
│   ├── api/keystatic/[...params]/route.ts # Editor's local read/write API: `npm run dev:admin` on this computer only, always 404 in production
│   ├── sitemap.ts              # /sitemap.xml — built from SITE_CONFIG.url
│   └── robots.ts               # /robots.txt — built from SITE_CONFIG.url; disallows /api/ and /keystatic
├── content/                    # Code that reads /content/*.json (a different folder from /content itself)
│   ├── index.ts                # Typed static imports of the JSON files. Safe in client components (no zod in the browser)
│   ├── practice.ts … testimonials.ts # One small module per file, so a page only ships the content it shows
│   │                           #   (testimonials.ts also leaves out real reviews without permission on file)
│   ├── schema.ts               # zod schemas + TypeScript types for every content file
│   ├── rules.ts                # Shared rules: SERVICE_IDS, formats, length limits, the name rule (NO_NAME)
│   ├── blocked-hashes.json     # SHA-256 hashes of words that must never appear (the words themselves are never stored)
│   ├── blocked.ts              # Server-only access to those hashes (they must not reach the browser JavaScript)
│   ├── format.ts               # Hours, money and phone-link formatting; whether the offer is still running
│   └── validate.ts             # Server-only build check (zod + cross-file rules). Fails the build on bad content
├── components/
│   ├── layout/
│   │   ├── SiteChrome.tsx      # Everything around a public page: trackers, intro, smooth scroll, structured data,
│   │   │                       #   header, footer, sticky Book Now bar, chat widget, cookie banner
│   │   ├── Header.tsx          # Sticky header — transparent on homepage, solid on other pages
│   │   ├── Footer.tsx          # Full footer with contact, hours, links
│   │   └── FooterWrapper.tsx   # Hides footer on consultation + clinical homepage
│   ├── NotFoundMessage.tsx     # The 404 message (used by both not-found files)
│   ├── sections/               # Homepage sections
│   │   ├── Hero.tsx            # Video background hero with CTAs
│   │   ├── TrustBar.tsx        # 4 trust indicators
│   │   ├── TrustLogos.tsx      # Credential badges (icons, no trademarks) — claims need Dr. Ava's confirmation
│   │   ├── Services.tsx        # Service cards built from SERVICES (4 treatments + highlighted consultation)
│   │   ├── StatsCounter.tsx    # Animated number counters (500+, 5.0, 98%, 1 Day)
│   │   ├── BeforeAfterSlider.tsx # Drag-to-compare before/after with real patient photos
│   │   ├── Process.tsx         # 4-step "How It Works"
│   │   ├── About.tsx           # Dr. Ava section
│   │   ├── Testimonials.tsx    # Patient review cards (from content/testimonials.json)
│   │   ├── FAQ.tsx             # Accordion FAQ (7 questions, from content/faq.json)
│   │   └── CTASection.tsx      # Final call-to-action
│   ├── ui/
│   │   └── Button.tsx          # Reusable button (uses <a> for /consultation to avoid nav crash)
│   ├── AIChatAssistant.tsx     # Chat widget — calls /api/chat, falls back to demo answers without a key
│   ├── CookieConsent.tsx       # Consent banner — analytics/pixels load only after "Accept"
│   └── StructuredData.tsx      # JSON-LD for Google (Dentist) — built from SITE_CONFIG + SERVICES
└── lib/
    ├── constants.ts            # SITE_CONFIG (name, url, public keys + practice info read from content/) and
    │                           #   SERVICES (the ONE canonical list, read from content/services.json), NAV_LINKS
    ├── submitForm.ts           # Web3Forms submit — never fakes success in production; honeypot spam check
    └── tracking.ts             # Conversion events (only after cookie consent)
public/
├── logo.png, logo-transparent.png, logo-white.png
├── favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png
├── og-image.jpg                # Social media preview image
├── manifest.json               # PWA manifest
└── images/
    └── cases/                  # Real patient photos from Dr. Ava
        ├── case-1-full-arch.jpg
        ├── case-2-before-after.jpg
        ├── case-3-implant-placement.jpg
        └── case-4-prosthetic.jpg
```

## Key Design Decisions & Gotchas

### Dr. Ava's content rules (follow these in every change)
- **Name:** the surname "Pournejad" must not appear anywhere. "Dr. Ava" appears **only on the About page** (and as alt text on her headshot). Everywhere else write "our team", "our doctor", or "Reform Smile". The AI chat is told the same.
- **Services:** `SERVICES` in `src/lib/constants.ts` is still the single list (Full Arch, Single Implants, Veneers, Snap-On Dentures, Free Consultation). Homepage cards, Services page, booking dropdown, smile quiz, Google structured data and the AI chat all read it. The ids stay in code, in `SERVICE_IDS` (`src/content/rules.ts`). The text (name, summary, Services-page subheading, paragraphs, benefits) lives in `content/services.json` and is changed in the website editor; photos stay in `src/app/(site)/services/ServicesList.tsx`. To add a service (developer only): add the id to `SERVICE_IDS`, add its entry to `content/services.json` (Free Consultation stays last), then fill in what TypeScript asks for: `SERVICE_LABELS` in `keystatic.config.ts`, `SERVICE_ICONS` in `src/components/sections/Services.tsx` and `SERVICE_PHOTOS` in `ServicesList.tsx`. Also raise the editor's fixed list length (`length: { min: 5, max: 5 }` in `keystatic.config.ts`) and the "five services" wording there and in `src/content/validate.ts`.
- **Claims:** prices ($9,000/arch, $2,700/implant), stats (500+, 5.0, 98%) and credentials/badges (Board Certified, ADA, AAID, HIPAA, CareCredit, insurance) must be confirmed by Dr. Ava — don't add or change them on your own. (She can change the prices herself in the website editor.)
- **How these rules are enforced:** the website editor rejects the first name as a word in every text field before Save (`NO_NAME` in `src/content/rules.ts`). `src/content/validate.ts` checks every value in `content/*.json` again during `next build`, including the surname by SHA-256 hash. `scripts/check-built-html.mjs` then scans the built site: "Dr. Ava" on any page except `/about` (elsewhere only the headshot alt text is allowed) and the surname anywhere in the built pages, browser JavaScript, `src/`, `content/`, `public/manifest.json` and `keystatic.config.ts`. The surname is only ever stored as a hash (`src/content/blocked-hashes.json`): never write it in code, comments, tests or scripts. Code you write by hand isn't checked before Save, so follow the rules there yourself; the post-build scan is the safety net.

### Secrets vs public keys
- Anything prefixed `NEXT_PUBLIC_` is shipped to every visitor's browser. Only public IDs go there (Web3Forms key, GA/GTM/Clarity/Pixel IDs, the Keystatic Cloud project ID).
- Secret keys (`ANTHROPIC_API_KEY`, Twilio, SendGrid) **never** get the `NEXT_PUBLIC_` prefix and are only read in `src/app/api/*` server routes.
- The website editor has no secret keys: Keystatic Cloud signs in from the browser. `ADMIN_HOST` (no prefix, not a secret) is read by `next.config.ts` at build time.
- Real values live in Vercel → Project `ava` → Settings → Environment Variables (and `.env.local` for local dev). `.env.example` lists them all.

### Navigation between consultation page and other pages
The `/consultation` page has its own minimal layout (no header/footer). Using Next.js `<Link>` for client-side navigation between this page and regular pages causes a crash. **Always use regular `<a>` tags** for links to/from `/consultation`. This is handled in `Button.tsx` automatically.

### Header behavior
- **Homepage (`/`):** Header starts transparent with white logo, transitions to solid white with color logo on scroll
- **Other pages:** Always solid white with color logo
- **Consultation (`/consultation`):** Header hidden entirely — page has its own minimal top bar
- **Website editor (`/keystatic`):** no site header, footer or CSS at all — it sits outside the `(site)` route group
- Uses `usePathname()` to detect which page

### Logo variants
Three logo files exist because the original PNG has a white background:
- `logo-transparent.png` — white background removed (for light backgrounds)
- `logo-white.png` — entire logo turned white (for dark backgrounds)
- Generated using Python Pillow — see memory if you need to regenerate

### Adding new photos
1. Put the file in `/public/images/cases/` (or create a subdirectory)
2. Reference it in the component as `/images/cases/filename.jpg`
3. Use Next.js `<Image>` component for optimization

### Adding new pages
1. Create a folder in `src/app/(site)/your-page/`. It must be inside the `(site)` route group, or the page gets no CSS, header or footer. The URL is still `/your-page`
2. Add a `page.tsx` file (server component by default)
3. Client components need `"use client"` at the top
4. Add metadata export for SEO

### `next dev` rewrites AGENTS.md
When `next dev` runs inside an AI coding agent, Next.js 16.4 rewrites the managed block in `AGENTS.md` (see `node_modules/next/dist/server/lib/generate-agent-files.js`). It's harmless. Either commit the new block or discard it with `git checkout AGENTS.md`. Setting `agentRules: false` in `next.config.ts` turns this off (the next `next dev` then removes the block).

## Admin panel (Keystatic website editor)
A form-based editor at `/keystatic` for the site text that changes most, so she can update it without touching code. It is [Keystatic](https://keystatic.com), configured in `keystatic.config.ts`. It edits the 5 JSON files in `content/`. The public pages import those files at build time, so every page stays prerendered (○) and the live site never calls Keystatic. Exit plan if Keystatic ever has to go: delete `keystatic.config.ts`, `src/app/keystatic/`, `src/app/api/keystatic/` and the two `@keystatic/*` packages; the content stays plain JSON in git.

### What she can edit
| Editor page | File | What's on it |
|-------------|------|--------------|
| Practice info | `content/practice.json` | Phone, email, street address, city, state, ZIP, opening hours (half-hour pickers or "Closed all day"), Instagram/Facebook/YouTube links (empty hides the icon), top bar tagline, footer text |
| Prices & offer | `content/pricing.json` | Full arch price per arch, single implant price, optional bone graft range, the homepage limited-time offer (show/hide, its texts, optional last day) |
| Services | `content/services.json` | Text of the 5 fixed services (name, summary, Services-page subheading, paragraphs, benefits, a "needs clinical review" reminder) and their order. Free Consultation stays last |
| FAQ | `content/faq.json` | Questions and answers; drag to reorder |
| Patient reviews | `content/testimonials.json` | Name, review, short version, treatment labels, service, stars, source, date, "permission on file", "sample", show on homepage / consultation page |

**Stays with the developer, in code:** adding or removing a service (and the service ids); all photos and images; stats and credential badges (500+, 5.0, 98%, Board Certified…); financing month counts and the cost-estimator math; the About page, homepage copy and blog; cookie and legal text; the chat model and its rules; `url`, `name` and `NAV_LINKS` in `src/lib/constants.ts`. Several of these are planned for later phases (see TODO).

### Running it on this computer (works now, no account)
```bash
npm run dev:admin    # next dev -H 127.0.0.1 — listens on this computer only
```
Open http://127.0.0.1:3000/keystatic. This is Keystatic's **local** mode: Save writes `content/*.json` on disk, and the site at http://127.0.0.1:3000 shows the change straight away. Nothing is published until you build, commit, `git pull --rebase origin main` and push (see "Git + Deploy Workflow"). The editor only runs under `npm run dev:admin`; under plain `npm run dev` (which listens on every network interface, so other devices on the Wi-Fi can reach it) `/keystatic` and `/api/keystatic` are 404s. The reason: the editor's local read/write API (`/api/keystatic`) has no sign-in, so it must only be reachable from this computer. The switch is `src/app/keystatic/local-mode.ts`: npm sets `npm_lifecycle_event` to the script's name, so only `dev:admin`, which binds to 127.0.0.1, turns it on (on any OS, no extra variable). The route also refuses requests not addressed to 127.0.0.1, localhost or [::1], against DNS rebinding from other websites. See also "`next dev` rewrites AGENTS.md" above.

### Turning it on in production (not done yet)
Until this is done, `/keystatic` and `/api/keystatic/...` return 404 on the live site. In production the editor uses **Keystatic Cloud**: she signs in with her email and a passkey (no GitHub or Vercel account needed; free for up to 3 users), every Save becomes a commit on `main` made by the Keystatic GitHub App, and Vercel puts it live about 1–3 minutes later. No secret keys are involved; the only setting is the public project ID.
1. Create a Keystatic Cloud account at https://keystatic.cloud (sign in with GitHub; keep GitHub 2FA on). Create a team and a project for this site.
2. Install the Keystatic GitHub App on **this repository only**.
3. `vercel env add NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT production` with the value `team/project` (Production only). Then redeploy: push to `main`, or Vercel → Deployments → Redeploy. `NEXT_PUBLIC_` values are fixed at build time, so a new build is needed. Never `vercel --prod` from a local folder.
4. Sign in at https://ava-green.vercel.app/keystatic and make one test edit. Check that the bot's commit lands on `main`, that Vercel builds it and that the change is live. Then `git pull --rebase origin main` locally.
5. Push a deliberately invalid content change (for example the doctor's first name in an FAQ answer). Confirm the build fails and the live site stays unchanged, then revert it.
6. Turn on Vercel email notifications for failed production deployments. She can't see a failed build: she only sees that her change isn't live, and the editor tells her to contact you if a change isn't live after about 5 minutes. Until the bad content is fixed, none of her later saves go live either.
7. Invite her by email from Keystatic Cloud and walk her through it (about 20 minutes): create the account with a long unique password, register a passkey on her laptop (and phone if she wants), edit, Save, wait about 3 minutes, check the live site. Her email account needs 2FA, because it is the password-reset path.

### Moving it to admin.<domain> (phase 1.5, after the domain is connected)
Keystatic Cloud keeps her sign-in token in the browser's localStorage, which any script on the same origin can read. A subdomain of its own keeps that token away from third-party tags on the public site. **Once the editor is live in production, do this before turning on Google Analytics (gtag.js, Step 3), GTM, Clarity or the Meta Pixel** (Step 7).
1. Add `admin.reformdentalimplantcenter.com` to the Vercel project `ava`. Vercel shows the CNAME target, as it did for `www`.
2. Add that `CNAME admin …` record at Squarespace (needs the same DNS access as Step 5).
3. Set `ADMIN_HOST=admin.reformdentalimplantcenter.com` in Vercel **Production only** and redeploy. `next.config.ts` then adds the redirects: `admin.<domain>/` → `/keystatic`; any other path on the admin host → the main site; `/keystatic` on any other host → `https://admin.<domain>/keystatic`. A malformed value stops the build with a clear message.
4. Test a real Keystatic Cloud sign-in on the new address (not verified yet). The editor must stay at the `/keystatic` path: Keystatic hard-codes it, including its sign-in callback.

### What is deliberately NOT in the editor
- **No patient data, ever:** no leads, form submissions, appointment requests, chat messages or patient records. They are protected health information (HIPAA), and no BAA covers this setup. Form submissions go by email (Web3Forms) and never touch the repo or the editor. For her, "visibility" means editing her own content and, later, aggregate traffic numbers in GA4, never lead contents.
- **No photos or uploads yet:** the GitHub repo is public, so everything saved in the editor, with its whole history, is public. Patient photos wait for phase 3, after the repo is private and a consent workflow exists. The "Patient's written permission is on file" box is only her attestation; the signed permissions stay in the practice's own records, never in the editor or the repo.

### Guardrails
1. **In the editor, before Save** (`keystatic.config.ts`, with limits and patterns from `src/content/rules.ts`): required fields, length limits sized to the layouts, phone/email/state/ZIP formats, https-only social links, whole-dollar price ranges, half-hour time pickers, the fixed list of 5 services (ids hidden and unchangeable), and the name rule (`NO_NAME`) on every text field, the email and the links.
2. **Build gate** (`src/content/validate.ts`, server-only): runs at module scope in `src/app/(site)/layout.tsx` only, so `next build` fails on any invalid content file (every public page prerenders through that layout). It repeats the checks above with the zod schemas in `src/content/schema.ts` (in case a file was edited by hand), checks every value for the surname by SHA-256 hash (`src/content/blocked.ts`, server-only), and adds rules across fields: all 5 services exactly once with Free Consultation last; the bone graft range isn't upside down; closing time is after opening time. These build-only rules are spelled out in the editor's field descriptions, because the editor lets her save content that breaks them. A real (non-sample) review without "permission on file" is not an error: `src/content/testimonials.ts` leaves it off the website and the build prints a warning. The error lists each problem in plain English with the editor's labels (`FAQ (content/faq.json) › Question 1 › Answer: …`). On Vercel a failed build changes nothing: the last good deployment stays live. It deliberately doesn't run anywhere `/keystatic` loads (the root layout and the root `not-found.tsx` load there too), so bad content never locks her out of the editor she needs to fix it.
3. **Post-build scan** (`scripts/check-built-html.mjs`, part of `npm run build`): fails on "Dr. Ava" in any built page except `/about` and in any browser JavaScript chunk except the About page's own (found through Next's client reference manifests; the headshot alt text is the one exception), so text that appears only after the page loads is covered too; on the surname, by hash, in the built pages, the browser JavaScript, `src/`, `content/`, `public/manifest.json` and `keystatic.config.ts`; and on the hash itself in the browser JavaScript. It warns while the placeholder 555 phone number is still on the site. Vercel runs the `build` script by default; make sure Vercel → Project `ava` → Settings → Build Command isn't overridden with plain `next build`, or the scan is skipped there.
4. **Access:** `/keystatic` is a 404 in production until a Keystatic Cloud project is configured (decided at build time in `src/app/keystatic/layout.tsx`). `/api/keystatic` is local mode's read/write API, which has no sign-in in Keystatic 0.6.9: it answers only under `npm run dev:admin` (127.0.0.1 only; plain `npm run dev` gets a 404) and only to requests addressed to this computer, and it is always 404 in production (cloud mode doesn't use it). With `ADMIN_HOST` set, everything on the admin host except `/keystatic`, `/keystatic/…` and `/_next/…` is redirected to the main site (exact, case-sensitive matching). Next.js itself never redirects paths that start with `/_next`, so a junk URL like `/_nextfoo` still shows the site's 404 there; for that reason `GoogleAnalytics.tsx` never loads any tag on an `admin.` host. The editor sits outside `(site)`, so no analytics, pixels, chat widget or cookie banner load on it. `/keystatic` sends `X-Robots-Tag: noindex, nofollow` and `Cache-Control: no-store`, has noindex metadata and is disallowed in robots.txt. The site-wide `X-Frame-Options: DENY` stays.
5. **Upgrades:** `@keystatic/core` and `@keystatic/next` are pinned exactly. After any Next.js or Keystatic upgrade, check `/keystatic` both in a production build (`npm run build && npm start`: 404) and in `npm run dev:admin` (an edit saves).

### Known quirks (Keystatic 0.6.9)
- Inside a list item (a service, question or review), a field's error shows only after you click out of the field. If she clicks Done anyway, **Save does nothing**: no file is written and no message appears next to Save. The list pages tell her what to do, and the build gate catches it either way.
- The editor keeps unsaved edits in the browser and shows an "Unsaved" badge; Reset throws them away.
- `npm audit --omit=dev` reports 2 moderate issues (minimatch, through `@keystatic/core`). npm's only "fix" is a downgrade to an unusable 0.0.x version.
- On the live site, the `/keystatic` 404 still makes the browser download the editor's JavaScript (about 2.8 MB), although nothing renders. Harmless; see TODO.
- Open Keystatic bug #1627 (cloud mode): saving a list in an entry that also has image or rich-text fields dropped those fields. Phase 1 has neither; keep images out of entries that contain lists.

### Changing the editor (developer)
A field lives in four places that must agree: `keystatic.config.ts` (the form), `src/content/schema.ts` (the zod shape: same key order, empty optional fields left out of the file), the JSON file in `content/`, and the component that shows it (through `src/content/index.ts` or the `SITE_CONFIG`/`SERVICES` facades in `src/lib/constants.ts`). Shared limits and patterns go in `src/content/rules.ts`. Then run `npm run build` and do one Save in `npm run dev:admin` to confirm the editor writes exactly the shape the schema expects.

## Content That Needs Replacing
Placeholder practice info, reviews and service text now live in `content/*.json`. Change them in the website editor (`npm run dev:admin` → http://127.0.0.1:3000/keystatic), or she does it herself once the editor is live in production. `npm run build` warns while the 555 number is still on the site. Key items:
- **Phone:** Currently `(555) 123-4567` — editor → Practice info (`content/practice.json`)
- **Email:** Currently `info@reformsmile.com` — editor → Practice info
- **Address:** Currently placeholder — editor → Practice info
- **Hours:** Currently placeholder — editor → Practice info → Opening hours
- **Testimonials:** Sample reviews — replace with real patient quotes (fake reviews on a live medical site are an FTC risk) — editor → Patient reviews. A real review needs "sample" unticked and "permission on file" ticked; a real review without permission stays hidden (the build prints a warning). If every review is deleted or hidden, the homepage section is left out
- **Social links:** Facebook/YouTube still empty (icons hidden) — editor → Practice info → Social media links (Instagram is real)
- **Snap-On Dentures copy** on the Services page is a draft — needs Dr. Ava's clinical review — editor → Services (flagged "Text still needs clinical review")
- **Trust claims / stats** — still in code; see "Dr. Ava's content rules" above
- **Site address:** `url` in `src/lib/constants.ts` (TODO comment) — switch once the domain is connected (Step 5)

## Design References
Sites Dr. Ava used as inspiration:
1. nuviasmiles.com — Premium feel, cinematic hero
2. newlifeimplantcenter.com — Conversion-focused, pricing transparency
3. clearchoice.com — Trustworthy, strong social proof
4. clearchoice.com/schedule-a-consultation/ — Landing page for marketing campaigns
5. activetheory.net — 3D interactive experience (inspired V2 branch)

## Branches
- **`main`** — Production V1 (classic warm dental site with video hero)
- **`v2`** — Experimental 3D interactive version with Three.js teeth + scroll-orbit camera

## Decision Log
| Date | Decision | Reason |
|------|----------|--------|
| 2026-04-29 | Next.js over plain React | SSR/SSG needed for dental SEO |
| 2026-04-29 | Tailwind CSS v4 | Rapid UI, consistent design system |
| 2026-04-29 | Playfair Display + Inter fonts | Serif matches logo; Inter for readability |
| 2026-04-29 | Vercel for deployment | Free tier, instant previews, GitHub auto-deploy |
| 2026-04-29 | Navy #1B3A5C + Gold #C4A265 | Extracted from Dr. Ava's logo |
| 2026-04-30 | Regular `<a>` for /consultation links | Next.js Link crashes on cross-layout navigation |
| 2026-04-30 | Removed Video Testimonials section | All placeholders looked unprofessional |
| 2026-04-30 | Removed "Why Choose Us" section | Redundant with Trust Bar |
| 2026-04-30 | Added FAQ accordion | Good for SEO + answers common patient questions |
| 2026-04-30 | Added animated stat counters | More engaging than static numbers |
| 2026-05-01 | Full-screen mobile menu | Plain white dropdown looked cheap |
| 2026-11-11 | AI chat moved to server route `/api/chat` | The old `NEXT_PUBLIC_` key would have published the secret; the route didn't exist |
| 2026-11-11 | Forms never fake success in production | Missing key made every lead silently disappear |
| 2026-11-11 | `SERVICES` is the single services list | Snap-On Dentures was added to an unused list and never appeared |
| 2026-11-11 | Trust badges use icons, not logos | Letter-box placeholders looked broken; real logos need permission |
| 2026-11-11 | Next.js 16.2.4 → 16.4.6 | Critical security advisories in 16.2.x |
| 2026-11-11 | Keystatic website editor at `/keystatic` (local mode now, Keystatic Cloud later) | She can update practice info, prices, services, FAQ and reviews herself, with checks before Save. Content stays plain JSON in git; no database or secrets; works locally with no account; Cloud is free for 3 users. Sanity (account needed first, content leaves git) is the fallback |
| 2026-11-11 | `(site)` route group for every public page | The editor gets no site CSS, header, footer, trackers or chat widget. URLs and the built pages are unchanged |
| 2026-11-11 | Editable content in `content/*.json`, imported statically | Every page stays prerendered (○) with no runtime CMS dependency; each value lives in one place; `validate.ts` fails the build on bad content |
| 2026-11-11 | The admin never stores leads or patient data | HIPAA: no BAA covers this setup and the repo is public. Leads stay in email |
| 2026-11-11 | Deploy only by pushing to `main` (no more `vercel --prod`) | Her editor saves are commits on `main`; a CLI deploy from a local folder that hasn't pulled them would roll them back |
| 2026-11-11 | Surname stored only as a SHA-256 hash | The build and the post-build scan can block it without the word ever being written in the repo |

## Production Launch Checklist

Everything below is **already built and coded** — just needs keys/content to activate.

### Step 1: Update Practice Info (5 minutes)
In the website editor → **Practice info** (`npm run dev:admin`, then http://127.0.0.1:3000/keystatic; or she does it herself once the editor is live in production). It replaces the placeholders in `content/practice.json`:
```text
Phone number      (555) 123-4567                 ← Replace with real phone
Email address     info@reformsmile.com           ← Replace with real email
Street address    123 Main Street, Suite 100     ← Replace
City / State / ZIP  Los Angeles / CA / 90001     ← Replace
Opening hours     Mon–Fri 9–5, Sat 9–2, Sun closed ← Replace with real hours (Mon–Fri share one set)
Social media links  Facebook, YouTube empty      ← Add real URLs (Instagram is real)
```
Save, then build → commit → `git pull --rebase origin main` → push. The header, footer, contact page, booking pages, Google Maps on the contact page and Google's structured data all update from this one file. `docs/content-request.md` is the form for collecting these details from her. It asks for hours day by day, but the editor has one Monday-to-Friday block plus Saturday and Sunday: if her weekdays differ, per-day hours need a code change first (see TODO, phase 2).

### Step 2: Activate Form Emails (5 minutes, FREE) — REQUIRED before launch
Without this key, production forms show "please call us" (they never pretend to send). Local dev shows a demo success.
1. Go to https://web3forms.com and enter the email that should receive patient requests
2. Copy the access key
3. Add it to Vercel: `vercel env add NEXT_PUBLIC_WEB3FORMS_KEY production` (and `preview`), plus `.env.local` for local testing
4. Redeploy — Contact, Book and Consultation forms will email submissions

### Step 3: Activate Google Analytics (5 minutes, FREE)
1. Create a GA4 property at https://analytics.google.com and copy the Measurement ID (`G-XXXXXXXXXX`)
2. `vercel env add NEXT_PUBLIC_GA_TRACKING_ID production` → redeploy (loads only after cookie consent)
3. **Website editor first:** once the editor is live in production, leave this unset until the editor has moved to `admin.<domain>` ("Admin panel → Moving it to admin.<domain>"). GA's script (gtag.js from googletagmanager.com) would otherwise run on the same origin as her editor sign-in token

### Step 3b: Activate the AI chat (optional, pay-per-use)
1. Create an API key at https://console.anthropic.com (set a monthly spend limit there)
2. `vercel env add ANTHROPIC_API_KEY production` — **no `NEXT_PUBLIC_` prefix**
3. Redeploy. Without the key the chat answers with built-in demo replies. `/api/chat` has input validation, a same-site check and a per-visitor rate limit.

### Step 4: Add Real Content
- **Real testimonials** — website editor → Patient reviews (`content/testimonials.json`). For each real review untick "sample", and tick "permission on file" only when the patient's signed permission exists (until then it stays hidden). Delete the samples once real ones are in
- **More before/after photos** — Add to `public/images/cases/` and update `BeforeAfterSlider.tsx`
- **Credential badges** — confirm each claim in `src/components/sections/TrustLogos.tsx` with Dr. Ava (they use generic icons on purpose — no organization logos without permission)

### Step 5: Connect Domain (reformdentalimplantcenter.com)
Already done: domain added to Vercel project `ava`; `www` 308-redirects to the main domain.
Remaining (in Squarespace → Domains → reformdentalimplantcenter.com → DNS — needs Owner/Admin access):
1. Remove the "Squarespace Defaults" records
2. Add: `A @ 216.198.79.1`, `A @ 64.29.17.1`, `CNAME www 036862443cbcb748.vercel-dns-017.com`
3. Check with `vercel domains verify reformdentalimplantcenter.com` (HTTPS is automatic)
4. Change `url` in `src/lib/constants.ts` to `https://reformdentalimplantcenter.com` — metadata, sitemap, robots and structured data all follow it
5. Then cancel only the Squarespace *website* plan — keep the domain registration on auto-renew
6. Then phase 1.5 of the website editor: move it to `admin.reformdentalimplantcenter.com` (see "Admin panel → Moving it to admin.<domain>")

### Step 6: Optional — Blog CMS
For Dr. Ava to write blog posts without touching code. Planned as phase 2b of the website editor (no new account):
1. A Keystatic posts collection: one Markdoc file per post in `content/posts/`, rendered on the server into static `/blog/<slug>` pages
2. Sitemap entries and Article structured data per post; the byline is "Reform Smile team" (name rule)
3. She writes the post and clicks Save; it is live after the 1–3 minute build (there is no live preview). If instant publishing or live preview becomes a must, Sanity (https://sanity.io) is the fallback; the JSON content maps 1:1 to Sanity documents

### Step 7: Activate Tracking (FREE)
All tracking is built and respects cookie consent. Just add IDs to `.env.local`:

```bash
# Google Tag Manager — get at https://tagmanager.google.com
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX

# Microsoft Clarity (heatmaps + recordings) — get at https://clarity.microsoft.com
NEXT_PUBLIC_CLARITY_ID=your_clarity_id

# Facebook Pixel (ad retargeting) — get at https://business.facebook.com/events_manager
NEXT_PUBLIC_FB_PIXEL_ID=your_pixel_id
```

Conversion events already tracked: quiz_started, quiz_completed, cost_estimator_started, cost_estimator_completed, form_submitted, consultation_booked, chat_opened, phone_clicked.

Cookie consent banner handles legal compliance — tracking only loads after user accepts.

**Website editor first:** once the editor is live in production, turn on Google Analytics (Step 3), GTM, Clarity and the Meta Pixel only after it has moved to `admin.<domain>` ("Admin panel → Moving it to admin.<domain>"). Until then these tags would run on the same origin as her editor sign-in token.

### Future: Twilio Integration (Email + SMS)
We plan to migrate from Web3Forms to **Twilio** for:
- **Email notifications** — SendGrid (Twilio's email service) for form submissions, appointment confirmations, and follow-ups
- **SMS notifications** — Text message reminders for appointments, confirmations when patients book
- **Two-way SMS** — Patients can text the practice number directly
- This will require a Twilio account and API keys stored in environment variables (not in constants.ts)
- Implementation: Create Next.js API routes (`/api/send-email`, `/api/send-sms`) that call Twilio's SDK
- **Redesign before building:** form contents and appointment details are patient data. Twilio SendGrid is not HIPAA-eligible and Twilio won't sign a BAA for it (https://www.twilio.com/docs/sendgrid/ui/account-and-settings/hipaa-compliant), and a Vercel route that handles leads would need Vercel's paid BAA add-on (https://vercel.com/kb/guide/is-vercel-hipaa-compliant). None of this goes through the website editor (see "Admin panel → What is deliberately NOT in the editor")

## TODO (remaining)
- [ ] Replace placeholder content (Step 1 above)
- [ ] Set NEXT_PUBLIC_WEB3FORMS_KEY on Vercel (Step 2) — forms can't send without it
- [ ] Dr. Ava to confirm prices, stats and credential badges; review Snap-On Dentures copy
- [x] Add Dr. Ava's professional headshot
- [ ] Add real patient testimonials
- [ ] More before/after photo pairs for slider
- [ ] Blog in the website editor (phase 2b, Step 6; Sanity is the fallback)
- [ ] Connect custom domain
- [ ] Twilio integration for email + SMS notifications (redesign for HIPAA first, see that section)
- [ ] Vercel Pro before launch: Hobby is for personal, non-commercial use only (https://vercel.com/docs/plans/hobby). Turn on Vercel 2FA too

### Admin panel (website editor)
- [x] Phase 1 built (branch `admin-panel`): `(site)` route group, `content/*.json`, Keystatic in local mode, build gate and post-build scan
- [ ] Ship phase 1: preview deploy, then merge `admin-panel` into `main`. Production looks exactly as before and `/keystatic` stays a 404
- [ ] Enter the real practice info through the local editor (`docs/content-request.md`) and push it
- [ ] Turn it on in production ("Admin panel → Turning it on in production"): Keystatic Cloud team + project, GitHub App on this repo only, `NEXT_PUBLIC_KEYSTATIC_CLOUD_PROJECT` in Vercel Production, one test edit, one deliberately invalid commit, failed-deployment emails, then invite her and walk her through it
- [ ] Phase 1.5, after the domain is connected: `admin.<domain>` in Vercel + its CNAME + `ADMIN_HOST`, then test the Cloud sign-in there. Only after that turn on Google Analytics, GTM, Clarity and the Meta Pixel
- [ ] Phase 1.5 (optional): stop the production `/keystatic` 404 from downloading the editor's ~2.8 MB JavaScript, e.g. a `rewrites().beforeFiles` rule in `next.config.ts` that sends `/keystatic` and `/api/keystatic` to a missing path while the editor is off
- [ ] Phase 2, claims: stats and badge on/off switches (wording stays in code) plus a "last reviewed" date. Have her confirm with counsel the California B&P §651 limits on "specialist" and "board certified"
- [ ] Phase 2, pages: About page (the only place the name is allowed), homepage copy and section show/hide switches, per-page SEO fields, more social links (TikTok, Yelp, Google Business)
- [ ] Phase 2, per-day opening hours: seven days in `content/practice.json` instead of Mon–Fri + Sat + Sun, grouped for display (footer, contact page, chat, structured data), as `docs/content-request.md` collects them
- [ ] Phase 2, one source per value: build the consultation "concerns" dropdown, the cost-estimator options and the layout keywords from `SERVICES`; build the booking time slots from the opening hours (fixes the Saturday 4 PM slot); make the chat demo replies and prompt read `faq` and `pricing`
- [ ] Phase 2, "what's live" page at `/admin` (static, noindex, no data): links to the editor and the site, the live build's time and commit message, a GA4 report shared with her (aggregate counts only)
- [ ] Make the GitHub repo private (free); first confirm the Keystatic GitHub App and Vercel still work with a private repo
- [ ] Phase 3, photos (only after the repo is private): a photo library with "shows a patient" and "authorization on file" flags, the gallery and before/after slider as editable data, and a build check that rejects HEIC, files over 5 MB and GPS data
