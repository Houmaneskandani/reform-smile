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

## TODO (prioritized)
- [ ] Replace placeholder phone, email, address (update constants.ts)
- [ ] Add Dr. Ava's professional headshot
- [ ] Add real patient testimonials
- [ ] Before/After image drag slider (compare tool)
- [ ] Floating "Book Now" button on mobile
- [ ] Insurance/financing banner section
- [ ] Google Maps embed on contact page
- [ ] Email service for form submissions (Resend or Nodemailer)
- [ ] Blog CMS (Sanity recommended for non-technical editing)
- [ ] Google Analytics
- [ ] Connect Dr. Ava's existing domain
