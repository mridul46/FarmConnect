import React, { useEffect, useState } from "react";
import { Package, TrendingUp, ShoppingBag, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductContext } from "../../Context/productsContext"; 

export default function QuickActions() {
  const navigate = useNavigate();
  const {
    allProducts,
    productsLoading,
    refreshProducts,
    orders,
    ordersLoading,
    refreshOrders,
    getFarmerOrders,
    getOrderStats,
  } = useProductContext();

  const [pendingCount, setPendingCount] = useState(0);
  const [loadingAction, setLoadingAction] = useState(false);

  useEffect(() => {
    // derive pending count from context orders if available
    if (Array.isArray(orders) && orders.length) {
      setPendingCount(orders.filter((o) => String(o.status).toLowerCase() === "pending").length);
    } else {
      // fallback: fetch a small slice from farmer orders endpoint
      let mounted = true;
      (async () => {
        try {
          const res = await getFarmerOrders().catch(() => []);
          if (!mounted) return;
          if (Array.isArray(res)) {
            setPendingCount(res.filter((o) => String(o.status).toLowerCase() === "pending").length);
          }
        } catch (err) {
          // ignore
        }
      })();
      return () => {
        mounted = false;
      };
    }
  }, [orders, getFarmerOrders]);

  const handleUpdateStock = async () => {
    setLoadingAction(true);
    toast.loading("Refreshing products...", { id: "qa-refresh" });
    try {
      await refreshProducts();
      toast.success("Products refreshed. Open products page to update stock.", { id: "qa-refresh" });
      // navigate to products tab / page - change route if different in your app
      navigate("/dashboard/products");
    } catch (err) {
      console.error("refreshProducts failed:", err);
      toast.error("Failed to refresh products", { id: "qa-refresh" });
    } finally {
      setLoadingAction(false);
    }
  };

  const handleViewAnalytics = async () => {
    setLoadingAction(true);
    toast.loading("Loading analytics...", { id: "qa-analytics" });
    try {
      const stats = await getOrderStats();
      // pick likely fields with sensible fallbacks
      const revenue = stats?.revenue ?? stats?.totalRevenue ?? stats?.monthlyRevenue ?? null;
      const completed = stats?.completedOrders ?? stats?.delivered ?? stats?.completed ?? null;
      const change = stats?.revenueChangePercent ?? stats?.changePercent ?? null;

      const revenueText = revenue != null ? `Revenue: ₹${Number(revenue).toLocaleString()}` : "Revenue: —";
      const completedText = completed != null ? `Completed: ${completed}` : "Completed: —";
      const changeText = change != null ? `Change: ${change > 0 ? "+" : ""}${change}%` : null;

      toast.dismiss("qa-analytics");
      toast.success(
        <div>
          <div className="font-semibold">{revenueText}</div>
          <div className="text-sm text-gray-600">{completedText}</div>
          {changeText ? <div className="text-sm text-gray-500">{changeText}</div> : null}
        </div>
      );
    } catch (err) {
      console.error("getOrderStats failed:", err);
      toast.dismiss("qa-analytics");
      toast.error("Failed to load analytics");
    } finally {
      setLoadingAction(false);
    }
  };

  const handleProcessOrders = async () => {
    setLoadingAction(true);
    toast.loading("Refreshing orders...", { id: "qa-orders" });
    try {
      await refreshOrders().catch(() => {});
      toast.success("Orders refreshed", { id: "qa-orders" });
      navigate("/dashboard/orders");
    } catch (err) {
      console.error("refreshOrders failed:", err);
      toast.error("Failed to refresh orders", { id: "qa-orders" });
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button
        onClick={handleUpdateStock}
        disabled={loadingAction}
        className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left flex items-start gap-4"
      >
        <div className="shrink-0">
          <Package className="text-green-600" size={28} />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Update Stock</p>
              <p className="text-sm text-gray-600">Manage inventory levels</p>
            </div>
            <div className="ml-2 text-sm text-gray-500">
              <span className="block text-right">{Array.isArray(allProducts) ? allProducts.length : "—"}</span>
              <span className="block text-xs text-gray-400">products</span>
            </div>
          </div>
          <div className="mt-3 text-xs text-gray-500 flex items-center gap-2">
            <RefreshCw size={14} />
            <span>Refresh then edit products</span>
          </div>
        </div>
      </button>

      <button
        onClick={handleViewAnalytics}
        disabled={loadingAction}
        className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left flex items-start gap-4"
      >
        <div className="shrink-0">
          <TrendingUp className="text-blue-600" size={28} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">View Analytics</p>
              <p className="text-sm text-gray-600">Check sales performance</p>
            </div>
            <div className="ml-2 text-sm text-gray-500">
              <span className="block text-right">Last month</span>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            <span className="font-medium">{productsLoading ? "Loading…" : `${allProducts?.length ?? 0} SKUs`}</span>
            <span className="mx-2">•</span>
            <span>{ordersLoading ? "Orders: …" : `Pending: ${pendingCount}`}</span>
          </div>
        </div>
      </button>

      <button
        onClick={handleProcessOrders}
        disabled={loadingAction}
        className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left flex items-start gap-4"
      >
        <div className="shrink-0">
          <ShoppingBag className="text-purple-600" size={28} />
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-gray-900">Process Orders</p>
              <p className="text-sm text-gray-600">{pendingCount} pending orders</p>
            </div>
            <div className="ml-2 text-sm text-gray-500">
              <span className="block text-right">{ordersLoading ? "…" : `${orders?.length ?? 0}`}</span>
              <span className="block text-xs text-gray-400">total</span>
            </div>
          </div>

          <div className="mt-3 text-xs text-gray-500">
            <span>Refresh orders and jump to processing</span>
          </div>
        </div>
      </button>
    </div>
  );
}

