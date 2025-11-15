import React from "react";

export default function Tabs({ activeTab, setActiveTab }) {
  const tabs = ["overview", "orders", "favorites"];

  return (
    <div
      className="
        flex 
        border-b 
        bg-white 
        overflow-x-auto 
        no-scrollbar 
        sm:justify-start 
      "
    >
      {tabs.map((t) => (
        <button
          key={t}
          onClick={() => setActiveTab(t)}
          className={`
            px-4 sm:px-6 
            py-3 sm:py-4 
            font-medium 
            whitespace-nowrap 
            transition-colors
            ${
              activeTab === t
                ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                : "text-gray-600 hover:bg-gray-50"
            }
          `}
        >
          {t.charAt(0).toUpperCase() + t.slice(1)}
        </button>
      ))}
    </div>
  );
}
