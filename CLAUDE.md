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
- **Domain:** TBD — will connect Dr. Ava's existing domain after approval

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
│   └── consultation/           # Marketing landing page — has its own minimal layout (no header/footer)
├── components/
│   ├── layout/
│   │   ├── Header.tsx          # Sticky header — transparent on homepage, solid on other pages
│   │   ├── Footer.tsx          # Full footer with contact, hours, links
│   │   └── FooterWrapper.tsx   # Hides footer on consultation + clinical homepage
│   ├── sections/               # Homepage sections
│   │   ├── Hero.tsx            # Video background hero with CTAs
│   │   ├── TrustBar.tsx        # 4 trust indicators
│   │   ├── Services.tsx        # 6-card service grid
│   │   ├── StatsCounter.tsx    # Animated number counters (500+, 5.0, 98%, 1 Day)
│   │   ├── BeforeAfter.tsx     # Gallery with real patient photos
│   │   ├── Process.tsx         # 4-step "How It Works"
│   │   ├── About.tsx           # Dr. Ava section
│   │   ├── Testimonials.tsx    # Patient review cards
│   │   ├── FAQ.tsx             # Accordion FAQ (7 questions)
│   │   └── CTASection.tsx      # Final call-to-action
│   ├── ui/
│   │   └── Button.tsx          # Reusable button (uses <a> for /consultation to avoid nav crash)
│   └── StructuredData.tsx      # JSON-LD schema for Google (Dentist/LocalBusiness)
├── lib/
│   └── constants.ts            # Site config (phone, email, address, hours, nav links, services)
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
- **Dr. Ava's photo:** Still placeholder "A" circle — replace in About section
- **Testimonials:** Sample reviews — replace with real patient quotes
- **Social links:** All `#` — update in `src/lib/constants.ts`

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

### Step 2: Activate Form Emails (5 minutes, FREE)
Forms currently work in demo mode. To receive real submissions by email:
1. Go to https://web3forms.com
2. Enter Dr. Ava's email address
3. Copy the access key they give you
4. Paste it in `src/lib/constants.ts`:
```typescript
web3formsKey: "paste-key-here",
```
5. Deploy — all 3 forms (Contact, Book, Consultation) will now email submissions

### Step 3: Activate Google Analytics (5 minutes, FREE)
1. Go to https://analytics.google.com
2. Create a new GA4 property for the website
3. Copy the Measurement ID (looks like `G-XXXXXXXXXX`)
4. Paste in `src/lib/constants.ts`:
```typescript
gaTrackingId: "G-XXXXXXXXXX",
```
5. Deploy — analytics will start tracking immediately

### Step 4: Add Real Content
- **Dr. Ava's headshot** — Replace placeholder in `src/components/sections/About.tsx` and `src/app/about/DoctorBio.tsx`
- **Real testimonials** — Update `src/components/sections/Testimonials.tsx`
- **More before/after photos** — Add to `public/images/cases/` and update `BeforeAfterSlider.tsx`
- **Certification logos** — Replace text badges in `src/components/sections/TrustLogos.tsx` with real logo images

### Step 5: Connect Domain
1. Go to Dr. Ava's domain registrar (GoDaddy, Namecheap, etc.)
2. In Vercel dashboard: Settings → Domains → Add domain
3. Update DNS records as Vercel instructs (usually a CNAME or A record)
4. Update `metadataBase` in `src/app/layout.tsx` to the real domain
5. Update `sitemap.xml` and `robots.txt` URLs to the real domain
6. Update `url` in `src/components/StructuredData.tsx` to the real domain

### Step 6: Optional — Blog CMS
For Dr. Ava to write blog posts without touching code:
1. Set up Sanity CMS (free tier) at https://sanity.io
2. Connect it to the blog page
3. She gets a visual editor to publish articles

### Future: Twilio Integration (Email + SMS)
We plan to migrate from Web3Forms to **Twilio** for:
- **Email notifications** — SendGrid (Twilio's email service) for form submissions, appointment confirmations, and follow-ups
- **SMS notifications** — Text message reminders for appointments, confirmations when patients book
- **Two-way SMS** — Patients can text the practice number directly
- This will require a Twilio account and API keys stored in environment variables (not in constants.ts)
- Implementation: Create Next.js API routes (`/api/send-email`, `/api/send-sms`) that call Twilio's SDK

## TODO (remaining)
- [ ] Replace placeholder content (Step 1 above)
- [ ] Add Dr. Ava's professional headshot
- [ ] Add real patient testimonials
- [ ] More before/after photo pairs for slider
- [ ] Blog CMS setup (Sanity)
- [ ] Connect custom domain
- [ ] Twilio integration for email + SMS notifications
