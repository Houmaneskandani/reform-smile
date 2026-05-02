"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Calculator, ArrowRight, ArrowLeft, DollarSign, Calendar } from "lucide-react";

type EstimatorStep = {
  id: string;
  question: string;
  options: { label: string; value: string }[];
};

const steps: EstimatorStep[] = [
  {
    id: "procedure",
    question: "What procedure are you interested in?",
    options: [
      { label: "Full Arch Implants (All-on-4/6)", value: "full-arch" },
      { label: "Single Tooth Implant", value: "single" },
      { label: "Multiple Implants (2-3 teeth)", value: "multiple" },
      { label: "Dental Veneers", value: "veneers" },
      { label: "Not sure — need guidance", value: "unsure" },
    ],
  },
  {
    id: "jaw",
    question: "Which area needs treatment?",
    options: [
      { label: "Upper jaw only", value: "upper" },
      { label: "Lower jaw only", value: "lower" },
      { label: "Both upper and lower", value: "both" },
      { label: "Front teeth only", value: "front" },
    ],
  },
  {
    id: "bone",
    question: "Have you been told about bone loss?",
    options: [
      { label: "No bone loss issues", value: "none" },
      { label: "Some bone loss", value: "some" },
      { label: "Significant bone loss", value: "significant" },
      { label: "I'm not sure", value: "unsure" },
    ],
  },
  {
    id: "timeline",
    question: "When would you like to start?",
    options: [
      { label: "As soon as possible", value: "asap" },
      { label: "Within 1-3 months", value: "soon" },
      { label: "3-6 months", value: "later" },
      { label: "Just exploring options", value: "exploring" },
    ],
  },
];

type CostResult = {
  procedure: string;
  lowRange: string;
  highRange: string;
  monthlyFinancing: string;
  includes: string[];
  note: string;
};

function calculateCost(answers: Record<string, string>): CostResult {
  const procedure = answers.procedure;
  const jaw = answers.jaw;
  const bone = answers.bone;

  const boneAddon = bone === "significant" ? 3000 : bone === "some" ? 1500 : 0;
  const bothMultiplier = jaw === "both" ? 1.8 : 1;

  if (procedure === "full-arch") {
    const low = Math.round((18000 + boneAddon) * bothMultiplier);
    const high = Math.round((30000 + boneAddon) * bothMultiplier);
    return {
      procedure: "Full Arch Dental Implants",
      lowRange: low.toLocaleString(),
      highRange: high.toLocaleString(),
      monthlyFinancing: Math.round(low / 60).toLocaleString(),
      includes: [
        "Comprehensive 3D CT scan",
        "Surgical implant placement (4-6 posts)",
        "Temporary prosthetic (same day)",
        "Final zirconia prosthetic",
        "All follow-up appointments",
        bone !== "none" ? "Bone grafting if needed" : "",
      ].filter(Boolean),
      note: "Exact pricing determined during your free consultation based on your specific needs.",
    };
  }

  if (procedure === "single") {
    const low = 3000 + boneAddon;
    const high = 5500 + boneAddon;
    return {
      procedure: "Single Dental Implant",
      lowRange: low.toLocaleString(),
      highRange: high.toLocaleString(),
      monthlyFinancing: Math.round(low / 24).toLocaleString(),
      includes: [
        "3D imaging and treatment planning",
        "Titanium implant post",
        "Custom abutment",
        "Porcelain crown",
        "Follow-up care",
      ],
      note: "Per implant pricing. Multiple implants may qualify for package pricing.",
    };
  }

  if (procedure === "multiple") {
    const count = jaw === "both" ? 4 : jaw === "front" ? 3 : 2;
    const low = (2800 + boneAddon) * count;
    const high = (5000 + boneAddon) * count;
    return {
      procedure: `Multiple Implants (estimated ${count} teeth)`,
      lowRange: low.toLocaleString(),
      highRange: high.toLocaleString(),
      monthlyFinancing: Math.round(low / 36).toLocaleString(),
      includes: [
        "3D imaging and planning",
        `${count} titanium implant posts`,
        "Custom abutments",
        "Porcelain crowns",
        "Package pricing applied",
      ],
      note: "Package pricing available for multiple implants. Exact count determined during consultation.",
    };
  }

  if (procedure === "veneers") {
    const count = jaw === "front" ? 6 : jaw === "both" ? 16 : 8;
    const low = 1000 * count;
    const high = 2500 * count;
    return {
      procedure: `Porcelain Veneers (estimated ${count} teeth)`,
      lowRange: low.toLocaleString(),
      highRange: high.toLocaleString(),
      monthlyFinancing: Math.round(low / 24).toLocaleString(),
      includes: [
        "Smile design consultation",
        `${count} custom porcelain veneers`,
        "Tooth preparation",
        "Temporary veneers",
        "Final bonding and adjustment",
      ],
      note: "Number of veneers depends on your smile goals. Many patients do 6-8 for a natural look.",
    };
  }

  // Unsure
  return {
    procedure: "Personalized Treatment Plan",
    lowRange: "3,000",
    highRange: "30,000+",
    monthlyFinancing: "125",
    includes: [
      "Free comprehensive exam",
      "3D CT scan imaging",
      "Personalized treatment options",
      "Full cost breakdown",
      "Financing plan options",
    ],
    note: "The best way to get an accurate estimate is through a free consultation. Dr. Pournejad will examine your situation and present all options with clear pricing.",
  };
}

export default function CostEstimator() {
  const [started, setStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
    setTimeout(() => {
      if (currentStep < steps.length - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setShowResult(true);
      }
    }, 250);
  };

  const reset = () => {
    setStarted(false);
    setCurrentStep(0);
    setAnswers({});
    setShowResult(false);
  };

  const result = showResult ? calculateCost(answers) : null;
  const progress = showResult ? 100 : (currentStep / steps.length) * 100;

  return (
    <section className="py-16 md:py-36 bg-cream">
      <div className="section-container">
        <AnimatePresence mode="wait">
          {!started ? (
            <motion.div
              key="start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl mx-auto text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-8">
                <Calculator size={28} className="text-gold" />
              </div>
              <p className="text-gold font-semibold tracking-widest uppercase text-sm mb-4">
                Cost Estimator
              </p>
              <h2 className="font-heading text-4xl md:text-5xl text-navy mb-6 leading-tight">
                Get Your Personalized{" "}
                <span className="text-gold italic">Cost Estimate</span>
              </h2>
              <p className="text-gray text-lg leading-relaxed mb-10 max-w-lg mx-auto">
                Answer 4 quick questions and get an instant cost range for your
                treatment. No commitment, no contact info required.
              </p>
              <button
                onClick={() => setStarted(true)}
                className="inline-flex items-center gap-3 bg-navy hover:bg-navy-light text-white font-bold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer text-lg"
              >
                <DollarSign size={20} />
                Get My Estimate
              </button>
              <p className="text-gray-light text-xs mt-6">
                Takes less than 30 seconds • No contact info needed
              </p>
            </motion.div>
          ) : showResult && result ? (
            <motion.div
              key="result"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-2xl mx-auto"
            >
              {/* Result header */}
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-full bg-gold/10 flex items-center justify-center mx-auto mb-6">
                  <DollarSign size={28} className="text-gold" />
                </div>
                <p className="text-gold text-sm font-semibold tracking-widest uppercase mb-3">
                  Your Estimated Cost
                </p>
                <h3 className="font-heading text-2xl md:text-3xl text-navy mb-2">
                  {result.procedure}
                </h3>
              </div>

              {/* Cost range card */}
              <div className="bg-white rounded-2xl p-8 md:p-10 shadow-md border border-cream-dark mb-8">
                <div className="text-center mb-8">
                  <p className="text-gray text-sm mb-2">Estimated range</p>
                  <p className="font-heading text-4xl md:text-5xl text-navy">
                    ${result.lowRange}
                    <span className="text-gray mx-3 text-2xl">—</span>
                    ${result.highRange}
                  </p>
                  <p className="text-gold text-sm mt-3 font-semibold">
                    Financing from ${result.monthlyFinancing}/month
                  </p>
                </div>

                <div className="border-t border-cream-dark pt-6">
                  <p className="text-navy font-semibold text-sm mb-4">What&apos;s typically included:</p>
                  <ul className="space-y-2">
                    {result.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <svg className="w-4 h-4 text-gold flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray text-sm">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <p className="text-gray-light text-xs mt-6 italic">
                  {result.note}
                </p>
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/consultation"
                  className="inline-flex items-center justify-center gap-2 bg-gold hover:bg-gold-dark text-white font-bold px-9 py-4 rounded-full transition-all duration-300 shadow-lg cursor-pointer text-lg"
                >
                  <Calendar size={20} />
                  Get Exact Pricing — Free Consult
                </a>
                <button
                  onClick={reset}
                  className="inline-flex items-center justify-center gap-2 border-2 border-navy/20 text-navy/60 hover:text-navy hover:border-navy/40 font-semibold px-8 py-4 rounded-full transition-all duration-300 cursor-pointer"
                >
                  Try Different Options
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="questions"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-2xl mx-auto"
            >
              {/* Progress */}
              <div className="w-full h-1 bg-cream-dark rounded-full mb-10">
                <motion.div
                  className="h-full bg-gold rounded-full"
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => currentStep > 0 && setCurrentStep((p) => p - 1)}
                  className={`inline-flex items-center gap-2 text-navy/40 hover:text-navy transition-colors cursor-pointer text-sm ${
                    currentStep === 0 ? "invisible" : ""
                  }`}
                >
                  <ArrowLeft size={16} />
                  Back
                </button>
                <span className="text-gray-light text-xs tracking-widest">
                  {currentStep + 1} / {steps.length}
                </span>
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.25 }}
                >
                  <h3 className="font-heading text-2xl md:text-3xl text-navy mb-8 text-center">
                    {steps[currentStep].question}
                  </h3>

                  <div className="space-y-3">
                    {steps[currentStep].options.map((option) => {
                      const isSelected = answers[steps[currentStep].id] === option.value;
                      return (
                        <button
                          key={option.value}
                          onClick={() => handleAnswer(steps[currentStep].id, option.value)}
                          className={`w-full text-left px-6 py-4 rounded-xl border transition-all duration-200 cursor-pointer ${
                            isSelected
                              ? "bg-navy/5 border-gold/40 text-navy"
                              : "bg-white border-cream-dark text-gray hover:bg-white hover:border-gold/20 hover:text-navy"
                          }`}
                        >
                          <span className="text-[15px]">{option.label}</span>
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
