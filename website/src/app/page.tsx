"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BentoGrid from "@/components/sections/BentoGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-warm-50 text-warm-800">
      <Navbar />
      <main>
        {/* Hero statement */}
        <section className="pt-32 pb-16 sm:pt-40 sm:pb-20 px-5 sm:px-8 max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-[2.75rem] leading-snug font-medium text-warm-900 tracking-tight">
              Hey, I&apos;m{" "}
              <span className="font-bold">Charles</span>. I&apos;m building
              infrastructure for the decentralized social web. I&apos;m the
              founder of{" "}
              <a
                href="https://periwinkle.social"
                target="_blank"
                rel="noopener noreferrer"
                className="text-periwinkle-600 hover:text-periwinkle-700 underline decoration-periwinkle-300 decoration-2 underline-offset-4 transition-colors"
              >
                Periwinkle
              </a>
              .
            </h1>
          </motion.div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-warm-500 leading-relaxed"
          >
            The major social platforms have become extractive by design. I
            left McKinsey & QuantumBlack to build infrastructure that helps
            change that. It&apos;s early, it&apos;s messy, and it&apos;s the
            most important shift in how the internet works since the move to
            mobile.
          </motion.p>
        </section>

        {/* Bento grid */}
        <BentoGrid />
      </main>
      <Footer />
    </div>
  );
}
