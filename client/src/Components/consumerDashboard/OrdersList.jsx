import React from "react";
import OrderCard from "./OrderCard";

export default function OrdersList({ orders }) {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 border rounded-xl">
        <p className="text-gray-600 text-sm">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}
