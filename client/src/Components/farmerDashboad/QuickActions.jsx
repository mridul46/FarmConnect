import React from "react";
import { Package, TrendingUp, ShoppingBag } from "lucide-react";

export default function QuickActions() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all text-left">
        <Package className="text-green-600 mb-2" size={24} />
        <p className="font-semibold text-gray-900">Update Stock</p>
        <p className="text-sm text-gray-600">Manage inventory levels</p>
      </button>

      <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all text-left">
        <TrendingUp className="text-blue-600 mb-2" size={24} />
        <p className="font-semibold text-gray-900">View Analytics</p>
        <p className="text-sm text-gray-600">Check sales performance</p>
      </button>

      <button className="p-4 border-2 border-dashed border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all text-left">
        <ShoppingBag className="text-purple-600 mb-2" size={24} />
        <p className="font-semibold text-gray-900">Process Orders</p>
        <p className="text-sm text-gray-600">8 pending orders</p>
      </button>
    </div>
  );
}
