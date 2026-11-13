"use client";

import { useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ExternalLink, MessageSquare, Star } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants";
import { telHref } from "@/content/format";
import { submitForm } from "@/lib/submitForm";

// IMPORTANT — do not "improve" this into a filter.
// Every rating, from 1 star to 5, gets the same two choices in the same order and the same
// style: post on Google, or tell us privately. Sending only happy patients to Google and
// keeping unhappy ones on the website is "review gating": Google's review policy forbids it
// (reviews can be removed and the profile penalized) and the FTC treats it as deceptive.
// The rating only changes the one line of text above the buttons, and is included in the
// private message if the patient sends one.

const RATING_WORDS = ["", "Poor", "Fair", "Okay", "Good", "Excellent"];

const feedbackSchema = z.object({
  name: z.string().max(80).optional(),
  contact: z.string().max(120).optional(),
  message: z
    .string()
    .min(10, "Please write at least a few words")
    .max(2000, "Please keep it under 2,000 characters"),
  botcheck: z.string().optional(), // spam honeypot — must stay empty
});
type FeedbackData = z.infer<typeof feedbackSchema>;

const inputClass =
  "w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-dark placeholder:text-gray-light focus:outline-none focus:ring-2 focus:ring-navy/30 focus:border-navy transition";

export default function ReviewFlow({ googleReviewUrl }: { googleReviewUrl: string }) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [showForm, setShowForm] = useState(false);
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FeedbackData>({ resolver: zodResolver(feedbackSchema) });

  const onSubmit = async (data: FeedbackData) => {
    setSubmitError(null);
    const result = await submitForm(
      {
        rating: `${rating} out of 5`,
        name: data.name ?? "",
        contact: data.contact ?? "",
        message: data.message,
        botcheck: data.botcheck ?? "",
      },
      "Private Feedback"
    );
    if (result.success) setSent(true);
    // submitForm's own messages talk about scheduling; this form needs its own wording.
    else setSubmitError(`We couldn't send your message. Please try again, or call us at ${SITE_CONFIG.phone}.`);
  };

  const shown = hovered || rating;

  return (
    <section className="bg-cream py-16 md:py-24 min-h-[70vh]">
      <div className="section-container">
        <div className="mx-auto max-w-xl bg-white rounded-3xl shadow-xl border border-gray-lighter px-6 py-10 md:px-12 md:py-12 text-center">
          <Image
            src="/logo-emblem.png"
            alt=""
            width={512}
            height={451}
            sizes="72px"
            priority
            className="h-16 w-auto mx-auto mb-6"
          />
          <h1 className="font-heading text-3xl md:text-4xl text-navy leading-tight mb-3">
            How was your visit?
          </h1>
          <p className="text-gray mb-8">
            Tap a star to rate your experience with {SITE_CONFIG.name}.
          </p>

          <div
            role="radiogroup"
            aria-label="Your rating"
            className="flex justify-center gap-1 md:gap-2 mb-2"
            onMouseLeave={() => setHovered(0)}
          >
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                role="radio"
                aria-checked={rating === value}
                aria-label={`${value} out of 5 stars: ${RATING_WORDS[value]}`}
                onClick={() => setRating(value)}
                onMouseEnter={() => setHovered(value)}
                onFocus={() => setHovered(value)}
                onBlur={() => setHovered(0)}
                className="p-1.5 rounded-full cursor-pointer transition-transform hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-navy"
              >
                <Star
                  size={44}
                  strokeWidth={1.5}
                  aria-hidden="true"
                  className={value <= shown ? "fill-gold text-gold-dark" : "fill-transparent text-gray-300"}
                />
              </button>
            ))}
          </div>
          <p className="h-6 text-sm font-semibold text-navy mb-6" aria-live="polite">
            {shown ? `${shown} out of 5 — ${RATING_WORDS[shown]}` : ""}
          </p>

          {rating > 0 && (
            <div className="border-t border-gray-lighter pt-8">
              <p className="text-navy text-lg font-semibold mb-2">
                {rating >= 4
                  ? "Thank you! We're so glad to hear it."
                  : "We're sorry your visit wasn't what you hoped for. We'd like to make it right."}
              </p>
              <p className="text-gray text-sm mb-6">
                Your honest feedback helps us and helps other patients, whatever your rating.
              </p>

              <div className="grid gap-3">
                {googleReviewUrl ? (
                  <a
                    href={googleReviewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-navy bg-navy hover:bg-navy-light hover:border-navy-light text-white font-semibold px-7 py-3.5 transition-colors"
                  >
                    Post a review on Google
                    <ExternalLink size={18} aria-hidden="true" />
                  </a>
                ) : (
                  <p className="rounded-xl border border-dashed border-gray-300 px-4 py-3 text-sm text-gray">
                    Development only: the Google review link is not set yet (editor → Practice
                    info → Google review link). The live page stays hidden until it is.
                  </p>
                )}
                <button
                  type="button"
                  onClick={() => setShowForm((open) => !open)}
                  aria-expanded={showForm}
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-navy text-navy hover:bg-navy hover:text-white font-semibold px-7 py-3.5 transition-colors cursor-pointer"
                >
                  <MessageSquare size={18} aria-hidden="true" />
                  Tell us privately
                </button>
              </div>

              {showForm && (
                <div className="mt-8 text-left">
                  {sent ? (
                    <p role="status" className="rounded-xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-800">
                      Thank you. Your message went to our office. If you left a phone number or
                      email, we&apos;ll be in touch.
                    </p>
                  ) : (
                    <form onSubmit={handleSubmit(onSubmit)} noValidate className="grid gap-4">
                      <div>
                        <label htmlFor="feedback-message" className="block text-sm font-semibold text-navy mb-1.5">
                          What happened, and how can we improve?
                        </label>
                        <textarea
                          id="feedback-message"
                          rows={5}
                          {...register("message")}
                          aria-invalid={!!errors.message}
                          aria-describedby="feedback-note"
                          className={inputClass}
                        />
                        {errors.message && (
                          <p role="alert" className="mt-1.5 text-sm text-red-700">{errors.message.message}</p>
                        )}
                        <p id="feedback-note" className="mt-1.5 text-xs text-gray">
                          Please don&apos;t include medical details. For anything urgent, call us at{" "}
                          <a href={telHref(SITE_CONFIG.phone)} className="underline font-semibold text-navy">
                            {SITE_CONFIG.phone}
                          </a>
                          .
                        </p>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label htmlFor="feedback-name" className="block text-sm font-semibold text-navy mb-1.5">
                            Your name <span className="font-normal text-gray">(optional)</span>
                          </label>
                          <input id="feedback-name" type="text" autoComplete="name" {...register("name")} className={inputClass} />
                        </div>
                        <div>
                          <label htmlFor="feedback-contact" className="block text-sm font-semibold text-navy mb-1.5">
                            Phone or email <span className="font-normal text-gray">(optional)</span>
                          </label>
                          <input id="feedback-contact" type="text" {...register("contact")} className={inputClass} />
                        </div>
                      </div>
                      {/* Spam honeypot: hidden from people, so only bots fill it */}
                      <input type="text" tabIndex={-1} autoComplete="off" aria-hidden="true" className="hidden" {...register("botcheck")} />
                      {submitError && (
                        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm text-red-700">
                          {submitError}
                        </p>
                      )}
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex items-center justify-center rounded-full bg-gold hover:bg-gold-dark text-navy-dark font-semibold px-7 py-3.5 transition-colors cursor-pointer disabled:opacity-60"
                      >
                        {isSubmitting ? "Sending…" : "Send privately"}
                      </button>
                      <p className="text-xs text-gray text-center">
                        This goes only to our office, not to Google. See our{" "}
                        <a href="/privacy" className="underline">Privacy Policy</a>.
                      </p>
                    </form>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
