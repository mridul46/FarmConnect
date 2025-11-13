import React from "react";
import { Users, Truck, Star, ShoppingBag } from "lucide-react";

export default function StatsSection() {
  const stats = [
    { label: "Active Farmers", value: "1,200+", icon: Users },
    { label: "Products Listed", value: "5,000+", icon: ShoppingBag },
    { label: "Orders Delivered", value: "50,000+", icon: Truck },
    { label: "Happy Customers", value: "15,000+", icon: Star },
  ];

  return (
    <section className="py-16 bg-linear-to-r from-green-600 to-emerald-600 text-white">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 px-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="text-center">
              <Icon size={36} className="mx-auto mb-2 opacity-90" />
              <p className="text-3xl font-bold">{stat.value}</p>
              <p className="text-green-100 text-sm">{stat.label}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
}