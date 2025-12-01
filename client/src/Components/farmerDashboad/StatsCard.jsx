import React, { useEffect, useState } from "react";
import { useProductContext } from "../../Context/productsContext"; // adjust path if needed

export default function StatsCard({ stat }) {
  const { getOrderStats, allProducts, orders } = useProductContext();

  const [liveValue, setLiveValue] = useState(stat.value);
  const [liveChange, setLiveChange] = useState(stat.change);
  const [trend, setTrend] = useState(stat.trend);

  const Icon = stat.icon;

  const colorClasses = {
    green: "from-green-500 to-emerald-500",
    blue: "from-blue-500 to-cyan-500",
    orange: "from-orange-500 to-amber-500",
    purple: "from-purple-500 to-pink-500",
  };

  // Convert number → formatted INR
  const money = (v) =>
    typeof v === "number" ? "₹" + v.toLocaleString() : v;

  // Auto-derive "time ago" based trend
  const deriveTrend = (value) => {
    if (!value) return "neutral";
    if (typeof value === "number") return value >= 0 ? "up" : "down";
    if (typeof value === "string" && value.includes("%")) {
      const num = parseFloat(value);
      return num >= 0 ? "up" : "down";
    }
    return "neutral";
  };

  // Load dynamic stats depending on `stat.key`
  useEffect(() => {
    const load = async () => {
      try {
        if (stat.key === "revenue") {
          const stats = await getOrderStats();
          const revenue =
            stats?.revenue ??
            stats?.totalRevenue ??
            stats?.monthlyRevenue ??
            stat.value;

          const change =
            stats?.revenueChangePercent ??
            stats?.changePercent ??
            stat.change;

          setLiveValue(money(revenue));
          setLiveChange(`${change}%`);
          setTrend(deriveTrend(change));
        }

        if (stat.key === "products") {
          setLiveValue(allProducts?.length || 0);
          setLiveChange(stat.change);
          setTrend(stat.trend);
        }

        if (stat.key === "pending") {
          const pending = orders.filter(
            (o) => o.status?.toLowerCase() === "pending"
          ).length;

          setLiveValue(pending);
          setLiveChange(stat.change);
          setTrend("neutral");
        }

        if (stat.key === "completed") {
          const completed = orders.filter(
            (o) =>
              o.status?.toLowerCase() === "delivered" ||
              o.status?.toLowerCase() === "completed"
          ).length;

          setLiveValue(completed);
          setLiveChange(stat.change);
          setTrend(deriveTrend(completed));
        }
      } catch (err) {
        console.error("StatsCard data error:", err);
      }
    };

    load();
  }, [stat.key, allProducts, orders]);

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
            trend === "up"
              ? "bg-green-100 text-green-700"
              : trend === "down"
              ? "bg-red-100 text-red-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {liveChange}
        </span>
      </div>

      <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
      <p className="text-2xl font-bold text-gray-900">{liveValue}</p>
    </div>
  );
}
