import React from "react";
import { useState } from "react";

import { stats, recentOrders, recommendedProducts, favoriteProducts } from "../assets/dashboardData.js";
import Header from "../components/consumerDashboard/Header.jsx";
import StatsGrid from "../components/consumerDashboard/StatsGrid.jsx";
import Tabs from "../components/consumerDashboard/Tabs.jsx";
import ActiveOrders from "../components/consumerDashboard/ActiveOrders.jsx";
import RecommendedProducts from "../components/consumerDashboard/RecommendedProducts";
import OrdersList from "../components/consumerDashboard/OrdersList.jsx";
import FavoritesList from "../components/consumerDashboard/FavoritesList.jsx";
import Footer from "../components/layout/Footer.jsx";

export default function ConsumerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <StatsGrid stats={stats} />

        <div className="bg-white rounded-2xl border shadow-sm">
          <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

          <div className="p-6">
            {activeTab === "overview" && (
              <>
                <ActiveOrders recentOrders={recentOrders} />
                <div className="mt-6">
                  <RecommendedProducts products={recommendedProducts} />
                </div>
              </>
            )}

            {activeTab === "orders" && (
              <OrdersList orders={recentOrders} />
            )}

            {activeTab === "favorites" && (
              <FavoritesList favorites={favoriteProducts} />
            )}
          </div>
        </div>
      </div>
      <Footer/>
    </div>
  );
}