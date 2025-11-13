import React from "react";
import { Leaf, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "How it Works", href: "#how-it-works" },
    { label: "Testimonials", href: "#testimonials" },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
            <Leaf size={24} className="text-white" />
          </div>
          <span className="text-2xl font-bold bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            FarmConnect
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-gray-700 hover:text-green-600 font-medium transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button className="px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">
            Sign In
          </button>
          <button className="px-5 py-2.5 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-600/30 transition-all">
            Get Started
          </button>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-md">
          <div className="px-6 py-4 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-gray-700 font-medium hover:text-green-600 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
            <hr className="my-2" />
            <button className="w-full px-5 py-2.5 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors">
              Sign In
            </button>
            <button className="w-full px-5 py-2.5 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:shadow-lg hover:shadow-green-600/30 transition-all">
              Get Started
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
