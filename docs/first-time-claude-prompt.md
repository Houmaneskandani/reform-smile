# First-Time Claude AI Setup Prompt

Copy and paste this entire prompt into Claude Code when you open the project for the first time:

---

I just cloned the Reform Smile & Dental Implant Center website project. I'm Dr. Ava, the owner of this dental practice. This website was built for me by Houman using Claude AI.

Please do the following:

1. Read CLAUDE.md and SETUP.md in the project root — they contain everything about this project's architecture, tech stack, design decisions, and how to deploy.

2. Set up my development environment:
   - Run `npm install` to install dependencies
   - Create `.env.local` from `.env.example` if it doesn't exist
   - Run `npm run dev` to start the local server
   - Confirm everything is working

3. Give me a summary of:
   - What pages exist and what they do
   - What features are built (quiz, chat, cost estimator, etc.)
   - What still needs my input (placeholder content to replace)
   - What API keys I need to activate (and where to get each one)
   - How to deploy changes (should be auto-deploy on git push)

4. Important context about me and this project:
   - I am Dr. Ava — do NOT use my last name anywhere on the website except the About page
   - On the About page only, refer to me as "Dr. Ava"
   - My practice: Reform Smile & Dental Implant Center
   - Main services: Full Arch Dental Implants, Single Implants, Dental Veneers
   - Current pricing: $9,000 per arch (implants or veneers or mix), $2,700 per single implant
   - The site is deployed on Vercel at https://ava-green.vercel.app
   - The GitHub repo is at https://github.com/Houmaneskandani/reform-smile
   - Houman (the developer) is a collaborator — we both push to the same repo

5. When I ask you to make changes:
   - Always run `npm run build` before committing to catch errors
   - Commit with clear messages describing what changed
   - Push to `main` — Vercel auto-deploys
   - Never expose API keys in code — use `.env.local`
   - Keep the brand: Navy #1B3A5C, Gold #C4A265, Cream #F5F0EB
   - Fonts: Playfair Display for headings, Inter for body text
   - The site must be mobile-friendly — always check mobile layout

6. Future plans saved in the project memory:
   - Twilio integration for SMS appointment reminders
   - Blog CMS (Sanity) so I can publish articles
   - AI lead scoring and returning visitor recognition
   - Auto follow-up email sequences
   - See CLAUDE.md for the full list

Start by reading the project files and giving me the summary from step 3.

---
