"use client";
import { NavProps } from "@/types";

export default function Navbar({ activeSection, onSectionChange }: NavProps) {
  return (
    <nav className="bg-white fixed w-full z-10 top-0 shadow-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-shrink-0">
            <button 
              onClick={() => onSectionChange("about")}
              className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 text-transparent bg-clip-text hover:opacity-80 transition-opacity"
            >
              Charles Blumenthal
            </button>
          </div>
          <div className="flex space-x-1">
            {["about", "experience", "certifications", "contact"].map(
              (section) => (
                <button
                  key={section}
                  onClick={() => onSectionChange(section)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 ${
                    activeSection === section
                      ? "bg-blue-50 text-gray-900 border border-blue-200"
                      : "text-gray-700 hover:bg-slate-50 hover:text-blue-600"
                  }`}
                >
                  {section.charAt(0).toUpperCase() + section.slice(1)}
                </button>
              )
            )}
          </div>
        </div>
      </div>
    </nav>
  );
} 