"use client";
import { certifications } from "@/data/content";
import FadeInView, {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInView";

export default function Certifications() {
  return (
    <section id="certifications" className="py-24 bg-white">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <FadeInView>
          <h2 className="text-2xl font-bold text-warm-900 tracking-tight">
            Certifications
          </h2>
        </FadeInView>

        <StaggerContainer className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-4">
          {certifications.map((cert, index) => (
            <StaggerItem key={index}>
              <div className="bg-warm-50 p-6 rounded-2xl border border-warm-200/60 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base font-semibold text-warm-900">
                    {cert.title}
                  </h3>
                  <span className="text-xs font-medium text-periwinkle-600 bg-periwinkle-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                    {cert.year}
                  </span>
                </div>
                <p className="mt-1 text-sm text-warm-500">{cert.issuer}</p>
                {cert.description && (
                  <p className="mt-3 text-sm text-warm-600 leading-relaxed">
                    {cert.description}
                  </p>
                )}
                {cert.link && (
                  <a
                    href={cert.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 text-sm text-periwinkle-600 hover:text-periwinkle-700 inline-block"
                  >
                    Verify &rarr;
                  </a>
                )}
              </div>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </div>
    </section>
  );
}
