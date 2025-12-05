// src/pages/FarmerDashboard.jsx
import React, { useEffect, useMemo, useState, useRef } from "react";
import StatsCard from "../Components/farmerDashboad/StatsCard";
import QuickActions from "../Components/farmerDashboad/QuickActions";
import RecentActivity from "../Components/farmerDashboad/RecentActivity";
import OrdersTable from "../Components/farmerDashboad/OrdersTable";
import ProductsList from "../Components/farmerDashboad/ProductsList";
import EarningsCard from "../Components/farmerDashboad/EarningsCard";
import TopProducts from "../Components/farmerDashboad/TopProducts";
import Footer from "../Components/layout/Footer/";
import { LogOut, Leaf, User as UserIcon } from "lucide-react";
import { DollarSign, Package, Clock, CheckCircle } from "lucide-react";
import { useAuth } from "../Context/authContext";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductContext } from "../Context/productsContext";

export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // product context
  const {
    allProducts,
    productsLoading,
    fetchProducts,
    orders,
    getFarmerOrders,
    getOrderStats,
  } = useProductContext();

  const [recentOrders, setRecentOrders] = useState([]);
  const [orderStats, setOrderStats] = useState(null);
  const [loadingDashboard, setLoadingDashboard] = useState(false);

  const dropdownRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error("Logout failed", err);
      toast.error("Logout failed");
      return;
    }
    toast.success("Logout successful");
    navigate("/login");
  };

  // derive display name & initials safely (memoized)
  const { userName, initials } = useMemo(() => {
    const name = user?.name || "Guest";
    const initials = name
      .split(" ")
      .map((n) => n[0] || "")
      .slice(0, 2)
      .join("")
      .toUpperCase();
    return { userName: name, initials: initials || null };
  }, [user?.name]);

  // Close dropdown when clicking outside or pressing Escape
  useEffect(() => {
    const handleDocumentClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") setOpenMenu(false);
    };
    document.addEventListener("mousedown", handleDocumentClick);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleDocumentClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  // Load dashboard data
  useEffect(() => {
    let mounted = true;

    // if no token present, skip private endpoints
    if (!token) {
      (async () => {
        setLoadingDashboard(true);
        try {
          await fetchProducts().catch((e) =>
            console.warn("fetchProducts(public) failed:", e)
          );
        } finally {
          if (mounted) setLoadingDashboard(false);
        }
      })();

      return () => {
        mounted = false;
      };
    }

    const load = async () => {
      setLoadingDashboard(true);
      try {
        // fetch products
        await fetchProducts().catch((e) => {
          console.warn("fetchProducts failed:", e);
        });

        // farmer orders for dashboard — 401 will surface here
        let farmerOrders = [];
        try {
          farmerOrders = await getFarmerOrders();
        } catch (err) {
          console.warn("getFarmerOrders failed:", err);
          if (err?.response?.status === 401) {
            console.warn(
              "Unauthorized — token may be missing/expired. Redirecting to login."
            );
            navigate("/login");
            return;
          }
          farmerOrders = [];
        }

        // order stats (revenue, completed counts etc)
        let stats = null;
        try {
          stats = await getOrderStats();
        } catch (err) {
          console.warn("getOrderStats failed:", err);
          if (err?.response?.status === 401) {
            console.warn(
              "Unauthorized when fetching order stats. Redirecting to login."
            );
            navigate("/login");
            return;
          }
          stats = null;
        }

        if (!mounted) return;

        setRecentOrders(
          Array.isArray(farmerOrders) ? farmerOrders.slice(0, 8) : []
        );
        setOrderStats(stats || null);
      } catch (err) {
        console.error("Dashboard load error:", err);
        toast.error("Failed to load dashboard data");
      } finally {
        if (mounted) setLoadingDashboard(false);
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [token, fetchProducts, getFarmerOrders, getOrderStats, navigate]);

  const getStatusColor = (status) => {
    const c = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      preparing: "bg-blue-100 text-blue-700 border-blue-200",
      out_for_delivery: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
    };
    return c[status] || c.pending;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600" };
    if (stock < 10) return { label: "Low Stock", color: "text-orange-600" };
    return { label: "In Stock", color: "text-green-600" };
  };

  // sync activeTab with ?tab= query param so external navigation can switch tabs
  useEffect(() => {
    const qs = new URLSearchParams(location.search);
    const tab = qs.get("tab");
    if (
      tab &&
      ["overview", "orders", "products"].includes(tab) &&
      tab !== activeTab
    ) {
      setActiveTab(tab);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const stats = useMemo(
    () => [
      {
        label: "Total Revenue",
        value:
          orderStats &&
          (orderStats.revenue != null || orderStats.totalRevenue != null)
            ? `₹${Number(
                orderStats.revenue ?? orderStats.totalRevenue
              ).toLocaleString()}`
            : "₹0",
        change: orderStats?.revenueChangeText ?? "+0%",
        icon: DollarSign,
        color: "green",
        trend: "up",
      },
      {
        label: "Active Products",
        value:
          typeof allProducts?.length === "number"
            ? String(allProducts.length)
            : "0",
        change: "+ updated",
        icon: Package,
        color: "blue",
        trend: "up",
      },
      {
        label: "Pending Orders",
        value: Array.isArray(orders)
          ? String(orders.filter((o) => o.status === "pending").length)
          : String(
              recentOrders.filter((o) => o.status === "pending").length
            ),
        change: "urgent",
        icon: Clock,
        color: "orange",
        trend: "neutral",
      },
      {
        label: "Completed",
        value: Array.isArray(orders)
          ? String(orders.filter((o) => o.status === "delivered").length)
          : String(
              recentOrders.filter((o) => o.status === "delivered").length
            ),
        change: "+ this month",
        icon: CheckCircle,
        color: "purple",
        trend: "up",
      },
    ],
    [allProducts, orders, recentOrders, orderStats]
  );

  return (
    <div className="min-h-screen bg-linear-to-r from-emerald-50 via-white to-green-100">
      {/* HEADER */}
      <div className="bg-white/90 backdrop-blur-md border-b p-4 sm:p-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 w-full">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-r from-green-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shrink-0">
              <Leaf size={24} className="text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-bold text-gray-900 truncate">
                Farmer Dashboard
              </h1>
              <p className="text-sm text-gray-600 hidden md:block">
                Welcome back,{" "}
                <span className="text-green-600">{userName}</span> 👋
              </p>
            </div>

            {/* PROFILE DROPDOWN */}
            <div ref={dropdownRef} className="relative w-full sm:w-auto">
              <button
                onClick={() => setOpenMenu((v) => !v)}
                aria-haspopup="true"
                aria-expanded={openMenu}
                className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer"
                title="Open profile menu"
              >
                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center text-xs font-semibold">
                  {initials || <UserIcon size={14} />}
                </div>
                <span className="hidden sm:inline">Profile</span>
              </button>

              {openMenu && (
                <div
                  role="menu"
                  aria-label="Profile actions"
                  className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-xl border z-50"
                >
                  <div className="px-4 py-3 border-b">
                    <p className="text-sm font-semibold text-gray-900">
                      {userName}
                    </p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>

                  <button
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    onClick={() => {
                      navigate("/farmer/dashboard/profile");
                      setOpenMenu(false);
                    }}
                  >
                    My Profile
                  </button>

                  <button
                    onClick={() => {
                      handleLogout();
                      setOpenMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm text-red-600 hover:bg-red-50 rounded-b-xl"
                  >
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {/* STATS */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, i) => (
            <StatsCard stat={s} key={i} />
          ))}
        </div>

        {/* TABS */}
        <div className="mt-6 bg-white/90 backdrop-blur-xl rounded-2xl border shadow-lg overflow-hidden">
          <div className="border-b">
            <nav
              className="flex gap-0 overflow-x-auto no-scrollbar"
              aria-label="Dashboard tabs"
            >
              {["overview", "orders", "products"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`shrink-0 px-5 py-3 md:px-6 md:py-4 font-medium text-sm sm:text-base transition ${
                    activeTab === tab
                      ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-4 sm:p-6">
            {activeTab === "overview" && (
              <div className="space-y-6">
                <QuickActions />
                <RecentActivity />
              </div>
            )}

            {activeTab === "orders" && (
              <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
                <OrdersTable
                  orders={
                    Array.isArray(orders) && orders.length
                      ? orders
                      : recentOrders
                  }
                  getStatusColor={getStatusColor}
                />
              </div>
            )}

            {activeTab === "products" && (
              <div className="overflow-x-auto -mx-2 sm:mx-0">
                <ProductsList
                  products={allProducts || []}
                  getStockStatus={getStockStatus}
                  loading={productsLoading}
                />
              </div>
            )}
          </div>
        </div>

        {/* BOTTOM CARDS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <EarningsCard orderStats={orderStats} loading={loadingDashboard} />
          <TopProducts
            products={allProducts?.slice(0, 6) || []}
            loading={productsLoading}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
