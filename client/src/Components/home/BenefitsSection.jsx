import { Check, TrendingUp } from "lucide-react";
import React from "react";
export default function BenefitsSection() {
  const benefits = [
    "Farm-to-table freshness guaranteed",
    "Support local farmers directly",
    "Real-time stock updates",
    "Secure payment options",
    "Same-day delivery available",
    "Organic produce certified",
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Benefits for Everyone
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Whether you're a conscious consumer or a hardworking farmer, FarmConnect creates a win-win ecosystem.
          </p>

          <div className="space-y-4">
            {benefits.map((b, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-green-50 rounded-xl border border-green-100"
              >
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                  <Check size={18} className="text-white" />
                </div>
                <p className="text-gray-900 font-medium">{b}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1595855759920-86582396756a?w=600"
            alt="Farmer holding fresh produce"
            className="rounded-3xl shadow-2xl"
          />
          <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center">
                <TrendingUp size={32} className="text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-gray-900">40%</p>
                <p className="text-sm text-gray-600">Higher farmer income</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
