# Reform Smile — Developer Setup Guide

Welcome! This guide will get you up and running with the Reform Smile website on your computer.

## Prerequisites

You need these installed on your computer:

1. **Node.js** (v18 or higher) — [Download here](https://nodejs.org)
2. **Git** — [Download here](https://git-scm.com/downloads)
3. **GitHub CLI** — Install via terminal: `brew install gh` (Mac) or [download](https://cli.github.com)
4. **Vercel CLI** — Install via terminal: `npm install -g vercel`
5. **A code editor** — [VS Code](https://code.visualstudio.com) recommended

## Step 1: Clone the Project

Open your terminal and run:

```bash
gh auth login          # Login to GitHub (follow browser prompts)
git clone https://github.com/Houmaneskandani/reform-smile.git
cd reform-smile
```

## Step 2: Install Dependencies

```bash
npm install
```

## Step 3: Set Up Environment Variables

```bash
cp .env.example .env.local
```

Then edit `.env.local` and fill in any API keys you have. The site works without them (demo mode).

## Step 4: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should see the website!

## Step 5: Making Changes

1. Edit any file in `src/` — the browser auto-refreshes
2. When happy with changes:

```bash
npm run build                    # Check for errors
git add -A                       # Stage changes
git commit -m "Description"      # Commit
git push origin main             # Push to GitHub
vercel --prod --yes              # Deploy to live site
```

## Project Structure

```
src/
├── app/           → Pages (each folder = a URL route)
├── components/    → Reusable UI pieces
└── lib/           → Config, helpers, utilities

public/
├── images/        → Photos and case images
├── logo*.png      → Logo variants
└── favicon.ico    → Browser tab icon
```

## Key Files to Know

| File | What It Does |
|------|-------------|
| `src/lib/constants.ts` | Phone, email, address, hours — edit here to update everywhere |
| `src/app/page.tsx` | Homepage — controls which sections show and in what order |
| `src/app/layout.tsx` | Global layout — header, footer, fonts, SEO metadata |
| `.env.local` | API keys (never committed to git) |
| `CLAUDE.md` | Full project documentation for AI assistants |

## Common Tasks

### Update contact info
Edit `src/lib/constants.ts` — phone, email, address, hours, social links

### Add a new photo
1. Put the image in `public/images/cases/`
2. Reference it as `/images/cases/your-image.jpg` in any component

### Change text on a page
Find the page in `src/app/[page-name]/` and edit the `.tsx` files

### Deploy changes
```bash
npm run build && git add -A && git commit -m "your message" && git push origin main && vercel --prod --yes
```

## Using Claude AI with This Project

This project has a `CLAUDE.md` file that tells Claude everything about the codebase. When you open this project in Claude Code (or any AI coding assistant), it will automatically understand:

- How the project is structured
- What technologies are used
- How to deploy
- What's been built and what's planned
- All design decisions and their reasons

Just open the project folder and start asking Claude questions!

## Need Help?

- Read `CLAUDE.md` for full technical documentation
- Check `.env.example` for all available API keys
- Contact Houman for access or permissions issues
