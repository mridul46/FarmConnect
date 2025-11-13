import { Leaf, MapPin, Shield, MessageCircle } from "lucide-react";
import React from "react";
export default function FeaturesSection() {
  const features = [
    {
      icon: Leaf,
      title: "Farm Fresh Produce",
      desc: "Delivered within 24 hours of harvest from trusted local farms.",
      color: "from-green-400 to-emerald-400",
    },
    {
      icon: MapPin,
      title: "Location-Based Sourcing",
      desc: "Find nearby farmers to reduce transport costs and emissions.",
      color: "from-blue-400 to-cyan-400",
    },
    {
      icon: MessageCircle,
      title: "Chat with Farmers",
      desc: "Direct communication for transparency and trust.",
      color: "from-purple-400 to-pink-400",
    },
    {
      icon: Shield,
      title: "Fair Pricing",
      desc: "No middlemen — fair earnings for farmers and better prices for you.",
      color: "from-orange-400 to-amber-400",
    },
  ];

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Why Choose FarmConnect?
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Empowering farmers, enriching consumers.
        </p>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="p-6 border border-gray-200 rounded-2xl hover:shadow-xl transition-all"
              >
                <div
                  className={`w-14 h-14 mb-4 rounded-xl bg-linear-to-r ${f.color} flex items-center justify-center mx-auto`}
                >
                  <Icon size={28} className="text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
