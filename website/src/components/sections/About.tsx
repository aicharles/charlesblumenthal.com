import { stats } from "@/data/content";

export default function About() {
  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900">About Me</h2>
        <p className="mt-6 text-lg text-slate-600 max-w-3xl">
          I'm a passionate software engineer with extensive experience in cloud architecture 
          and full-stack development. My journey in tech has led me through various roles 
          where I've developed scalable solutions for enterprise clients.
        </p>
        
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-slate-50 p-6 rounded-lg border border-slate-200"
            >
              <p className="text-3xl font-bold text-blue-600">{stat.value}</p>
              <p className="mt-2 text-sm text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 