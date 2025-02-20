import { FaGithub, FaLinkedin } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { emailConfig } from "@/data/content";

export default function Contact() {
  const email = `${emailConfig.user}@${emailConfig.domain}`;

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-slate-900">Get in Touch</h2>

        <div className="mt-12 max-w-3xl">
          <p className="text-lg text-slate-600">
            As a Principal Data Engineer specializing in AI/ML infrastructure and cloud architecture,
            I&apos;m always interested in discussing innovative technical solutions and opportunities.
            Whether you have a project in mind or want to connect about data engineering, AI, or cloud architecture,
            feel free to reach out!
          </p>

          <div className="mt-12 flex flex-col space-y-6">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-3 w-fit group"
            >
              <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-600 transition-colors">
                <MdEmail size={24} className="text-blue-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900">Email</p>
                <p className="text-slate-600">{email}</p>
              </div>
            </a>

            <a
              href="https://github.com/aicharles"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-fit group"
            >
              <div className="bg-slate-100 p-4 rounded-full group-hover:bg-slate-800 transition-colors">
                <FaGithub size={24} className="text-slate-700 group-hover:text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900">GitHub</p>
                <p className="text-slate-600">Check out my open source work</p>
              </div>
            </a>

            <a
              href="https://linkedin.com/in/cblumenthal"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 w-fit group"
            >
              <div className="bg-blue-100 p-4 rounded-full group-hover:bg-blue-700 transition-colors">
                <FaLinkedin size={24} className="text-blue-600 group-hover:text-white" />
              </div>
              <div>
                <p className="font-medium text-slate-900">LinkedIn</p>
                <p className="text-slate-600">Let&apos;s connect professionally</p>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
} 