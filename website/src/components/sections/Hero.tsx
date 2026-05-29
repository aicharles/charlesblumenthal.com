"use client";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const roles = ["Founder at Periwinkle", "Data Engineer", "Builder"];
const TYPING_SPEED = 70;
const DELETING_SPEED = 40;
const PAUSE_AFTER_TYPE = 2400;
const PAUSE_AFTER_DELETE = 400;

export default function Hero() {
  const [text, setText] = useState("");
  const state = useRef({ roleIndex: 0, isDeleting: false });

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const tick = () => {
      const { roleIndex, isDeleting } = state.current;
      const currentRole = roles[roleIndex];

      let delay: number;

      if (!isDeleting) {
        const nextText = currentRole.slice(0, text.length + 1);
        setText(nextText);

        if (nextText.length === currentRole.length) {
          state.current.isDeleting = true;
          delay = PAUSE_AFTER_TYPE;
        } else {
          delay = TYPING_SPEED;
        }
      } else {
        const nextText = currentRole.slice(0, text.length - 1);
        setText(nextText);

        if (nextText.length === 0) {
          state.current.isDeleting = false;
          state.current.roleIndex = (roleIndex + 1) % roles.length;
          delay = PAUSE_AFTER_DELETE;
        } else {
          delay = DELETING_SPEED;
        }
      }

      timeout = setTimeout(tick, delay);
    };

    timeout = setTimeout(tick, TYPING_SPEED);
    return () => clearTimeout(timeout);
  }, [text]);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Soft decorative blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-periwinkle-200/20 blur-3xl" />
        <div className="absolute -bottom-48 -left-24 w-[500px] h-[500px] rounded-full bg-periwinkle-100/30 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-72 h-72 rounded-full bg-warm-200/40 blur-3xl" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Headshot placeholder */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] as const }}
          className="mx-auto mb-8 w-28 h-28 rounded-full bg-linear-to-br from-periwinkle-200 to-periwinkle-100 ring-4 ring-white shadow-lg flex items-center justify-center overflow-hidden"
        >
          {/* Replace this div with <img src="/headshot.jpg" alt="Charles Blumenthal" className="w-full h-full object-cover" /> when photo is ready */}
          <span
            className="text-2xl font-semibold text-periwinkle-600"
            style={{
              fontFamily: "var(--font-cabinet), system-ui, monospace",
            }}
          >
            CB
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-warm-900"
        >
          Hi, I&apos;m Charles
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-5 h-10 flex items-center justify-center"
        >
          <span className="text-xl sm:text-2xl font-medium text-periwinkle-600">
            {text}
          </span>
          <span className="text-xl sm:text-2xl font-medium text-periwinkle-400 animate-blink ml-0.5">
            |
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="mt-6 text-lg text-warm-600 max-w-xl mx-auto text-balance leading-relaxed"
        >
          I build tools for the decentralized social web. Currently working on{" "}
          <a
            href="https://periwinkle.social"
            target="_blank"
            rel="noopener noreferrer"
            className="text-periwinkle-600 hover:text-periwinkle-700 underline decoration-periwinkle-300 underline-offset-2 transition-colors"
          >
            Periwinkle
          </a>{" "}
          - managed hosting for AT Protocol personal data servers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 flex gap-3 justify-center"
        >
          <a
            href="#about"
            className="rounded-full px-6 py-2.5 text-sm font-medium bg-periwinkle-600 text-white hover:bg-periwinkle-700 transition-colors shadow-xs"
          >
            Learn More
          </a>
          <a
            href="#contact"
            className="rounded-full px-6 py-2.5 text-sm font-medium border border-warm-300 text-warm-700 hover:bg-warm-100 transition-colors"
          >
            Get in Touch
          </a>
        </motion.div>
      </div>
    </section>
  );
}
