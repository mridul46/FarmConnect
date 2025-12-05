import { useState } from "react";
import React from "react";
import Header from "../Components/admin/Header";
import StatsGrid from "../Components/admin/StatsGrid";
import SystemAlerts from "../Components/admin/SystemAlerts";
import DashboardTabs from "../Components/admin/DashboardTabs";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedTimeRange, setSelectedTimeRange] = useState("week");

  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50">
      <Header selectedTimeRange={selectedTimeRange} setSelectedTimeRange={setSelectedTimeRange} />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <StatsGrid />
        <SystemAlerts />
        <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </div>
  );
}
