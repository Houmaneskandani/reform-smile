import type { Metadata } from "next";
import { SITE_CONFIG } from "@/lib/constants";
import { telHref } from "@/content/format";

// Accessibility statement (see CLAUDE.md → "Accessibility"). Keep it truthful: it may only claim
// what has actually been checked. Update LAST_REVIEWED and the limitations list whenever the site
// is re-checked or something new is added (photos, videos, embedded forms, a new tracker…).
// Never write "compliant" or "certified" here unless a formal outside audit says so.
const LAST_REVIEWED = "November 2026";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: `How ${SITE_CONFIG.name} makes this website usable for everyone, and how to reach us if something is hard to use.`,
  alternates: { canonical: "/accessibility" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-2xl text-navy mb-4">{title}</h2>
      <div className="space-y-4 text-gray leading-relaxed">{children}</div>
    </section>
  );
}

export default function AccessibilityPage() {
  const phoneLink = (
    <a href={telHref(SITE_CONFIG.phone)} className="text-navy font-semibold underline">
      {SITE_CONFIG.phone}
    </a>
  );

  return (
    <>
      <section className="bg-navy py-24 md:py-28">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-4">
            Accessibility Statement
          </h1>
          <p className="text-white/70">Last reviewed: {LAST_REVIEWED}</p>
        </div>
      </section>

      <div className="bg-white py-16 md:py-24">
        <div className="section-container max-w-3xl">
          <Section title="Our commitment">
            <p>
              {SITE_CONFIG.name} wants everyone to be able to use this website, including people
              who use a screen reader, a keyboard instead of a mouse, voice control or screen
              magnification.
            </p>
            <p>
              We design and test this website against the Web Content Accessibility Guidelines
              (WCAG) 2.1, Level AA, the standard most widely used for websites.
            </p>
          </Section>

          <Section title="What we have done">
            <ul className="list-disc pl-6 space-y-2">
              <li>Text and buttons have strong colour contrast.</li>
              <li>Images that carry meaning have text descriptions.</li>
              <li>
                Every page can be used with a keyboard alone, including the menu, the forms, the
                questions and answers, the before-and-after photo slider and the chat. A
                &ldquo;Skip to main content&rdquo; link is the first thing the Tab key reaches.
              </li>
              <li>
                Form fields have labels, and errors are explained in words, not only in colour.
              </li>
              <li>
                The moving video at the top of the homepage has a pause button. It has no sound,
                and it does not play at all if your device is set to reduce motion.
              </li>
              <li>
                Pages fit narrow screens and high zoom without scrolling sideways.
              </li>
            </ul>
          </Section>

          <Section title="How we check">
            <p>
              We run automated accessibility checks on every page, and we test the pages by hand
              with a keyboard and on small screens. We check again when we make larger changes to
              the website.
            </p>
          </Section>

          <Section title="Known limitations">
            <ul className="list-disc pl-6 space-y-2">
              <li>
                Our smile gallery and blog are still being built. When we add patient photos and
                articles, each photo will get a text description.
              </li>
              <li>
                The map on our contact page comes from Google, and we can&rsquo;t change how it
                works. Our address is also written out on the same page.
              </li>
              <li>
                We have not yet had the website reviewed by people who use screen readers every
                day. We plan to, and we will fix what they find.
              </li>
            </ul>
          </Section>

          <Section title="Need help or found a problem?">
            <p>
              If any part of this website is hard to use, or you would like information in another
              format, please call us at {phoneLink} or email{" "}
              <a href={`mailto:${SITE_CONFIG.email}`} className="text-navy font-semibold underline">
                {SITE_CONFIG.email}
              </a>
              . Please tell us which page you were on and what happened.
            </p>
            <p>
              You never need the website to see us: we are glad to book appointments and answer
              questions by phone.
            </p>
          </Section>
        </div>
      </div>
    </>
  );
}
