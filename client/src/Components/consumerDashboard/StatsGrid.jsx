
import React, { cloneElement } from "react";

/**
 * StatsGrid
 * - Expects stats: [{ label, value, change, color, trend, icon }]
 * - Defensive: handles icon as a React element or component and keeps icon color white
 */

const DefaultIcon = (props) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" {...props}>
    <rect x="4" y="4" width="16" height="16" rx="3" stroke="currentColor" strokeWidth="1.6" />
    <path d="M7 13h3v3M14 8h3v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export default function StatsGrid({ stats = [] }) {
  const items = Array.isArray(stats) ? stats : [];

  const colors = {
    blue: "from-blue-500 to-cyan-500",
    orange: "from-orange-500 to-amber-500",
    green: "from-green-500 to-emerald-500",
    red: "from-red-500 to-pink-500",
    gray: "from-gray-400 to-gray-600"
  };

  if (items.length === 0) {
    return (
      <div className="p-4 bg-white rounded-2xl border text-center text-sm text-gray-500">
        No stats to display
      </div>
    );
  }

  // uniform class applied to icons so they remain white on the gradient background
  const iconClass = "text-white sm:w-6 sm:h-6";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
      {items.map((stat, i) => {
        const {
          label = "Metric",
          value = "—",
          change = "",
          color = "gray",
          trend = "none",
          icon: IconProp
        } = stat || {};

        const colorClass = colors[color] || colors.gray;

        // Safe icon rendering:
        // - React element (clone to inject props)
        // - Component/function (render with props)
        // - Fallback DefaultIcon
        let IconNode = null;
        if (React.isValidElement(IconProp)) {
          IconNode = cloneElement(IconProp, { size: 22, className: iconClass, ...IconProp.props });
        } else if (typeof IconProp === "function" || (typeof IconProp === "object" && IconProp !== null)) {
          // covers lucide/react icons (function components) and any object-style components
          const C = IconProp;
          IconNode = <C size={22} className={iconClass} />;
        } else {
          IconNode = <DefaultIcon className={iconClass} />;
        }

        return (
          <div key={i} className="bg-white rounded-2xl border p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between mb-3 sm:mb-4 items-center">
              <div
                className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-r ${colorClass} flex items-center justify-center`}
                aria-hidden
              >
                {/* Icon rendered with enforced white color */}
                {IconNode}
              </div>

              <span
                className={`text-xs sm:text-sm font-medium px-2 py-1 rounded-full ${
                  trend === "up" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}
              >
                {change}
              </span>
            </div>

            <p className="text-gray-600 text-xs sm:text-sm">{label}</p>
            <p className="text-xl sm:text-2xl font-bold">{value}</p>
          </div>
        );
      })}
    </div>
  );
}
