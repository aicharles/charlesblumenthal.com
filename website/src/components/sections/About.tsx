"use client";
import { stats } from "@/data/content";
import FadeInView, {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInView";

export default function About() {
  return (
    <section id="about" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <FadeInView>
          <h2 className="text-2xl font-bold text-warm-900 tracking-tight">
            About
          </h2>
        </FadeInView>

        <div className="mt-8 space-y-5 text-base sm:text-lg text-warm-600 leading-relaxed">
          <FadeInView delay={0.1}>
            <p>
              I&apos;m the founder of{" "}
              <a
                href="https://periwinkle.social"
                target="_blank"
                rel="noopener noreferrer"
                className="text-periwinkle-600 hover:text-periwinkle-700 underline decoration-periwinkle-300 underline-offset-2 transition-colors"
              >
                Periwinkle
              </a>
              , a managed hosting service for AT Protocol personal data servers.
              The major social platforms have become extractive by design - I
              believe people should own their social identity and data. Periwinkle
              makes that accessible by handling the infrastructure: updates, backups,
              monitoring, custom domains, and compliance - so users can
              participate in the decentralized social web without running their own
              servers.
            </p>
          </FadeInView>
          <FadeInView delay={0.2}>
            <p>
              Before Periwinkle, I spent several years as a data engineer, most
              recently as a Principal at McKinsey & Company where I built
              production AI systems and cloud-native infrastructure. I hold an
              MBA from the University of Chicago Booth School of Business and am
              based in Berlin.
            </p>
          </FadeInView>
        </div>

        <StaggerContainer className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, index) => (
            <StaggerItem key={index}>
              <div className="bg-warm-50 p-6 rounded-2xl border border-warm-200/60 text-center">
                <p className="text-3xl font-bold text-periwinkle-600">
                  {stat.value}
                </p>
                <p className="mt-1.5 text-sm text-warm-500">{stat.label}</p>
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
