import { stats } from "@/data/content";

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900">About Me</h2>
        <div className="mt-6 space-y-4 text-lg text-slate-600">
          <p>
            I&apos;m an AI & Data Engineering Leader pioneering the integration of advanced AI agents and
            generative AI into production-ready enterprise applications. At McKinsey & Company, I&apos;ve led the
            development of multiple high-impact AI solutions that leverage cutting-edge frameworks to accelerate
            development and deliver tangible business value. My expertise spans the full lifecycle of AI-driven
            applications - from architecting cloud-native infrastructure and implementing MLOps practices to
            deploying intelligent agents that transform how enterprises operate.
          </p>
          <p>
            I specialize in building production-grade applications that harness the power of AI agents,
            large language models, and automated workflows. By combining deep technical expertise in cloud
            architecture (AWS, Kubernetes, Serverless) with advanced AI capabilities, I deliver solutions
            that not only streamline development but create intelligent, autonomous systems that drive
            real business transformation.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="bg-slate-50 p-8 rounded-lg border border-slate-200 flex flex-col items-center justify-center text-center"
            >
              <p className="text-4xl font-bold text-blue-600">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}