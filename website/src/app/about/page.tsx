"use client";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { experiences, certifications, education } from "@/data/content";
import FadeInView, {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInView";

export default function About() {
  return (
    <div className="min-h-screen bg-warm-50 text-warm-800">
      <Navbar />
      <main className="pt-32 pb-24 px-5 sm:px-8 max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl sm:text-4xl font-bold text-warm-900 tracking-tight">
            About
          </h1>
          <div className="mt-6 space-y-4 text-base sm:text-lg text-warm-600 leading-relaxed max-w-3xl">
            <p>
              The major social platforms have become extractive by design -
              optimizing for engagement at the expense of users, discourse,
              and democracy. I left McKinsey & QuantumBlack to build
              infrastructure that helps change that.
            </p>
            <p>
              I&apos;m focused on the decentralized social web - the emerging
              ecosystem of open protocols that give users and organizations
              real ownership over their online presence. It&apos;s early,
              it&apos;s messy, and it&apos;s the most important shift in how
              the internet works since the move to mobile.
            </p>
            <p>
              My background is in enterprise-scale cloud infrastructure, data
              engineering, and AI - the kind of systems thinking that this
              space needs as it matures from idealism into production.
            </p>
          </div>
        </motion.div>

        {/* Experience */}
        <div className="mt-20">
          <FadeInView>
            <h2 className="text-2xl font-bold text-warm-900 tracking-tight">
              Experience
            </h2>
          </FadeInView>

          <div className="mt-10 relative">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-warm-200 hidden md:block" />

            <div className="space-y-5">
              {experiences.map((exp, index) => {
                const isCompact = !exp.current && exp.description.length === 0;

                return (
                  <FadeInView key={index} delay={index * 0.04}>
                    <div className="flex gap-6">
                      <div className="hidden md:flex flex-col items-center pt-2.5">
                        <div
                          className={`w-[9px] h-[9px] rounded-full shrink-0 ${
                            exp.current
                              ? "bg-periwinkle-500 ring-4 ring-periwinkle-100"
                              : "bg-warm-300"
                          }`}
                        />
                      </div>

                      <div
                        className={`flex-1 rounded-2xl border transition-colors ${
                          exp.current
                            ? "bg-white border-periwinkle-200/60 shadow-xs"
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
                              className={`text-sm ${
                                exp.current
                                  ? "text-periwinkle-600"
                                  : "text-warm-500"
                              }`}
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
                            {exp.description.map((desc, i) => (
                              <li
                                key={i}
                                className="text-sm text-warm-600 leading-relaxed flex gap-2"
                              >
                                <span className="text-warm-300 mt-1.5 shrink-0">
                                  &bull;
                                </span>
                                <span>{desc}</span>
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

        {/* Education */}
        <div className="mt-20">
          <FadeInView>
            <h2 className="text-2xl font-bold text-warm-900 tracking-tight">
              Education
            </h2>
          </FadeInView>
          <StaggerContainer className="mt-10 space-y-4">
            {education.map((edu, index) => (
              <StaggerItem key={index}>
                <div className="bg-white p-5 sm:p-6 rounded-2xl border border-warm-200/60">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                    <div>
                      <h3 className="text-lg font-semibold text-warm-900">
                        {edu.degree}
                      </h3>
                      {edu.field && (
                        <p className="text-sm text-warm-500">{edu.field}</p>
                      )}
                      <p className="text-sm text-warm-500">{edu.school}</p>
                    </div>
                    <p className="text-xs text-warm-400 whitespace-nowrap">
                      {edu.period}
                    </p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>

        {/* Certifications */}
        {certifications.length > 0 && (
          <div className="mt-20">
            <FadeInView>
              <h2 className="text-2xl font-bold text-warm-900 tracking-tight">
                Certifications
              </h2>
            </FadeInView>

            <StaggerContainer className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4">
              {certifications.map((cert, index) => (
                <StaggerItem key={index}>
                  <div className="bg-white p-6 rounded-2xl border border-warm-200/60">
                    <h3 className="text-base font-semibold text-warm-900">
                      {cert.title}
                    </h3>
                    {cert.issuer && (
                      <p className="mt-1 text-sm text-warm-500">
                        {cert.issuer}
                      </p>
                    )}
                  </div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
