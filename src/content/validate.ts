import "server-only";

// Build-time check of the editable content in content/*.json. Called only from the public
// site's layout (src/app/(site)/layout.tsx), so every page prerender in `next build` fails on
// invalid content and Vercel keeps serving the last good version. It is deliberately not
// called anywhere the website editor (/keystatic) loads, such as the root not-found, so bad
// content never locks the editor that is needed to fix it.
// The website editor checks most of this before Save; this repeats those checks (in case a
// file was edited by hand) and adds the rules that compare fields with each other.
//
// Server-only: zod, node:crypto and the blocked-word hashes never reach the browser.

import { createHash } from "node:crypto";
import practiceFile from "@content/practice.json";
import pricingFile from "@content/pricing.json";
import servicesFile from "@content/services.json";
import faqFile from "@content/faq.json";
import testimonialsFile from "@content/testimonials.json";
import { BLOCKED_WORD_SHA256 } from "./blocked";
import { formatMoney, formatTime } from "./format";
import { NO_NAME, NO_NAME_MESSAGE, SERVICE_IDS } from "./rules";
import {
  contentSchemas,
  type FaqContent,
  type Practice,
  type Pricing,
  type ServicesContent,
  type TestimonialsContent,
} from "./schema";

type FileName = keyof typeof contentSchemas;
type PathPart = string | number;
type Issue = { file: FileName; path: PathPart[]; message: string };

const FILES: Record<FileName, { label: string; data: unknown }> = {
  practice: { label: "Practice info", data: practiceFile },
  pricing: { label: "Prices & offer", data: pricingFile },
  services: { label: "Services", data: servicesFile },
  faq: { label: "FAQ", data: faqFile },
  testimonials: { label: "Patient reviews", data: testimonialsFile },
};

const BLOCKED = new Set(BLOCKED_WORD_SHA256);
// The list holds the doctor's surname (and any word added to src/content/blocked-hashes.json later).
const BLOCKED_MESSAGE =
  "Contains the doctor's last name (a word that must never appear on the website). Use 'our doctor' or 'our team'.";

function sha256(text: string): string {
  return createHash("sha256").update(text).digest("hex");
}

/**
 * True if any run of letters in the text, or any part of one, is a blocked word. Parts are
 * checked too, so the word can't hide inside a longer one (for example in a link).
 */
function containsBlockedWord(text: string): boolean {
  for (const run of text.toLowerCase().match(/[a-z]+/g) ?? []) {
    for (let start = 0; start < run.length; start++) {
      for (let end = start + 2; end <= run.length; end++) {
        if (BLOCKED.has(sha256(run.slice(start, end)))) return true;
      }
    }
  }
  return false;
}

/** Calls visit() for every string in a JSON value, with its path. */
function eachString(value: unknown, path: PathPart[], visit: (text: string, path: PathPart[]) => void) {
  if (typeof value === "string") visit(value, path);
  else if (Array.isArray(value)) value.forEach((item, i) => eachString(item, [...path, i], visit));
  else if (value && typeof value === "object") {
    for (const [key, item] of Object.entries(value)) eachString(item, [...path, key], visit);
  }
}

// The website editor's labels for the keys in each file (keystatic.config.ts), so a message
// names the field the way she sees it. Keep them in step when a label changes there.
const FIELD_LABELS: Record<FileName, Record<string, string>> = {
  practice: {
    phone: "Phone number",
    email: "Email address",
    address: "Street address",
    city: "City",
    state: "State",
    zip: "ZIP code",
    hours: "Opening hours",
    weekdays: "Monday to Friday",
    saturday: "Saturday",
    sunday: "Sunday",
    closed: "Closed all day",
    opens: "Opens at",
    closes: "Closes at",
    social: "Social media links",
    instagram: "Instagram",
    facebook: "Facebook",
    youtube: "YouTube",
    googleReviewUrl: "Google review link",
    topBarTagline: "Top bar tagline",
    footerBlurb: "Footer text",
  },
  pricing: {
    fullArchPerArch: "Full arch price (per arch)",
    singleImplant: "Single implant price",
    boneGraftMin: "Bone graft price: from",
    boneGraftMax: "Bone graft price: up to",
    offer: "Limited-time offer (homepage)",
    enabled: "Show the offer on the homepage",
    eyebrow: "Small heading",
    headline: "Headline",
    unitLabel: "Price label",
    body: "Description",
    ctaLabel: "Button text",
    endsOn: "Last day of the offer",
  },
  services: {
    items: "Services",
    id: "Fixed service id (hidden)",
    title: "Name",
    description: "Short summary",
    tagline: "Services page subheading",
    body: "Services page paragraphs",
    benefits: "Benefits",
    needsClinicalReview: "Text still needs clinical review",
  },
  faq: {
    items: "Questions",
    question: "Question",
    answer: "Answer",
  },
  testimonials: {
    items: "Reviews",
    displayName: "Patient name",
    quote: "Review",
    shortQuote: "Short version",
    treatmentLabel: "Treatment",
    shortTreatmentLabel: "Short treatment label",
    service: "Service",
    rating: "Star rating",
    source: "Where the review came from",
    date: "Date of the review",
    permissionOnFile: "Patient's written permission is on file",
    isSample: "This is a sample review (not a real patient)",
    showOnHome: "Show on the homepage",
    showOnConsultation: "Show on the consultation page",
  },
};

// What one entry of each list is called (the editor counts them from 1).
const LIST_ITEM_LABELS: Record<FileName, Record<string, string>> = {
  practice: {},
  pricing: {},
  services: { items: "Service", body: "Paragraph", benefits: "Benefit" },
  faq: { items: "Question" },
  testimonials: { items: "Review" },
};

/** ["items", 2, "answer"] in faq -> "Question 3 › Answer". */
function formatPath(file: FileName, path: PathPart[]): string {
  const parts: string[] = [];
  let lastKey: string | undefined;
  for (const part of path) {
    if (typeof part === "number") {
      parts.pop();
      const item = (lastKey && LIST_ITEM_LABELS[file][lastKey]) || "Item";
      parts.push(`${item} ${part + 1}`);
    } else {
      parts.push(FIELD_LABELS[file][part] ?? part);
      lastKey = part;
    }
  }
  return parts.join(" › ") || "(whole file)";
}

type Report = (file: FileName, path: PathPart[], message: string) => void;

/**
 * Rules that compare fields with each other; they only run on files that passed the schema.
 * report() fails the build; warn() only prints a warning in the build log.
 */
function crossChecks(
  data: {
    practice: Practice;
    pricing: Pricing;
    services: ServicesContent;
    faq: FaqContent;
    testimonials: TestimonialsContent;
  },
  report: Report,
  warn: Report
) {
  // Services: the five fixed services, each exactly once, Free Consultation last.
  const ids = data.services.items.map((item) => item.id);
  const missing = SERVICE_IDS.filter((id) => !ids.includes(id));
  const repeated = SERVICE_IDS.filter((id) => ids.filter((x) => x === id).length > 1);
  if (missing.length > 0) {
    report("services", ["items"], `These services are missing: ${missing.join(", ")}. All five must stay in the list.`);
  }
  if (repeated.length > 0) {
    report("services", ["items"], `These services appear more than once: ${repeated.join(", ")}.`);
  }
  if (ids.length > 0 && ids[ids.length - 1] !== "consultation") {
    report("services", ["items"], "Free Consultation must be the last service in the list. Drag it back to the end.");
  }

  // Reviews: a real review needs the patient's permission on file. Not a build failure: such a
  // review is simply left off the website (src/content/testimonials.ts) until the box is ticked.
  data.testimonials.items.forEach((item, i) => {
    if (!item.isSample && !item.permissionOnFile) {
      warn(
        "testimonials",
        ["items", i, "permissionOnFile"],
        `The review by ${item.displayName} is marked as real (not a sample) but "Patient's written permission is on file" isn't ticked, so the website doesn't show it.`
      );
    }
  });

  // Prices: the bone graft range must not be upside down.
  const { boneGraftMin, boneGraftMax } = data.pricing;
  if (boneGraftMin != null && boneGraftMax != null && boneGraftMin > boneGraftMax) {
    report("pricing", ["boneGraftMax"], `The bone graft "up to" price (${formatMoney(boneGraftMax)}) is lower than the "from" price (${formatMoney(boneGraftMin)}).`);
  }

  // Hours: on open days, the closing time must be after the opening time.
  for (const [day, hours] of Object.entries(data.practice.hours)) {
    if (!hours.closed && hours.closes <= hours.opens) {
      report(
        "practice",
        ["hours", day, "closes"],
        `The closing time must be later than the opening time (opens ${formatTime(hours.opens)}, closes ${formatTime(hours.closes)}).`
      );
    }
  }
}

type Findings = { issues: Issue[]; warnings: Issue[] };

/** Collects issues without repeats. */
function collector(): { list: Issue[]; add: Report } {
  const list: Issue[] = [];
  const seen = new Set<string>();
  const add: Report = (file, path, message) => {
    const key = `${file}|${path.join(".")}|${message}`;
    if (seen.has(key)) return;
    seen.add(key);
    list.push({ file, path, message });
  };
  return { list, add };
}

/**
 * Every problem in the content files, in plain English: issues fail the build, warnings
 * don't. Both are empty when everything is fine.
 */
export function findContentIssues(): Findings {
  const { list: issues, add: report } = collector();
  const { list: warnings, add: warn } = collector();

  const parsed: Partial<Record<FileName, unknown>> = {};
  for (const name of Object.keys(FILES) as FileName[]) {
    const { data } = FILES[name];

    // 1. Shape, formats, lengths and the name rule on site text (src/content/schema.ts).
    const result = contentSchemas[name].safeParse(data, { reportInput: true });
    if (result.success) parsed[name] = result.data;
    else {
      for (const issue of result.error.issues) {
        // zod's own wording for a missing value is "Invalid input: expected string, received undefined".
        const missing = issue.code === "invalid_type" && issue.input === undefined;
        report(name, issue.path as PathPart[], missing ? "This field is missing. Fill it in." : issue.message);
      }
    }

    // 2. The name rule and the blocked words on every value, including links and codes.
    eachString(data, [], (text, path) => {
      if (!NO_NAME.test(text)) report(name, path, NO_NAME_MESSAGE);
      if (containsBlockedWord(text)) report(name, path, BLOCKED_MESSAGE);
    });
  }

  // 3. Rules across fields, once every file has the right shape.
  if (Object.keys(parsed).length === Object.keys(FILES).length) {
    crossChecks(parsed as Parameters<typeof crossChecks>[0], report, warn);
  }
  return { issues, warnings };
}

/** "  - FAQ (content/faq.json) › Question 3 › Answer: …" */
function describe(issue: Issue): string {
  return `  - ${FILES[issue.file].label} (content/${issue.file}.json) › ${formatPath(issue.file, issue.path)}: ${issue.message}`;
}

let validated = false;

/**
 * Throws a readable, field-by-field error if any content file is invalid. Warnings (content
 * that is valid but left off the website) are printed to the build log.
 */
export function validateContent(): void {
  if (validated) return;
  const { issues, warnings } = findContentIssues();
  if (warnings.length > 0) {
    console.warn(["Website content warnings (the site still builds):", ...warnings.map(describe)].join("\n"));
  }
  if (issues.length > 0) {
    const lines = issues.map(describe);
    throw new Error(
      [
        `Website content check failed: ${issues.length} problem${issues.length === 1 ? "" : "s"} in content/*.json.`,
        "The site was not built. Fix these in the website editor (/keystatic) or in the files, then save again:",
        ...lines,
      ].join("\n")
    );
  }
  validated = true;
}
