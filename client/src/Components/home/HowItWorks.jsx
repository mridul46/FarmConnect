import { ShoppingBag, MessageCircle, Truck, ChevronRight } from "lucide-react";
import React from "react";
export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Browse & Select",
      desc: "Explore fresh produce directly from farmers near you.",
      icon: ShoppingBag,
    },
    {
      step: "2",
      title: "Chat & Order",
      desc: "Talk to farmers, ask about products, and place your order easily.",
      icon: MessageCircle,
    },
    {
      step: "3",
      title: "Receive Fresh",
      desc: "Get your order delivered within 24 hours — straight from the farm.",
      icon: Truck,
    },
  ];

  return (
    <section
      id="how-it-works"
      className="py-20 bg-linear-to-br from-gray-50 to-green-50"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          How It Works
        </h2>
        <p className="text-lg text-gray-600 mb-16">
          Simple steps to enjoy fresh and sustainable produce
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all border border-gray-100 relative"
              >
                <div className="w-16 h-16 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mb-6 mx-auto">
                  {s.step}
                </div>
                <Icon
                  size={32}
                  className="text-green-600 mx-auto mb-4 opacity-90"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">
                  {s.title}
                </h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ChevronRight size={32} className="text-green-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
