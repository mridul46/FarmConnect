import React from "react";
import { Edit, Eye } from "lucide-react";


export default function OrdersTable({ orders, getStatusColor }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Orders</h3>

        <select className="px-4 py-2 border rounded-lg text-sm">
          <option>All Orders</option>
          <option>Pending</option>
          <option>Preparing</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Qty</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4 font-medium">{order.id}</td>
                <td className="py-4 px-4">{order.customer}</td>
                <td className="py-4 px-4">{order.product}</td>
                <td className="py-4 px-4">{order.quantity}</td>
                <td className="py-4 px-4 font-semibold">{order.amount}</td>

                <td className="py-4 px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status.replace("_", " ")}
                  </span>
                </td>

                <td className="py-4 px-4 flex gap-2">
                  <button className="p-2 hover:bg-green-100 rounded-lg">
                    <Eye size={16} className="text-green-600" />
                  </button>

                  <button className="p-2 hover:bg-blue-100 rounded-lg">
                    <Edit size={16} className="text-blue-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
