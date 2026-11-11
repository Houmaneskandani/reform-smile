"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, ArrowLeft, Sparkles, Calendar } from "lucide-react";
import { trackEvent } from "@/lib/tracking";
import { SERVICES, type ServiceId } from "@/lib/constants";

type Answer = {
  label: string;
  value: string;
};

type Question = {
  id: string;
  question: string;
  subtitle: string;
  answers: Answer[];
};

const questions: Question[] = [
  {
    id: "situation",
    question: "What best describes your situation?",
    subtitle: "This helps us understand your needs",
    answers: [
      { label: "I'm missing one or a few teeth", value: "few" },
      { label: "I'm missing most or all of my teeth", value: "most" },
      { label: "I have teeth but they're damaged or failing", value: "damaged" },
      { label: "I currently wear dentures", value: "dentures" },
      { label: "I want to improve the look of my teeth", value: "cosmetic" },
    ],
  },
  {
    id: "duration",
    question: "How long have you been dealing with this?",
    subtitle: "There's no wrong answer",
    answers: [
      { label: "It just happened recently", value: "recent" },
      { label: "A few months", value: "months" },
      { label: "1-3 years", value: "years" },
      { label: "More than 3 years", value: "long" },
    ],
  },
  {
    id: "concerns",
    question: "What concerns you the most?",
    subtitle: "Select what matters most to you",
    answers: [
      { label: "I can't eat the foods I love", value: "eating" },
      { label: "I'm embarrassed to smile", value: "confidence" },
      { label: "I'm worried about the cost", value: "cost" },
      { label: "I'm nervous about the procedure", value: "anxiety" },
      { label: "I want the fastest solution", value: "speed" },
    ],
  },
  {
    id: "timeline",
    question: "What's your ideal timeline?",
    subtitle: "When would you like to get started?",
    answers: [
      { label: "As soon as possible", value: "asap" },
      { label: "Within the next month", value: "month" },
      { label: "Within 3 months", value: "3months" },
      { label: "I'm just researching for now", value: "research" },
    ],
  },
  {
    id: "tried",
    question: "Have you explored any options before?",
    subtitle: "This helps us tailor our recommendation",
    answers: [
      { label: "No, this is my first time looking into it", value: "first" },
      { label: "I've consulted other dentists", value: "consulted" },
      { label: "I've tried dentures or bridges", value: "tried" },
      { label: "I was told I'm not a candidate", value: "rejected" },
    ],
  },
];

// Every recommendation points at a real service in SERVICES (constants.ts), so the quiz
// can never suggest a treatment the practice doesn't offer.
const SERVICE_TITLES = Object.fromEntries(
  SERVICES.map((s) => [s.id, s.title])
) as Record<ServiceId, string>;

type Result = {
  serviceId: ServiceId;
  title: string;
  label: string;
  description: string;
  procedure: string;
  benefits: string[];
  alternative?: string;
};

function recommend(serviceId: ServiceId, details: Omit<Result, "serviceId" | "title" | "label">): Result {
  return {
    serviceId,
    title: SERVICE_TITLES[serviceId],
    label: serviceId === "consultation" ? "Your Recommended Next Step" : "Your Recommended Treatment",
    ...details,
  };
}

function getResult(answers: Record<string, string>): Result {
  const situation = answers.situation;

  if (situation === "most" || situation === "dentures") {
    // Cost is the top concern: a removable, implant-supported denture is often the best first step.
    if (answers.concerns === "cost") {
      return recommend("snap-on-dentures", {
        procedure: "Implant-Supported Dentures",
        description:
          "Based on your answers, snap-on dentures could be a great fit for you. Dental implants anchor a custom denture that snaps securely into place for more stability than a traditional denture, and it comes out easily for cleaning.",
        benefits: [
          "Snaps securely into place for added stability",
          "Supported by dental implants",
          "More comfortable than traditional dentures",
          "Eat and speak with more confidence",
          "Removable for easy cleaning",
        ],
        alternative:
          "Prefer teeth that never come out? Ask us about Full Arch Dental Implants at your consultation.",
      });
    }

    return recommend("full-arch", {
      procedure: "All-on-X",
      description:
        "Based on your answers, All-on-X full arch dental implants would be the ideal solution for you. This procedure replaces an entire arch of teeth using 4-6 strategically placed implants — giving you a permanent, beautiful smile, often in just one day.",
      benefits: [
        "Permanent teeth that look and feel natural",
        "No more denture adhesives or slipping",
        "Eat all your favorite foods again",
        "Often completed in a single visit",
        "Long-lasting results that can last a lifetime",
      ],
      alternative:
        "Prefer a removable option? Ask us about Snap-On Dentures — implant-supported dentures that snap securely into place.",
    });
  }

  if (situation === "few") {
    return recommend("single-implants", {
      procedure: "Individual Implants",
      description:
        "Based on your answers, individual dental implants would be the best solution. Each missing tooth is replaced with a titanium implant post and a custom crown that looks and feels exactly like your natural tooth.",
      benefits: [
        "Replaces teeth without affecting neighbors",
        "Looks identical to natural teeth",
        "Preserves jawbone structure",
        "Easy to care for — brush and floss normally",
        "Permanent, long-lasting solution",
      ],
    });
  }

  if (situation === "cosmetic") {
    return recommend("veneers", {
      procedure: "Porcelain Veneers",
      description:
        "Based on your answers, porcelain veneers would be an excellent option for you. These ultra-thin shells are custom-crafted to cover the front surface of your teeth, giving you a flawless, natural-looking smile.",
      benefits: [
        "Dramatically transform your smile",
        "Fix chips, stains, gaps, and uneven teeth",
        "Minimal tooth preparation required",
        "Stain-resistant porcelain material",
        "Results that last 15-20 years",
      ],
    });
  }

  // Damaged or failing teeth (or no answer): the right treatment depends on how many teeth
  // are affected and the health of the bone, so the honest next step is an evaluation.
  return recommend("consultation", {
    procedure: "Exam, 3D Imaging & Treatment Plan",
    description:
      "Damaged or failing teeth can be restored in several ways — from a single implant to a full arch of new teeth — depending on how many teeth are affected and the health of the surrounding bone. A free consultation with 3D imaging lets our doctor see exactly what's going on and recommend the right plan for you.",
    benefits: [
      "A comprehensive evaluation with 3D imaging",
      "A clear explanation of every option",
      "A personalized treatment plan",
      "Financing options explained",
      "No cost and no obligation",
    ],
  });
}

export default function SmileQuiz() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);
  const [direction, setDirection] = useState(1);
  // Pending auto-advance; while set, further clicks are ignored so a quick double-click
  // can't skip a question.
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  const handleAnswer = (questionId: string, value: string) => {
    if (advanceTimer.current) return;

    const nextAnswers = { ...answers, [questionId]: value };
    setAnswers(nextAnswers);

    // Auto-advance after short delay
    advanceTimer.current = setTimeout(() => {
      advanceTimer.current = null;
      if (currentStep < questions.length - 1) {
        setDirection(1);
        setCurrentStep((prev) => prev + 1);
      } else {
        setShowResult(true);
        trackEvent("quiz_completed", { result: getResult(nextAnswers).serviceId });
      }
    }, 300);
  };

  const goBack = () => {
    if (advanceTimer.current) return;
    if (currentStep > 0) {
      setDirection(-1);
      setCurrentStep((prev) => prev - 1);
    }
  };

  const reset = () => {
    setStarted(false);
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const result = showResult ? getResult(answers) : null;
  const progress = showResult
    ? 100
    : ((currentStep + (answers[questions[currentStep]?.id] ? 1 : 0)) / questions.length) * 100;

  return (
    <section
      className="py-16 md:py-36 relative overflow-hidden transition-colors duration-700"
      style={{ background: "#1B3A5C" }}
    >
      {/* Background glow — grows with quiz progress */}
      <div className="absolute inset-0 pointer-events-none transition-all duration-700">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full blur-[120px] transition-all duration-700"
          style={{
            width: `${200 + progress * 5}px`,
            height: `${200 + progress * 5}px`,
            backgroundColor: `rgba(196, 162, 101, ${0.03 + (progress / 100) * 0.08})`,
          }}
        />
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] transition-opacity duration-700"
          style={{ backgroundColor: "rgba(196, 162, 101, 0.03)", opacity: started ? 1 : 0.5 }}
        />
      </div>


      <div className="relative section-container">
        <AnimatePresence mode="wait">
          {!started ? (
            /* ── Start screen ── */
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-8">
                <Sparkles size={28} className="text-gold" />
              </div>
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
                Treatment Finder
              </p>
              <h2 className="font-heading text-4xl md:text-5xl text-white mb-6 leading-tight">
                Find Your Perfect{" "}
                <span className="text-gold italic">Smile Solution</span>
              </h2>
              <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                Answer 5 quick questions and we&apos;ll recommend the best
                treatment option for your unique situation.
              </p>
              <button
                onClick={() => { setStarted(true); trackEvent("quiz_started"); }}
                className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-white font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-[1.03] cursor-pointer text-lg"
              >
                Take the Quiz
                <ArrowRight size={20} />
              </button>
              <p className="text-white/20 text-xs mt-6">
                Takes less than 60 seconds
              </p>
            </motion.div>
          ) : showResult && result ? (
            /* ── Result screen ── */
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-2xl mx-auto"
            >
              {/* Progress bar */}
              <div className="w-full h-1 bg-white/10 rounded-full mb-12">
                <div className="h-full bg-gold rounded-full" style={{ width: "100%" }} />
              </div>

              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={28} className="text-gold" />
                </div>
                <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">
                  {result.label}
                </p>
                <h3 className="font-heading text-3xl md:text-4xl text-white mb-2">
                  {result.title}
                </h3>
                <p className="text-gold/60 text-sm">{result.procedure}</p>
              </div>

              <p className="text-white/60 text-[16px] leading-relaxed text-center mb-10">
                {result.description}
              </p>

              <ul className={`space-y-3 ${result.alternative ? "mb-8" : "mb-12"}`}>
                {result.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-white/70 text-[15px]">{b}</span>
                  </li>
                ))}
              </ul>

              {result.alternative && (
                <p className="text-white/40 text-sm text-center mb-12">
                  {result.alternative}
                </p>
              )}

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/consultation"
                  className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-bold px-9 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer text-lg"
                >
                  <Calendar size={20} />
                  Book My Free Consult
                </a>
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white/60 hover:text-white hover:border-white/40 font-semibold px-8 py-4 rounded-full transition-all duration-300 cursor-pointer"
                >
                  Retake Quiz
                </button>
              </div>
            </motion.div>
          ) : (
            /* ── Question screen ── */
            <motion.div
              key="quiz"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl mx-auto"
            >
              {/* Progress bar */}
              <div className="w-full h-1 bg-white/10 rounded-full mb-12">
                <motion.div
                  className="h-full bg-gold rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              {/* Back button + step counter */}
              <div className="flex items-center justify-between mb-10">
                <button
                  onClick={goBack}
                  className={`inline-flex items-center gap-2 text-white/40 hover:text-white transition-colors cursor-pointer text-sm ${
                    currentStep === 0 ? "invisible" : ""
                  }`}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <span className="text-white/20 text-xs tracking-widest">
                  {currentStep + 1} / {questions.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3 className="font-heading text-2xl md:text-3xl text-white mb-2 text-center">
                    {questions[currentStep].question}
                  </h3>
                  <p className="text-white/30 text-sm text-center mb-10">
                    {questions[currentStep].subtitle}
                  </p>

                  {/* Answer options */}
                  <div className="space-y-3">
                    {questions[currentStep].answers.map((answer) => {
                      const isSelected = answers[questions[currentStep].id] === answer.value;
                      return (
                        <button
                          key={answer.value}
                          type="button"
                          aria-pressed={isSelected}
                          onClick={() => handleAnswer(questions[currentStep].id, answer.value)}
                          className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-gold/10 border-gold/40 text-white"
                              : "bg-white/[0.03] border-white/10 text-white/60 hover:bg-white/[0.06] hover:border-white/20 hover:text-white"
                          }`}
                        >
                          <span className="text-[15px]">{answer.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
