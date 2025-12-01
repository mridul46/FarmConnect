import React, { useEffect, useState } from "react";
import { CheckCircle, ShoppingBag, AlertCircle } from "lucide-react";
import { useProductContext } from "../../Context/productsContext"; // adjust path if needed

export default function RecentActivity() {
  const { orders, getFarmerOrders, allProducts } = useProductContext();

  const [activities, setActivities] = useState([]);

  // Convert order status to readable labels + icon meta
  const statusMap = {
    delivered: {
      bg: "bg-green-50 border-green-100",
      iconBg: "bg-green-600",
      Icon: CheckCircle,
      label: "Order delivered",
    },
    completed: {
      bg: "bg-green-50 border-green-100",
      iconBg: "bg-green-600",
      Icon: CheckCircle,
      label: "Order completed",
    },
    pending: {
      bg: "bg-blue-50 border-blue-100",
      iconBg: "bg-blue-600",
      Icon: ShoppingBag,
      label: "New order received",
    },
    preparing: {
      bg: "bg-blue-50 border-blue-100",
      iconBg: "bg-blue-600",
      Icon: ShoppingBag,
      label: "Order preparing",
    }
  };

  // Convert timestamp → "time ago"
  const timeAgo = (dateString) => {
    if (!dateString) return "Just now";
    const diff = Date.now() - new Date(dateString).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs} hours ago`;
    const days = Math.floor(hrs / 24);
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  useEffect(() => {
    // Build activity feed
    const list = [];

    // -----------------------------
    // ORDERS ACTIVITY
    // -----------------------------
    const recentOrders = Array.isArray(orders) && orders.length
      ? orders
      : []; // fallback empty

    recentOrders.forEach((o) => {
      const status = String(o.status).toLowerCase();
      const meta = statusMap[status];
      if (!meta) return;

      list.push({
        type: "order",
        title: meta.label,
        message: `${o?.customerName || "Customer"} ordered ${o?.items?.[0]?.name || "items"}`,
        amount: o.totalAmount ? `₹${o.totalAmount}` : null,
        time: timeAgo(o.createdAt),
        ...meta
      });
    });

    // -----------------------------
    // LOW STOCK ACTIVITY
    // -----------------------------
    allProducts
      ?.filter((p) => p.stock !== undefined && p.stock < 10)
      .forEach((p) => {
        list.push({
          type: "low-stock",
          title: "Low stock alert",
          message: `${p.name} - only ${p.stock} left`,
          iconBg: "bg-orange-600",
          bg: "bg-orange-50 border-orange-100",
          Icon: AlertCircle,
          time: "Recently",
        });
      });

    // Sort by newest (orders have timestamps)
    const sorted = list.sort((a, b) => (a.rawTime || 0) < (b.rawTime || 0) ? 1 : -1);

    setActivities(sorted);
  }, [orders, allProducts, getFarmerOrders]);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

      {activities.length === 0 ? (
        <p className="text-sm text-gray-500">No recent activity.</p>
      ) : (
        <div className="space-y-3">
          {activities.map((a, i) => {
            const Icon = a.Icon;
            return (
              <div
                key={i}
                className={`flex items-start gap-4 p-4 rounded-xl border ${a.bg}`}
              >
                <div className={`w-10 h-10 ${a.iconBg} rounded-full flex items-center justify-center`}>
                  <Icon size={20} className="text-white" />
                </div>

                <div>
                  <p className="font-medium text-gray-900">{a.title}</p>
                  <p className="text-sm text-gray-600">{a.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{a.time}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
