"use client";
import { experiences } from "@/data/content";
import FadeInView from "@/components/ui/FadeInView";

export default function Experience() {
  return (
    <section id="experience" className="py-24 bg-warm-50">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <FadeInView>
          <h2 className="text-2xl font-bold text-warm-900 tracking-tight">
            Experience
          </h2>
        </FadeInView>

        <div className="mt-12 relative">
          {/* Timeline line */}
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-warm-200 hidden md:block" />

          <div className="space-y-6">
            {experiences.map((exp, index) => {
              const isCompact = !exp.current && exp.description.length === 0;

              return (
                <FadeInView key={index} delay={index * 0.08}>
                  <div className="flex gap-6">
                    {/* Timeline dot */}
                    <div className="hidden md:flex flex-col items-center pt-2.5">
                      <div
                        className={`w-[9px] h-[9px] rounded-full flex-shrink-0 ${
                          exp.current
                            ? "bg-periwinkle-500 ring-4 ring-periwinkle-100"
                            : "bg-warm-300"
                        }`}
                      />
                    </div>

                    {/* Card */}
                    <div
                      className={`flex-1 rounded-2xl border transition-colors ${
                        exp.current
                          ? "bg-white border-periwinkle-200/60 shadow-sm"
                          : "bg-white border-warm-200/60"
                      } ${isCompact ? "px-5 py-3.5" : "p-5 sm:p-6"}`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                        <div>
                          <h3
                            className={`font-semibold text-warm-900 ${
                              isCompact ? "text-base" : "text-lg"
                            }`}
                          >
                            {exp.title}
                          </h3>
                          <p
                            className={`${
                              exp.current
                                ? "text-periwinkle-600"
                                : "text-warm-500"
                            } ${isCompact ? "text-sm" : "text-sm"}`}
                          >
                            {exp.company}
                          </p>
                        </div>
                        <p className="text-xs text-warm-400 whitespace-nowrap">
                          {exp.period}
                        </p>
                      </div>

                      {exp.description.length > 0 && (
                        <ul className="mt-3 space-y-1.5">
                          {exp.description.map((item, i) => (
                            <li
                              key={i}
                              className="text-sm text-warm-600 leading-relaxed flex gap-2"
                            >
                              <span className="text-warm-300 mt-1.5 flex-shrink-0">
                                &bull;
                              </span>
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  </div>
                </FadeInView>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
