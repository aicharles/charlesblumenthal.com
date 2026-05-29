import { FaGithub, FaLinkedin, FaBluesky } from "react-icons/fa6";

const socialLinks = [
  {
    href: "https://bsky.app/profile/charlesblumenthal.com",
    icon: FaBluesky,
    label: "Bluesky",
  },
  {
    href: "https://github.com/aicharles",
    icon: FaGithub,
    label: "GitHub",
  },
  {
    href: "https://linkedin.com/in/cblumenthal",
    icon: FaLinkedin,
    label: "LinkedIn",
  },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-warm-200/60">
      <div className="max-w-5xl mx-auto py-6 px-5 sm:px-8">
        <div className="flex justify-between items-center">
          <p className="text-sm text-warm-400">
            &copy; {new Date().getFullYear()} Charles Blumenthal
          </p>
          <div className="flex items-center gap-1">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-warm-400 hover:text-periwinkle-600 transition-colors p-2 rounded-full hover:bg-warm-50"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
