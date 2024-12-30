"use client";
import { useState } from "react";

export default function Home() {
  const [activeSection, setActiveSection] = useState("about");

  const stats = [
    { label: "Years Experience", value: "10+" },
    { label: "AWS Certifications", value: "2" },
    { label: "Enterprise Projects", value: "50+" },
    { label: "Cloud Platforms", value: "3" },
  ];

  return (
    <div className="min-h-screen bg-[#0a192f] text-gray-300">
      <nav className="bg-[#112240] fixed w-full z-10 top-0 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text">
                Charles Blumenthal
              </span>
            </div>
            <div className="flex space-x-1">
              {["about", "experience", "certifications", "contact"].map(
                (section) => (
                  <button
                    key={section}
                    onClick={() => setActiveSection(section)}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                      activeSection === section
                        ? "bg-blue-500/10 text-blue-400 border border-blue-500/50"
                        : "hover:bg-blue-500/5 hover:text-blue-400"
                    }`}
                  >
                    {section.charAt(0).toUpperCase() + section.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="pt-16">
        {/* Hero Section */}
        <div className="bg-[#112240] py-32 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="text-center">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 text-transparent bg-clip-text mb-6">
                AWS & Cloud Engineering Expert
              </h1>
              <p className="text-xl text-gray-400">
                Building scalable, enterprise-grade solutions
              </p>
            </div>

            <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-[#1a2f55] rounded-xl p-6 text-center border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <dt className="text-3xl font-bold text-blue-400">
                    {stat.value}
                  </dt>
                  <dd className="mt-2 text-sm text-gray-400">{stat.label}</dd>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* About Section */}
        <section
          className={`py-24 ${activeSection === "about" ? "block" : "hidden"}`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-blue-400 mb-8">About Me</h2>
            <p className="text-lg text-gray-300 leading-relaxed">
              I'm a Principal Data Engineer at McKinsey & Company, specializing
              in AWS, Azure, and GCP cloud platforms. With expertise in data
              engineering, DevOps, and MLOps, I've architected and delivered
              transformative solutions for Fortune 500 companies. Recent
              achievements include pioneering LLM applications projected to save
              $500M annually and architecting cloud-native KYC/KYS applications
              delivering $250M in value.
            </p>
          </div>
        </section>

        {/* Experience Section */}
        <section
          className={`py-24 ${
            activeSection === "experience" ? "block" : "hidden"
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-blue-400 mb-12">
              Experience
            </h2>
            <div className="space-y-12">
              <div className="relative pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-blue-500 before:to-cyan-500">
                <h3 className="text-xl font-bold text-blue-300">
                  Principal (Jr.) Data Engineer - McKinsey & Company
                </h3>
                <p className="text-gray-400 mt-1">2023 - Present</p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Lead multiple data engineering squads across disciplines",
                    "Architected cloud-native applications generating $250M+ in value",
                    "Pioneered LLM integration projects saving $500M annually",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-400 mr-2">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative pl-8 before:absolute before:left-0 before:top-0 before:h-full before:w-1 before:bg-gradient-to-b before:from-blue-500 before:to-cyan-500">
                <h3 className="text-xl font-bold text-blue-300">
                  Lead Data Engineer - McKinsey & Company
                </h3>
                <p className="text-gray-400 mt-1">2021 - 2022</p>
                <ul className="mt-4 space-y-3">
                  {[
                    "Conducted technical due diligence for $100M+ investments",
                    "Led enterprise-scale cloud transformation projects",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start">
                      <span className="text-blue-400 mr-2">▹</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section
          className={`py-24 ${
            activeSection === "certifications" ? "block" : "hidden"
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-blue-400 mb-12">
              Certifications
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "AWS Solutions Architect Associate", year: "2021" },
                { title: "Terraform Associate", year: "2022" },
                { title: "AWS Cloud Practitioner", year: "2019" },
              ].map((cert, i) => (
                <div
                  key={i}
                  className="bg-[#1a2f55] p-6 rounded-xl border border-blue-500/20 hover:border-blue-500/50 transition-all duration-300 hover:transform hover:-translate-y-1"
                >
                  <h3 className="text-xl font-bold text-blue-300">
                    {cert.title}
                  </h3>
                  <p className="mt-2 text-gray-400">{cert.year}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section
          className={`py-24 ${
            activeSection === "contact" ? "block" : "hidden"
          }`}
        >
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-blue-400 mb-12">Contact</h2>
            <div className="bg-[#1a2f55] p-8 rounded-xl border border-blue-500/20">
              <h3 className="text-xl font-bold text-blue-300 mb-6">
                Get in Touch
              </h3>
              <div className="space-y-4">
                <p className="flex items-center">
                  <span className="text-blue-400 mr-2">✉</span>
                  <a
                    href="mailto:charlesblumenthal@gmail.com"
                    className="hover:text-blue-400 transition-colors"
                  >
                    charlesblumenthal@gmail.com
                  </a>
                </p>
                <p className="flex items-center">
                  <span className="text-blue-400 mr-2">📱</span>
                  <span>+1 702-684-1275</span>
                </p>
                <div className="flex space-x-6 pt-4">
                  <a
                    href="https://github.com/aicharles"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    GitHub
                  </a>
                  <a
                    href="https://linkedin.com/in/cblumenthal"
                    className="text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    LinkedIn
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#112240] py-8 mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500">
            &copy; 2024 Charles Blumenthal. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
