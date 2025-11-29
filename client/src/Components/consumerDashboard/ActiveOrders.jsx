
import React from "react";
import OrderCard from "./OrderCard";

export default function ActiveOrders({ recentOrders = [] }) {
  // Normalize backend + fallback
  const orders = Array.isArray(recentOrders) ? recentOrders : [];

  // Active orders = NOT delivered or cancelled
  const active = orders.filter(
    (o) =>
      o?.status &&
      !["delivered", "cancelled", "canceled"].includes(o.status.toLowerCase())
  );

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Orders</h3>
        <button className="text-green-600 text-sm font-medium hover:text-green-700">
          View All
        </button>
      </div>

      {/* Active Orders List */}
      <div className="space-y-4">
        {active.length > 0 ? (
          active.map((order) => (
            <OrderCard
              key={order._id || order.id} // ← FIXED: Works with MongoDB
              order={order}
            />
          ))
        ) : (
          <div className="text-center py-6 border border-gray-200 rounded-xl bg-gray-50">
            <p className="text-gray-600 text-sm">No active orders right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}
