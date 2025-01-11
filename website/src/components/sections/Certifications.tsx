import { certifications } from "@/data/content";

export default function Certifications() {
  return (
    <section id="certifications" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900">Certifications</h2>
        
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, index) => (
            <div 
              key={index}
              className="bg-slate-50 p-6 rounded-lg border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-900">{cert.title}</h3>
                <span className="text-sm text-blue-600">{cert.year}</span>
              </div>
              <p className="text-slate-600 text-sm">{cert.issuer}</p>
              {cert.description && (
                <p className="mt-2 text-sm text-slate-500">{cert.description}</p>
              )}
              {cert.link && (
                <a 
                  href={cert.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 text-sm text-blue-600 hover:text-blue-800 inline-block"
                >
                  Verify Certificate →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 