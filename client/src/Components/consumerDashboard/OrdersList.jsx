
// components/consumerDashboard/OrdersList.jsx
import React, { useEffect } from "react";
import OrderCard from "./OrderCard";
import { useProductContext } from "../../Context/productsContext"; // adjust path if needed

export default function OrdersList({ orders: propOrders } = {}) {
  const {
    orders: ctxOrders,
    ordersLoading,
    ordersError,
    getUserOrders,
    refreshOrders
  } = useProductContext();

  // If parent passed orders prop use that, otherwise use context orders
  const orders = Array.isArray(propOrders) ? propOrders : Array.isArray(ctxOrders) ? ctxOrders : [];

  // load user orders if context has none yet (defensive)
  useEffect(() => {
    if (!propOrders && (!ctxOrders || ctxOrders.length === 0)) {
      // fetch and ignore errors here (context stores errors)
      getUserOrders().catch(() => {});
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [propOrders, ctxOrders, getUserOrders]);

  if (ordersLoading && (!orders || orders.length === 0)) {
    return (
      <div className="p-6 bg-white rounded-xl shadow text-center">
        <p className="text-lg font-medium">Loading orders…</p>
      </div>
    );
  }

  if (ordersError && (!orders || orders.length === 0)) {
    return (
      <div className="p-6 bg-white rounded-xl shadow text-center">
        <p className="text-lg font-medium text-red-600">Failed to load orders</p>
        <p className="text-sm text-gray-600 mt-2">{String(ordersError)}</p>
        <div className="mt-4">
          <button
            onClick={() => refreshOrders().catch(() => {})}
            className="px-4 py-2 rounded-xl border"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 border rounded-xl">
        <p className="text-gray-600 text-sm">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {orders.map((order) => {
        // normalize id for key & OrderCard
        const key = order._id || order.id || order.orderId || JSON.stringify(order);
        // ensure order is object (defensive); OrderCard itself is defensive too
        const safeOrder = typeof order === "object" && order !== null ? order : { id: key };

        return <OrderCard key={key} order={safeOrder} />;
      })}
    </div>
  );
}
