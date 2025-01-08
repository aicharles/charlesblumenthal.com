"use client";
import { useEffect, useState } from "react";

export default function Hero() {
  const [text, setText] = useState("");
  const fullText = "Software Engineer";
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < fullText.length) {
      const timeout = setTimeout(() => {
        setText((prev) => prev + fullText[index]);
        setIndex((prev) => prev + 1);
      }, 100);

      return () => clearTimeout(timeout);
    }
  }, [index]);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-10 animate-gradient"></div>
      <div className="relative z-10 text-center px-8">
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="text-slate-900">Hi, I'm </span>
          <span className="bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text">
            Charles
          </span>
        </h1>
        <h2 className="mt-6 text-3xl md:text-4xl font-medium text-slate-700 h-[40px]">
          {text}
          <span className="animate-blink">|</span>
        </h2>
        <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto">
          I specialize in cloud architecture and full-stack development, building
          scalable solutions using modern technologies.
        </p>
        <div className="mt-10 flex gap-4 justify-center">
          <a
            href="#contact"
            className="rounded-lg px-6 py-3 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Get in Touch
          </a>
          <a
            href="#projects"
            className="rounded-lg px-6 py-3 text-sm font-medium border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
          >
            View Projects
          </a>
        </div>
      </div>
    </section>
  );
} 