
import React, { useEffect, useMemo, useState } from "react";
import Header from "../components/consumerDashboard/Header.jsx";
import StatsGrid from "../components/consumerDashboard/StatsGrid.jsx";
import Tabs from "../components/consumerDashboard/Tabs.jsx";
import ActiveOrders from "../components/consumerDashboard/ActiveOrders.jsx";
import RecommendedProducts from "../components/consumerDashboard/RecommendedProducts";
import OrdersList from "../components/consumerDashboard/OrdersList.jsx";
import FavoritesList from "../components/consumerDashboard/FavoritesList.jsx";
import Footer from "../components/layout/Footer.jsx";

import { useProductContext } from "../Context/productsContext";
import { useAuth } from "../Context/authContext";
import { ShoppingCart, TrendingUp, Box, Heart } from "lucide-react";

export default function ConsumerDashboard() {
  const { user } = useAuth ? useAuth() : { user: null };
  const {
    allProducts,
    productsLoading,
    fetchProducts,
    orders,
    getUserOrders,
    ordersLoading,
    getOrderStats,
    addedProductIds,
  } = useProductContext();

  const [activeTab, setActiveTab] = useState("overview");
  const [recentOrdersLocal, setRecentOrdersLocal] = useState([]);
  const [statsRaw, setStatsRaw] = useState({ totalOrders: 0, totalRevenue: 0, byStatus: [] });
  const [loadingDashboard, setLoadingDashboard] = useState(false);
  const [error, setError] = useState(null);

  // load products + orders + stats
  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoadingDashboard(true);
      setError(null);
      try {
        await fetchProducts().catch(() => {});

        const ordersRes = await getUserOrders("?page=1&limit=5").catch(() => []);
        if (!mounted) return;
        setRecentOrdersLocal(Array.isArray(ordersRes) ? ordersRes : []);

        const s = await getOrderStats().catch(() => null);
        if (s && mounted) {
          setStatsRaw({
            totalOrders: s.totalOrders ?? (s.total || 0),
            totalRevenue: s.totalRevenue ?? s.revenue ?? 0,
            byStatus: s.byStatus ?? s.byStatusSummary ?? []
          });
        }
      } catch (err) {
        console.error("Dashboard load error:", err);
        if (mounted) setError(err?.message || "Failed to load dashboard data");
      } finally {
        if (mounted) setLoadingDashboard(false);
      }
    };

    load();
    return () => { mounted = false; };
  }, [fetchProducts, getUserOrders, getOrderStats]);

  // Recommended products heuristic: top-rated fallback to first items
  const recommendedProducts = useMemo(() => {
    if (!allProducts || allProducts.length === 0) return [];
    const clone = [...allProducts];
    clone.sort((a, b) => {
      const ra = a.ratingAverage ?? a.rating ?? 0;
      const rb = b.ratingAverage ?? b.rating ?? 0;
      if (rb !== ra) return rb - ra;
      return (b.ratingCount ?? b.reviews ?? 0) - (a.ratingCount ?? a.reviews ?? 0);
    });
    return clone.slice(0, 6);
  }, [allProducts]);

  // Favorites: temporary - using addedProductIds
  const favoriteProducts = useMemo(() => {
    if (!addedProductIds || addedProductIds.length === 0) return [];
    return addedProductIds
      .map((id) => allProducts.find((p) => String(p._id) === String(id)))
      .filter(Boolean)
      .slice(0, 12);
  }, [addedProductIds, allProducts]);

  // Build stats items expected by StatsGrid (label, value, change, color, trend, icon)
  const statsItems = [
    {
      label: "Total orders",
      value: statsRaw.totalOrders ?? 0,
      change: `Delivered: ${statsRaw.byStatus?.find(s => s._id === "delivered")?.count ?? 0}`,
      color: "blue",
      trend: "up",
      icon: ShoppingCart
    },
    
    {
      label: "Products listed",
      value: allProducts?.length ?? 0,
      change: "",
      color: "orange",
      trend: "none",
      icon: Box
    },
    {
      label: "Favorites",
      value: favoriteProducts.length ?? 0,
      change: "",
      color: "red",
      trend: "none",
      icon: Heart
    },
    {
    label: "Estimated savings",
    value: `₹${statsRaw.savings ?? 0}`,
    change: "",
    color: "orange",
    trend: "none",
    icon: TrendingUp
  }
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-green-50">
      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        {loadingDashboard || productsLoading || ordersLoading ? (
          <div className="p-8 bg-white rounded-xl shadow text-center">Loading dashboard...</div>
        ) : error ? (
          <div className="p-6 bg-red-50 rounded-xl border border-red-200 text-red-700">{error}</div>
        ) : (
          <>
            <StatsGrid stats={statsItems} />

            <div className="bg-white rounded-2xl border shadow-sm mt-6">
              <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />

              <div className="p-6">
                {activeTab === "overview" && (
                  <>
                    <ActiveOrders recentOrders={recentOrdersLocal} />
                    <div className="mt-6">
                      <RecommendedProducts products={recommendedProducts} />
                    </div>
                  </>
                )}

                {activeTab === "orders" && <OrdersList orders={recentOrdersLocal} />}

                {activeTab === "favorites" && <FavoritesList favorites={favoriteProducts} />}
              </div>
            </div>
          </>
        )}
      </div>

      <Footer />
    </div>
  );
}
