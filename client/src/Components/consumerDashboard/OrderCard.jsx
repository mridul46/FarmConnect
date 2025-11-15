import React from "react";
import StatusBadge from "./StatusBadge";
import { Clock, MessageCircle } from "lucide-react";

export default function OrderCard({ order }) {
  return (
    <div className="p-4 border rounded-xl hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <img
          src={order.image}
          alt={order.id}
          className="w-full sm:w-20 h-32 sm:h-20 rounded-lg object-cover"
        />

        {/* Order Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <p className="font-semibold text-base">{order.id}</p>
              <p className="text-sm text-gray-600 wrap-break-word">{order.farmer}</p>
            </div>

            <div className="sm:shrink-0">
              <StatusBadge status={order.status} />
            </div>
          </div>

          {/* Order Items */}
          <p className="text-sm mt-1 text-gray-700 wrap-break-word">
            {order.items.join(", ")}
          </p>

          {/* Date & Amount */}
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">{order.date}</span>
            <span className="font-semibold">{order.amount}</span>
          </div>

          {/* Delivery Time */}
          <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
            <Clock size={14} />
            <span className="wrap-break-word">{order.estimatedDelivery}</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 pt-3 border-t flex flex-col sm:flex-row gap-2">
        <button className="w-full sm:flex-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
          Track Order
        </button>

        <button className="w-full sm:w-auto py-2 px-4 border rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-gray-50 transition-colors">
          <MessageCircle size={16} /> Chat
        </button>
      </div>
    </div>
  );
}
