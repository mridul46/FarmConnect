
import React, { useMemo } from "react";
import { LayoutDashboard, Package, Heart } from "lucide-react";

export default function Tabs({ activeTab, setActiveTab }) {
  // Memoize tabs so they don't re-create every render
  const tabs = useMemo(
    () => [
      { key: "overview", label: "Overview", icon: <LayoutDashboard size={16} /> },
      { key: "orders", label: "Orders", icon: <Package size={16} /> },
      { key: "favorites", label: "Favorites", icon: <Heart size={16} /> }
    ],
    []
  );

  return (
    <div
      role="tablist"
      className="
        flex 
        border-b 
        bg-white 
        overflow-x-auto 
        no-scrollbar
        sm:justify-start
      "
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;

        return (
          <button
            key={tab.key}
            role="tab"
            aria-selected={isActive}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex items-center gap-2
              px-4 sm:px-6 
              py-3 sm:py-4 
              font-medium 
              whitespace-nowrap 
              transition-all
              
              ${
                isActive
                  ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                  : "text-gray-600 hover:bg-gray-50"
              }
            `}
          >
            {tab.icon}
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
