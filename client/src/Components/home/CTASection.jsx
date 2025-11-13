import { useState } from "react";
import { ChevronRight } from "lucide-react";
import React from "react";
export default function CTASection() {
  const [email, setEmail] = useState("");

  return (
    <section className="py-20 bg-linear-to-r from-green-600 to-emerald-600 text-center text-white">
      <div className="max-w-3xl mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          Ready to Get Started?
        </h2>
        <p className="text-lg text-green-100 mb-8">
          Join thousands enjoying farm-fresh produce delivered daily
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-6 py-4 rounded-xl focus:outline-none focus:ring-4 focus:ring-white/30 text-gray-900"
          />
          <button className="px-8 py-4 bg-white text-green-600 font-semibold rounded-xl hover:bg-gray-100 flex items-center justify-center gap-2 transition">
            Get Started
            <ChevronRight size={20} />
          </button>
        </div>

        <p className="text-green-100 text-sm mt-4">
          No credit card required — start browsing for free.
        </p>
      </div>
    </section>
  );
}
