import type { Metadata } from "next";
import "./globals.css";
import { DM_Sans, DM_Mono } from "next/font/google";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-satoshi",
  weight: ["400", "500", "600", "700"],
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  variable: "--font-cabinet",
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "Charles Blumenthal - Founder at Periwinkle",
  description:
    "Founder of Periwinkle, building managed AT Protocol hosting for the decentralized social web. Data engineer, builder, based in Berlin.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${dmSans.variable} ${dmMono.variable} font-sans antialiased`}
        style={{ fontFamily: "var(--font-satoshi), system-ui, sans-serif" }}
      >
        {children}
      </body>
    </html>
  );
}
