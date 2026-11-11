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
npm run build        # Production build
npm run lint         # Run linter
```

## Git + Deploy Workflow
**IMPORTANT:** This is how every change gets committed and deployed. Follow these exact steps:

### 1. Build first (catch errors before committing)
```bash
npm run build
```

### 2. Stage and commit
```bash
git add -A
git commit -m "Short description of what changed"
```

### 3. Push to GitHub
```bash
git push origin main
```

### 4. Deploy to Vercel (production)
```bash
vercel --prod --yes
```

### All-in-one command (build + commit + push + deploy):
```bash
npm run build && git add -A && git commit -m "Your message here" && git push origin main && vercel --prod --yes
```

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
- **Deployment:** Vercel (free tier)
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
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (header + footer + fonts + SEO + structured data)
│   ├── page.tsx                # Homepage
│   ├── about/                  # About Dr. Ava (hero + bio + mission + technology)
│   ├── services/               # Services (hero + detailed service list with images)
│   ├── gallery/                # Smile gallery / before-after grid
│   ├── blog/                   # Blog articles placeholder (SEO)
│   ├── contact/                # Contact page (info + validated form + map placeholder)
│   ├── book/                   # Appointment booking (full form with date/time picker)
│   ├── consultation/           # Marketing landing page — has its own minimal layout (no header/footer)
│   ├── api/chat/route.ts       # Server-side AI chat (Claude). Reads ANTHROPIC_API_KEY on the server only
│   ├── sitemap.ts              # /sitemap.xml — built from SITE_CONFIG.url
│   └── robots.ts               # /robots.txt — built from SITE_CONFIG.url
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Sticky header — transparent on homepage, solid on other pages
│   │   ├── Footer.tsx          # Full footer with contact, hours, links
│   │   └── FooterWrapper.tsx   # Hides footer on consultation + clinical homepage
│   ├── sections/               # Homepage sections
│   │   ├── Hero.tsx            # Video background hero with CTAs
│   │   ├── TrustBar.tsx        # 4 trust indicators
│   │   ├── TrustLogos.tsx      # Credential badges (icons, no trademarks) — claims need Dr. Ava's confirmation
│   │   ├── Services.tsx        # Service cards built from SERVICES (4 treatments + highlighted consultation)
│   │   ├── StatsCounter.tsx    # Animated number counters (500+, 5.0, 98%, 1 Day)
│   │   ├── BeforeAfterSlider.tsx # Drag-to-compare before/after with real patient photos
│   │   ├── Process.tsx         # 4-step "How It Works"
│   │   ├── About.tsx           # Dr. Ava section
│   │   ├── Testimonials.tsx    # Patient review cards
│   │   ├── FAQ.tsx             # Accordion FAQ (7 questions)
│   │   └── CTASection.tsx      # Final call-to-action
│   ├── ui/
│   │   └── Button.tsx          # Reusable button (uses <a> for /consultation to avoid nav crash)
│   ├── AIChatAssistant.tsx     # Chat widget — calls /api/chat, falls back to demo answers without a key
│   ├── CookieConsent.tsx       # Consent banner — analytics/pixels load only after "Accept"
│   └── StructuredData.tsx      # JSON-LD for Google (Dentist) — built from SITE_CONFIG + SERVICES
├── lib/
│   ├── constants.ts            # Site config (url, phone, email, address, hours) + the ONE canonical SERVICES list
│   ├── submitForm.ts           # Web3Forms submit — never fakes success in production; honeypot spam check
│   └── tracking.ts             # Conversion events (only after cookie consent)
└── public/
    ├── logo.png, logo-transparent.png, logo-white.png
    ├── favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png
    ├── og-image.jpg            # Social media preview image
    ├── manifest.json           # PWA manifest
    └── images/
        └── cases/              # Real patient photos from Dr. Ava
            ├── case-1-full-arch.jpg
            ├── case-2-before-after.jpg
            ├── case-3-implant-placement.jpg
            └── case-4-prosthetic.jpg
```

## Key Design Decisions & Gotchas

### Dr. Ava's content rules (follow these in every change)
- **Name:** the surname "Pournejad" must not appear anywhere. "Dr. Ava" appears **only on the About page** (and as alt text on her headshot). Everywhere else write "our team", "our doctor", or "Reform Smile". The AI chat is told the same.
- **Services:** `SERVICES` in `src/lib/constants.ts` is the single list (Full Arch, Single Implants, Veneers, Snap-On Dentures, Free Consultation). Homepage cards, Services page, booking dropdown, Google structured data and the AI chat all read it — add/rename a service there, then add its long-form copy in `src/app/services/ServicesList.tsx`.
- **Claims:** prices ($9,000/arch, $2,700/implant), stats (500+, 5.0, 98%) and credentials/badges (Board Certified, ADA, AAID, HIPAA, CareCredit, insurance) must be confirmed by Dr. Ava — don't add or change them on your own.

### Secrets vs public keys
- Anything prefixed `NEXT_PUBLIC_` is shipped to every visitor's browser. Only public IDs go there (Web3Forms key, GA/GTM/Clarity/Pixel IDs).
- Secret keys (`ANTHROPIC_API_KEY`, Twilio, SendGrid) **never** get the `NEXT_PUBLIC_` prefix and are only read in `src/app/api/*` server routes.
- Real values live in Vercel → Project `ava` → Settings → Environment Variables (and `.env.local` for local dev). `.env.example` lists them all.

### Navigation between consultation page and other pages
The `/consultation` page has its own minimal layout (no header/footer). Using Next.js `<Link>` for client-side navigation between this page and regular pages causes a crash. **Always use regular `<a>` tags** for links to/from `/consultation`. This is handled in `Button.tsx` automatically.

### Header behavior
- **Homepage (`/`):** Header starts transparent with white logo, transitions to solid white with color logo on scroll
- **Other pages:** Always solid white with color logo
- **Consultation (`/consultation`):** Header hidden entirely — page has its own minimal top bar
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
1. Create a folder in `src/app/your-page/`
2. Add a `page.tsx` file (server component by default)
3. Client components need `"use client"` at the top
4. Add metadata export for SEO

## Content That Needs Replacing
All placeholder content is marked with TODO comments in the code. Key items:
- **Phone:** Currently `(555) 123-4567` — update in `src/lib/constants.ts`
- **Email:** Currently `info@reformsmile.com` — update in `src/lib/constants.ts`
- **Address:** Currently placeholder — update in `src/lib/constants.ts`
- **Hours:** Currently placeholder — update in `src/lib/constants.ts`
- **Testimonials:** Sample reviews — replace with real patient quotes (fake reviews on a live medical site are an FTC risk)
- **Social links:** Facebook/YouTube still `#` — update in `src/lib/constants.ts` (Instagram is real)
- **Snap-On Dentures copy** on the Services page is a draft — needs Dr. Ava's clinical review
- **Trust claims / stats** — see "Dr. Ava's content rules" above

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

## Production Launch Checklist

Everything below is **already built and coded** — just needs keys/content to activate.

### Step 1: Update Practice Info (5 minutes)
Edit `src/lib/constants.ts` and replace all placeholder values:
```typescript
phone: "(555) 123-4567",     // ← Replace with real phone
email: "info@reformsmile.com", // ← Replace with real email
address: "123 Main Street, Suite 100", // ← Replace
city: "Los Angeles",          // ← Replace
state: "CA",                  // ← Replace
zip: "90001",                 // ← Replace
hours: { ... },               // ← Replace with real hours
social: { instagram: "#", ... }, // ← Replace with real URLs
```
Google Maps on the contact page will automatically update to the new address.

### Step 2: Activate Form Emails (5 minutes, FREE) — REQUIRED before launch
Without this key, production forms show "please call us" (they never pretend to send). Local dev shows a demo success.
1. Go to https://web3forms.com and enter the email that should receive patient requests
2. Copy the access key
3. Add it to Vercel: `vercel env add NEXT_PUBLIC_WEB3FORMS_KEY production` (and `preview`), plus `.env.local` for local testing
4. Redeploy — Contact, Book and Consultation forms will email submissions

### Step 3: Activate Google Analytics (5 minutes, FREE)
1. Create a GA4 property at https://analytics.google.com and copy the Measurement ID (`G-XXXXXXXXXX`)
2. `vercel env add NEXT_PUBLIC_GA_TRACKING_ID production` → redeploy (loads only after cookie consent)

### Step 3b: Activate the AI chat (optional, pay-per-use)
1. Create an API key at https://console.anthropic.com (set a monthly spend limit there)
2. `vercel env add ANTHROPIC_API_KEY production` — **no `NEXT_PUBLIC_` prefix**
3. Redeploy. Without the key the chat answers with built-in demo replies. `/api/chat` has input validation, a same-site check and a per-visitor rate limit.

### Step 4: Add Real Content
- **Real testimonials** — Update `src/components/sections/Testimonials.tsx`
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

### Step 6: Optional — Blog CMS
For Dr. Ava to write blog posts without touching code:
1. Set up Sanity CMS (free tier) at https://sanity.io
2. Connect it to the blog page
3. She gets a visual editor to publish articles

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

### Future: Twilio Integration (Email + SMS)
We plan to migrate from Web3Forms to **Twilio** for:
- **Email notifications** — SendGrid (Twilio's email service) for form submissions, appointment confirmations, and follow-ups
- **SMS notifications** — Text message reminders for appointments, confirmations when patients book
- **Two-way SMS** — Patients can text the practice number directly
- This will require a Twilio account and API keys stored in environment variables (not in constants.ts)
- Implementation: Create Next.js API routes (`/api/send-email`, `/api/send-sms`) that call Twilio's SDK

## TODO (remaining)
- [ ] Replace placeholder content (Step 1 above)
- [ ] Set NEXT_PUBLIC_WEB3FORMS_KEY on Vercel (Step 2) — forms can't send without it
- [ ] Dr. Ava to confirm prices, stats and credential badges; review Snap-On Dentures copy
- [x] Add Dr. Ava's professional headshot
- [ ] Add real patient testimonials
- [ ] More before/after photo pairs for slider
- [ ] Blog CMS setup (Sanity)
- [ ] Connect custom domain
- [ ] Twilio integration for email + SMS notifications
