import React from "react";

export default function StatsGrid({ stats }) {
  const colors = {
    blue: "from-blue-500 to-cyan-500",
    orange: "from-orange-500 to-amber-500",
    green: "from-green-500 to-emerald-500",
    red: "from-red-500 to-pink-500",
  };

  return (
    <div
      className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        lg:grid-cols-4 
        gap-4 
        sm:gap-6 
        mb-6 sm:mb-8
      "
    >
      {stats.map((stat, i) => {
        const Icon = stat.icon;
        return (
          <div
            key={i}
            className="
              bg-white 
              rounded-2xl 
              border 
              p-4 sm:p-6 
              shadow-sm 
              hover:shadow-md 
              transition-shadow
            "
          >
            {/* Top Section */}
            <div className="flex justify-between mb-3 sm:mb-4">
              <div
                className={`
                  w-10 h-10 sm:w-12 sm:h-12 
                  rounded-xl 
                  bg-linear-to-r 
                  ${colors[stat.color]} 
                  flex items-center justify-center
                `}
              >
                <Icon size={22} className="text-white sm:w-6 sm:h-6" />
              </div>

              <span
                className={`
                  text-xs sm:text-sm 
                  font-medium 
                  px-2 py-1 
                  rounded-full
                  ${
                    stat.trend === "up"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-700"
                  }
                `}
              >
                {stat.change}
              </span>
            </div>

            {/* Bottom Section */}
            <p className="text-gray-600 text-xs sm:text-sm">{stat.label}</p>
            <p className="text-xl sm:text-2xl font-bold">{stat.value}</p>
          </div>
        );
      })}
    </div>
  );
}
