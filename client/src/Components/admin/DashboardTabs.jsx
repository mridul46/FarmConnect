import React from "react";
import OverviewTab from "./OverviewTab";
import UsersTab from "./UsersTab";
import OrdersTab from "./OrdersTab";
import FarmersTab from "./FarmersTab";

export default function DashboardTabs({ activeTab, setActiveTab }) {
  return (
    <div className="bg-white rounded-2xl border overflow-hidden">
      {/* Tabs */}
      <div className="border-b flex">
        {["overview", "users", "orders", "farmers"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-4 font-medium ${
              activeTab === tab
                ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50"
                : "text-gray-600 hover:bg-gray-50"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "users" && <UsersTab />}
        {activeTab === "orders" && <OrdersTab />}
        {activeTab === "farmers" && <FarmersTab />}
      </div>
    </div>
  );
}
