import React from "react";
import platformStats from "../../assets/platformStats";

export default function StatsGrid() {
  const colorClasses = {
    blue: "from-blue-500 to-cyan-500",
    green: "from-green-500 to-emerald-500",
    purple: "from-purple-500 to-pink-500",
    orange: "from-orange-500 to-amber-500",
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {platformStats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md"
          >
            <div className="flex justify-between mb-4">
              <div className={`w-12 h-12 bg-linear-to-r ${colorClasses[stat.color]} rounded-xl flex items-center justify-center`}>
                <Icon size={24} className="text-white" />
              </div>

              <span className={`text-sm px-2 py-1 rounded-full ${
                stat.trend === "up" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
              }`}>
                {stat.change}
              </span>
            </div>

            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.subtext}</p>
          </div>
        );
      })}
    </div>
  );
}
