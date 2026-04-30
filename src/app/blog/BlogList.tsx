"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Calendar } from "lucide-react";

const posts = [
  {
    slug: "what-are-all-on-4-dental-implants",
    title: "What Are All-on-4 Dental Implants? Everything You Need to Know",
    excerpt: "All-on-4 dental implants are a revolutionary solution for patients with missing teeth. Learn how four strategically placed implants can give you a complete, permanent smile in just one day.",
    category: "Patient Education",
    date: "Coming Soon",
  },
  {
    slug: "am-i-a-candidate-for-dental-implants",
    title: "Am I a Candidate for Dental Implants?",
    excerpt: "Not sure if dental implants are right for you? Dr. Pournejad explains the factors that determine candidacy and why more people qualify than they think.",
    category: "FAQ",
    date: "Coming Soon",
  },
  {
    slug: "all-on-4-vs-all-on-6",
    title: "All-on-4 vs. All-on-6: Which Is Right for You?",
    excerpt: "Both All-on-4 and All-on-6 offer incredible results, but they serve different needs. Here's how to understand which option is best for your situation.",
    category: "Patient Education",
    date: "Coming Soon",
  },
  {
    slug: "dental-implants-vs-dentures",
    title: "Dental Implants vs. Dentures: Why Implants Win",
    excerpt: "Traditional dentures have limitations. Discover why more patients are choosing permanent dental implants over removable dentures.",
    category: "Comparison",
    date: "Coming Soon",
  },
  {
    slug: "what-to-expect-teeth-in-a-day",
    title: "What to Expect with Teeth-in-a-Day",
    excerpt: "Curious about the Teeth-in-a-Day procedure? Walk through the entire process from consultation to walking out with your new smile.",
    category: "Procedures",
    date: "Coming Soon",
  },
  {
    slug: "caring-for-dental-implants",
    title: "How to Care for Your Dental Implants",
    excerpt: "Dental implants are built to last, but proper care ensures they stay beautiful for a lifetime. Learn the best practices for maintaining your new smile.",
    category: "Aftercare",
    date: "Coming Soon",
  },
];

export default function BlogList() {
  return (
    <section className="py-28 md:py-36 bg-white">
      <div className="section-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => (
            <motion.article
              key={post.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group rounded-2xl overflow-hidden border border-gray-lighter hover:shadow-xl transition-all duration-300"
            >
              {/* Thumbnail placeholder */}
              <div className="aspect-[16/10] bg-cream relative overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-navy/20 text-sm">Article Image</span>
                </div>
                <span className="absolute top-4 left-4 bg-gold text-white text-[11px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
              </div>

              {/* Content */}
              <div className="p-7">
                <div className="flex items-center gap-2 text-gray-light text-xs mb-4">
                  <Calendar size={12} />
                  <span>{post.date}</span>
                </div>
                <h2 className="font-heading text-xl text-navy mb-3 leading-snug group-hover:text-gold transition-colors">
                  {post.title}
                </h2>
                <p className="text-gray text-sm leading-relaxed mb-5">
                  {post.excerpt}
                </p>
                <span className="inline-flex items-center gap-1.5 text-gold text-sm font-semibold group-hover:gap-3 transition-all">
                  Read More <ArrowRight size={14} />
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        <p className="text-center text-gray-light text-xs mt-16 italic">
          * Blog articles are coming soon. Content will be published regularly for SEO and patient education.
        </p>
      </div>
    </section>
  );
}
