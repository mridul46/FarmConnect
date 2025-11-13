import { Star } from "lucide-react";
import React from "react";
export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Priya Sharma",
      role: "Home Chef",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Priya",
      text: "The vegetables are incredibly fresh! Supporting local farmers while enjoying premium quality produce feels great.",
      rating: 5,
    },
    {
      name: "Amit Patel",
      role: "Restaurant Owner",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Amit",
      text: "My restaurant’s supply chain is now transparent and reliable. Prices are fair and the farmers are happy too!",
      rating: 5,
    },
    {
      name: "Rajesh Kumar",
      role: "Farmer",
      image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh",
      text: "FarmConnect gave me direct access to customers. No middlemen — my profits have increased by 40%.",
      rating: 5,
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-20 bg-linear-to-br from-green-50 to-emerald-50"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          What People Say
        </h2>
        <p className="text-lg text-gray-600 mb-12">
          Trusted by thousands of happy customers and farmers
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all"
            >
              <div className="flex justify-center mb-3">
                {[...Array(t.rating)].map((_, j) => (
                  <Star
                    key={j}
                    size={18}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-gray-700 mb-6 italic">“{t.text}”</p>
              <div className="flex items-center gap-3 justify-center">
                <img
                  src={t.image}
                  alt={t.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-900">{t.name}</p>
                  <p className="text-sm text-gray-600">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
