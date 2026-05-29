"use client";
import { FaGithub, FaLinkedin, FaBluesky } from "react-icons/fa6";
import FadeInView, {
  StaggerContainer,
  StaggerItem,
} from "@/components/ui/FadeInView";

const contacts = [
  {
    label: "Bluesky",
    href: "https://bsky.app/profile/charlesblumenthal.com",
    subtitle: "Follow me on Bluesky",
    icon: FaBluesky,
    hoverBg: "group-hover:bg-sky-500",
    hoverIcon: "group-hover:text-white",
    iconColor: "text-sky-500",
    bgColor: "bg-sky-100",
  },
  {
    label: "GitHub",
    href: "https://github.com/aicharles",
    subtitle: "Open source work",
    icon: FaGithub,
    hoverBg: "group-hover:bg-warm-800",
    hoverIcon: "group-hover:text-white",
    iconColor: "text-warm-700",
    bgColor: "bg-warm-100",
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/in/cblumenthal",
    subtitle: "Connect professionally",
    icon: FaLinkedin,
    hoverBg: "group-hover:bg-blue-600",
    hoverIcon: "group-hover:text-white",
    iconColor: "text-blue-600",
    bgColor: "bg-blue-100",
  },
];

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-warm-50">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <FadeInView>
          <h2 className="text-2xl font-bold text-warm-900 tracking-tight">
            Get in Touch
          </h2>
        </FadeInView>

        <FadeInView delay={0.1}>
          <p className="mt-6 text-base sm:text-lg text-warm-600 max-w-2xl leading-relaxed">
            I&apos;m always happy to chat about the decentralized social web, AT
            Protocol, or new ideas. Whether you&apos;re interested in
            Periwinkle or just want to say hi - reach out.
          </p>
        </FadeInView>

        <StaggerContainer className="mt-10 flex flex-col space-y-3 max-w-md">
          {contacts.map((item) => {
            const Icon = item.icon;

            return (
              <StaggerItem key={item.label}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3.5 group p-2 -mx-2 rounded-xl hover:bg-white transition-colors"
                >
                  <div
                    className={`${item.bgColor} ${item.hoverBg} p-3 rounded-full transition-colors`}
                  >
                    <Icon
                      size={20}
                      className={`${item.iconColor} ${item.hoverIcon} transition-colors`}
                    />
                  </div>
                  <div>
                    <p className="font-medium text-warm-900 text-sm">
                      {item.label}
                    </p>
                    <p className="text-warm-500 text-sm">{item.subtitle}</p>
                  </div>
                </a>
              </StaggerItem>
            );
          })}
        </StaggerContainer>
      </div>
    </section>
  );
}
