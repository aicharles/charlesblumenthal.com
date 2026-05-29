"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed w-full z-30 top-0 bg-warm-50/80 backdrop-blur-md border-b border-warm-200/60">
      <div className="max-w-5xl mx-auto px-5 sm:px-8">
        <div className="flex items-center justify-between h-16">
          <Link
            href="/"
            className="text-lg font-semibold text-warm-900 tracking-tight hover:text-periwinkle-600 transition-colors"
          >
            Charles Blumenthal
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  pathname === item.href
                    ? "bg-periwinkle-100 text-periwinkle-700"
                    : "text-warm-600 hover:text-warm-900 hover:bg-warm-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/aicharles"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-warm-600 hover:text-warm-900 hover:bg-warm-100 transition-all duration-200"
            >
              GitHub
            </a>
            <a
              href="https://bsky.app/profile/charles.pwkl.social"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-full text-sm font-medium text-warm-600 hover:text-warm-900 hover:bg-warm-100 transition-all duration-200"
            >
              Bluesky
            </a>
          </div>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-warm-600 hover:bg-warm-100 transition-colors"
            aria-label="Toggle navigation"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            >
              {mobileOpen ? (
                <>
                  <line x1="4" y1="4" x2="16" y2="16" />
                  <line x1="16" y1="4" x2="4" y2="16" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="17" y2="6" />
                  <line x1="3" y1="10" x2="17" y2="10" />
                  <line x1="3" y1="14" x2="17" y2="14" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-warm-200/60 bg-warm-50/95 backdrop-blur-md">
          <div className="px-5 py-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={`block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-periwinkle-100 text-periwinkle-700"
                    : "text-warm-600 hover:bg-warm-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="https://github.com/aicharles"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-warm-600 hover:bg-warm-100"
            >
              GitHub
            </a>
            <a
              href="https://bsky.app/profile/charles.pwkl.social"
              target="_blank"
              rel="noopener noreferrer"
              className="block px-3 py-2.5 rounded-lg text-sm font-medium text-warm-600 hover:bg-warm-100"
            >
              Bluesky
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
