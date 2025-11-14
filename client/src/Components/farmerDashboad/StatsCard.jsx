import React from "react";
import { TrendingUp } from "lucide-react";

export default function StatsCard({ stat }) {
  const Icon = stat.icon;

  const colorClasses = {
    green: "from-green-500 to-emerald-500",
    blue: "from-blue-500 to-cyan-500",
    orange: "from-orange-500 to-amber-500",
    purple: "from-purple-500 to-pink-500",
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 bg-linear-to-r ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}
        >
          <Icon size={24} className="text-white" />
        </div>
        <span
          className={`text-sm font-medium px-2 py-1 rounded-full ${
            stat.trend === "up"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {stat.change}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
    </div>
  );
}
