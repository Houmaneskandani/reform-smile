# Reform Smile & Dental Implant Center — AI Project Log

## Project Overview
- **Client:** Dr. Ava Pournejad, DDS
- **Practice:** Reform Smile & Dental Implant Center
- **Focus:** All-on-X / Full Arch Dental Implants for patients with missing teeth
- **Built by:** Houman Eskandani (for Dr. Ava)
- **AI Assistant:** Claude (Anthropic) — used throughout development
- **Started:** April 29, 2026

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **SEO:** Built-in Next.js metadata + structured data (schema.org)
- **Deployment:** Vercel (free tier)
- **Repository:** GitHub

## Brand Guidelines
- **Primary color (Navy):** #1B3A5C
- **Accent color (Gold):** #C4A265
- **Background (Cream):** #F5F0EB
- **Text (Dark):** #1A1A2E
- **Heading font:** Playfair Display (serif — matches logo elegance)
- **Body font:** Inter (clean sans-serif)
- **Logo file:** /public/logo.png

## Architecture
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout (header + footer + fonts + SEO)
│   ├── page.tsx            # Homepage
│   ├── about/              # About Dr. Ava
│   ├── services/           # Services offered
│   ├── gallery/            # Smile gallery / before-after
│   ├── blog/               # Blog articles (SEO)
│   ├── contact/            # Contact page with form
│   ├── book/               # Appointment booking
│   └── consultation/       # Marketing landing page (for paid ads)
├── components/
│   ├── layout/             # Header, Footer
│   ├── sections/           # Homepage sections (Hero, Services, About, etc.)
│   └── ui/                 # Reusable UI (Button, etc.)
└── lib/
    └── constants.ts        # Site config, nav links, services data
```

## Commands
- `npm run dev` — Start development server (http://localhost:3000)
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Design References
Sites Dr. Ava used as inspiration:
1. nuviasmiles.com — Premium feel, cinematic hero
2. newlifeimplantcenter.com — Conversion-focused, pricing transparency
3. clearchoice.com — Trustworthy, strong social proof
4. clearchoice.com/schedule-a-consultation/ — Landing page for marketing campaigns

## Decision Log
| Date | Decision | Reason |
|------|----------|--------|
| 2026-04-29 | Next.js over plain React | SSR/SSG needed for dental SEO — must rank on Google |
| 2026-04-29 | Tailwind CSS v4 | Rapid UI development, consistent design system |
| 2026-04-29 | Playfair Display + Inter fonts | Serif headings match logo elegance; Inter for readability |
| 2026-04-29 | Vercel for deployment | Free tier, instant previews, GitHub auto-deploy |
| 2026-04-29 | No Docker initially | Vercel handles deployment; add Docker later if needed |
| 2026-04-29 | Navy #1B3A5C + Gold #C4A265 palette | Extracted from Dr. Ava's logo — professional and warm |

## Known Issues / TODO
- [ ] Replace placeholder phone, email, address with real info
- [ ] Add Dr. Ava's professional headshot photo
- [ ] Add real patient testimonials
- [ ] Add real before/after gallery photos
- [ ] Build out inner pages (About, Services, Contact, Blog, Gallery, Book)
- [ ] Build consultation landing page (marketing funnel)
- [ ] Set up email service for form submissions
- [ ] Add Google Maps embed on contact page
- [ ] Connect custom domain after demo approval
- [ ] SEO: Add structured data (LocalBusiness, Dentist schema)
- [ ] Blog CMS decision — MDX vs Sanity
- [ ] Set up GitHub repo and Vercel deployment
