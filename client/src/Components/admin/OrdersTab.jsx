import React from "react";
import { Eye } from "lucide-react";
import recentOrders from "../../assets/recentOrders";

export default function OrdersTab() {
  const getStatusColor = (status) => {
    const colors = {
      delivered: "bg-green-100 text-green-700 border-green-200",
      out_for_delivery: "bg-blue-100 text-blue-700 border-blue-200",
      preparing: "bg-purple-100 text-purple-700 border-purple-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    };
    return colors[status] || colors.pending;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Orders</h3>

        <select className="px-4 py-2 border rounded-lg text-sm">
          <option>All Status</option>
          <option>Pending</option>
          <option>Preparing</option>
          <option>Out for Delivery</option>
          <option>Delivered</option>
        </select>
      </div>

      <div className="space-y-4">
        {recentOrders.map((order) => (
          <div key={order.id} className="p-4 border rounded-xl hover:shadow-md transition">
            <div className="flex items-center justify-between">

              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <p className="font-semibold text-gray-900">{order.id}</p>

                  <span className={`px-3 py-1 text-xs rounded-full border font-medium ${getStatusColor(order.status)}`}>
                    {order.status.replace("_", " ")}
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Customer</p>
                    <p className="font-medium text-gray-900">{order.customer}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Farmer</p>
                    <p className="font-medium text-gray-900">{order.farmer}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Items</p>
                    <p className="font-medium text-gray-900">{order.items} items</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Amount</p>
                    <p className="text-green-600 font-semibold">{order.amount}</p>
                  </div>
                </div>
              </div>

              <button className="p-2 hover:bg-blue-100 rounded-lg">
                <Eye size={18} className="text-blue-600" />
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
