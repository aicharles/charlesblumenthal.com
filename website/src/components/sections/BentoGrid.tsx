"use client";
import { motion } from "framer-motion";
import { FaBluesky, FaXTwitter } from "react-icons/fa6";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import SocialFeeds from "./SocialFeeds";
import Carousel from "@/components/ui/Carousel";

const lifePhotos = [
  { src: "/dog-laptop.jpeg", alt: "Dog peeking over the laptop" },
  { src: "/eggs.jpeg", alt: "The Charles Blumenthal Special" },
  { src: "/dogs-bed.jpeg", alt: "Dogs cuddling on the bed" },
  { src: "/shells-greens.jpeg", alt: "Shells, greens, and a blizzard of parm" },
  { src: "/couch.jpeg", alt: "Couch time with the pup" },
  { src: "/chicken-parm.jpeg", alt: "Chicken parm, Berlin edition" },
  { src: "/bread-pudding.jpeg", alt: "Sunday bread pudding" },
];

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.25, 0.1, 0.25, 1] as const },
  },
};

const socials = [
  {
    href: "https://bsky.app/profile/charles.pwkl.social",
    icon: FaBluesky,
    label: "@charles.pwkl.social",
    color: "text-sky-500 hover:text-sky-600",
  },
  {
    href: "https://bsky.app/profile/periwinkle.social",
    icon: FaBluesky,
    label: "@periwinkle.social",
    color: "text-periwinkle-500 hover:text-periwinkle-600",
  },
  {
    href: "https://x.com/pwkl_social",
    icon: FaXTwitter,
    label: "@pwkl_social",
    color: "text-warm-700 hover:text-warm-900",
  },
  {
    href: "https://github.com/aicharles",
    icon: FaGithub,
    label: "GitHub",
    color: "text-warm-700 hover:text-warm-900",
  },
  {
    href: "https://linkedin.com/in/cblumenthal",
    icon: FaLinkedin,
    label: "LinkedIn",
    color: "text-blue-600 hover:text-blue-700",
  },
];

export default function BentoGrid() {
  return (
    <section className="px-5 sm:px-8 pb-24 max-w-5xl mx-auto">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-40px" }}
        className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 auto-rows-min"
      >
        {/* Periwinkle - large featured card */}
        <motion.a
          variants={item}
          href="https://periwinkle.social"
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-2 row-span-2 bg-linear-to-br from-periwinkle-500 via-periwinkle-600 to-periwinkle-700 rounded-3xl p-6 sm:p-8 flex flex-col justify-between text-white group hover:shadow-xl hover:scale-[1.01] transition-all duration-300 min-h-[280px]"
        >
          <div>
            <p className="text-xs font-medium text-periwinkle-200 uppercase tracking-widest">
              What I&apos;m Building
            </p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-bold tracking-tight">
              Periwinkle
            </h2>
            <p className="mt-3 text-periwinkle-100 text-sm sm:text-base leading-relaxed max-w-sm">
              Managed hosting for AT Protocol personal data servers. Own your
              social identity - we handle the rest.
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-periwinkle-200 group-hover:text-white transition-colors text-sm mt-4">
            <span>periwinkle.social</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
            >
              <path d="M4 10L10 4M10 4H5M10 4V9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </motion.a>

        {/* Blog cards stacked */}
        <motion.a
          variants={item}
          href="https://periwinkle.social/blog"
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-1 row-span-2 bg-white rounded-3xl p-5 border border-warm-200/60 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-semibold text-warm-900">
              Periwinkle Blog
            </h3>
            <p className="mt-1.5 text-sm text-warm-500 leading-relaxed">
              Building in the open.
            </p>
          </div>
          <div className="flex items-center gap-1 text-periwinkle-600 text-sm mt-3 group-hover:gap-2 transition-all">
            <span>Read</span>
            <span className="text-xs">&rarr;</span>
          </div>
        </motion.a>

        <motion.a
          variants={item}
          href="https://blog.charlesblumenthal.com"
          target="_blank"
          rel="noopener noreferrer"
          className="col-span-1 row-span-2 bg-white rounded-3xl p-5 border border-warm-200/60 group hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 flex flex-col justify-between"
        >
          <div>
            <h3 className="text-base font-semibold text-warm-900">
              Personal Blog
            </h3>
            <p className="mt-1.5 text-sm text-warm-500 leading-relaxed">
              Tech, society, and whatever else.
            </p>
          </div>
          <div className="flex items-center gap-1 text-periwinkle-600 text-sm mt-3 group-hover:gap-2 transition-all">
            <span>Read</span>
            <span className="text-xs">&rarr;</span>
          </div>
        </motion.a>

        {/* Social links bar */}
        <motion.div
          variants={item}
          className="col-span-2 md:col-span-4 bg-white rounded-3xl px-5 py-4 border border-warm-200/60 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
        >
          {socials.map((s) => {
            const Icon = s.icon;
            return (
              <a
                key={s.href}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 text-sm font-medium transition-colors ${s.color}`}
              >
                <Icon size={18} />
                <span>{s.label}</span>
              </a>
            );
          })}
        </motion.div>

        {/* What I'm Into - consolidated (left column, above the photos) */}
        <motion.div
          variants={item}
          className="col-span-2 bg-linear-to-br from-warm-800 to-warm-900 rounded-3xl p-5 sm:p-6"
        >
          <p className="text-xs font-semibold text-warm-300 uppercase tracking-wider">
            What I&apos;m Into Right Now
          </p>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Reading */}
            <div>
              <p className="text-[10px] font-semibold text-warm-400 uppercase tracking-wider mb-2">
                Reading
              </p>
              <div className="space-y-1.5">
                {[
                  "What My Bones Know",
                  "A Village in the Third Reich",
                  "Kingfish",
                  "The Russian Revolution",
                ].map((book) => (
                  <p key={book} className="text-sm text-warm-200 leading-snug">
                    {book}
                  </p>
                ))}
              </div>
            </div>

            {/* Listening */}
            <div>
              <p className="text-[10px] font-semibold text-warm-400 uppercase tracking-wider mb-2">
                Listening
              </p>
              <div className="space-y-1.5">
                <p className="text-sm text-warm-200">Rest Is Politics</p>
                <p className="text-sm text-warm-200">Pod Save America</p>
              </div>
              <p className="text-[10px] font-semibold text-warm-400 uppercase tracking-wider mt-4 mb-2">
                Watching
              </p>
              <div className="space-y-1.5">
                <p className="text-sm text-warm-200">Tennis</p>
                <p className="text-sm text-warm-200">Sinners</p>
              </div>
            </div>

            {/* Influences */}
            <div>
              <p className="text-[10px] font-semibold text-warm-400 uppercase tracking-wider mb-2">
                Influences
              </p>
              <div className="space-y-2">
                <a
                  href="https://www.techdirt.com/2025/04/17/the-de-in-decentralization-stands-for-democracy/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <p className="text-sm text-warm-200 group-hover:text-white transition-colors leading-snug">
                    The &apos;De&apos; in Decentralization Stands for Democracy
                  </p>
                  <p className="text-[10px] text-warm-500">Mike Masnick</p>
                </a>
                <a
                  href="https://open.spotify.com/episode/6fWM12wtwgY8j6NMyrXBGg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block group"
                >
                  <p className="text-sm text-warm-200 group-hover:text-white transition-colors leading-snug">
                    The Enshittification of the Internet
                  </p>
                  <p className="text-[10px] text-warm-500">
                    Cory Doctorow
                  </p>
                </a>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Social feeds - live posts with tabs (tall, right column) */}
        <motion.div
          variants={item}
          className="col-span-2 md:col-span-2 row-span-3 self-start bg-white rounded-3xl p-5 border border-warm-200/60"
        >
          <SocialFeeds />
        </motion.div>

        {/* Life lately - photo carousel */}
        <motion.div
          variants={item}
          className="col-span-2 row-span-2 rounded-3xl overflow-hidden bg-warm-100 flex flex-col"
        >
          <div className="px-5 pt-5 pb-2 shrink-0">
            <p className="text-[10px] font-semibold text-warm-400 uppercase tracking-widest">
              Life Lately
            </p>
            <h3 className="mt-2 text-base font-bold text-warm-900">
              Dogs, dinners, and Berlin
            </h3>
          </div>
          <div className="px-4 pb-4 pt-1 flex-1 min-h-0">
            <Carousel images={lifePhotos} heightClass="h-full" />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
