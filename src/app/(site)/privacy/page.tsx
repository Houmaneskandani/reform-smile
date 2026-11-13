import type { Metadata } from "next";
import Link from "next/link";
import { SITE_CONFIG } from "@/lib/constants";
import { telHref } from "@/content/format";

// DRAFT, written from what this website actually does (see CLAUDE.md → "Privacy policy").
// It needs a review by the practice (and ideally its attorney) before it is relied on, and it
// must be updated whenever the site starts collecting something new (a new form field, a new
// tracker, the Marketing Ava lead forward, text-message consent…).
// It is NOT the practice's HIPAA Notice of Privacy Practices, which covers patient records.
const LAST_UPDATED = "November 13, 2026";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_CONFIG.name} collects, uses and protects the information you share on this website.`,
  alternates: { canonical: "/privacy" },
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-10">
      <h2 className="font-heading text-2xl text-navy mb-4">{title}</h2>
      <div className="space-y-4 text-gray leading-relaxed">{children}</div>
    </section>
  );
}

export default function PrivacyPage() {
  return (
    <>
      <section className="bg-navy py-24 md:py-28">
        <div className="section-container text-center">
          <h1 className="font-heading text-4xl md:text-5xl text-white leading-tight mb-4">
            Privacy Policy
          </h1>
          <p className="text-white/70">Last updated: {LAST_UPDATED}</p>
        </div>
      </section>

      <div className="bg-white py-16 md:py-24">
        <div className="section-container max-w-3xl">
          <Section title="Who we are">
            <p>
              This website is operated by {SITE_CONFIG.name} (&ldquo;we&rdquo;, &ldquo;us&rdquo;).
              This policy explains what information the website collects, how we use it and the
              choices you have. It covers this website only.
            </p>
            <p>
              Records of your dental care are covered by a separate document, our Notice of
              Privacy Practices, which describes your rights under the federal health privacy
              law (HIPAA). You can ask our office for a copy at any time.
            </p>
          </Section>

          <Section title="Information you give us">
            <p>
              When you send the contact, appointment or free consultation form, we receive what
              you type into it: your name, email address, phone number, the service or concern
              you select, your preferred date and time, and any message you add.
            </p>
            <p>
              When you use the chat assistant, we receive the messages you type. The assistant
              gives general information only. It is not a dentist and does not give medical
              advice.
            </p>
            <p>
              Please do not send detailed medical history, insurance numbers or payment details
              through the website. We will ask for what we need in person or by phone.
            </p>
          </Section>

          <Section title="Information collected automatically">
            <p>
              Like most websites, our hosting provider records basic technical details when you
              visit, such as your IP address, browser type and the pages requested. These are
              used to deliver the site and keep it secure.
            </p>
            <p>
              Analytics and advertising tools (such as Google Analytics, Google Tag Manager,
              Microsoft Clarity or the Meta Pixel) load only if you choose &ldquo;Accept&rdquo;
              in the cookie banner. If you decline, they do not load. Your choice is saved in
              your browser, and you can change it at any time with the &ldquo;Cookie
              settings&rdquo; link at the bottom of any page.
            </p>
            <p>
              The map on our Contact page is provided by Google Maps, which may collect
              information under Google&rsquo;s own privacy policy when the map loads.
            </p>
          </Section>

          <Section title="How we use your information">
            <p>We use the information you send us to:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>answer your questions and schedule your visit;</li>
              <li>contact you about the appointment or consultation you asked for;</li>
              <li>keep the website working, secure and useful.</li>
            </ul>
            <p>We do not sell your personal information.</p>
          </Section>

          <Section title="Who we share it with">
            <p>
              We share information only with companies that help us run this website, and only
              so they can provide that service to us:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Vercel, which hosts the website;</li>
              <li>Web3Forms, which delivers form submissions to our office by email;</li>
              <li>Anthropic, which powers the chat assistant&rsquo;s replies;</li>
              <li>the analytics and advertising providers named above, only if you accept cookies.</li>
            </ul>
            <p>We may also disclose information when the law requires it.</p>
          </Section>

          <Section title="How long we keep it">
            <p>
              We keep form submissions for as long as needed to respond to you and to meet our
              legal and record-keeping obligations. If you become a patient, the information
              becomes part of your patient record.
            </p>
          </Section>

          <Section title="Your choices and rights">
            <p>
              You can ask us what personal information we hold about you from this website, ask
              us to correct or delete it, or ask us to stop contacting you. Depending on where
              you live (for example, California), you may have additional rights under state
              privacy law. To make a request, contact us using the details below. We will not
              treat you differently for making one.
            </p>
          </Section>

          <Section title="Children">
            <p>
              This website is intended for adults. We do not knowingly collect personal
              information from children under 13 through the website.
            </p>
          </Section>

          <Section title="Changes to this policy">
            <p>
              If we change this policy, we will post the new version on this page and update
              the date at the top.
            </p>
          </Section>

          <Section title="Contact us">
            <p>
              Questions about this policy or your information? Call us at{" "}
              <a href={telHref(SITE_CONFIG.phone)} className="text-navy font-semibold underline">
                {SITE_CONFIG.phone}
              </a>
              , email{" "}
              <a href={`mailto:${SITE_CONFIG.email}`} className="text-navy font-semibold underline">
                {SITE_CONFIG.email}
              </a>{" "}
              or use our{" "}
              <Link href="/contact" className="text-navy font-semibold underline">
                contact form
              </Link>
              .
            </p>
          </Section>
        </div>
      </div>
    </>
  );
}
