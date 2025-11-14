import React from "react";
import { CheckCircle, ShoppingBag, AlertCircle } from "lucide-react";

export default function RecentActivity() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>

      <div className="space-y-3">
        <div className="flex items-start gap-4 p-4 bg-green-50 rounded-xl border border-green-100">
          <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center">
            <CheckCircle size={20} className="text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Order #ORD-1231 completed</p>
            <p className="text-sm text-gray-600">Sneha Patel received eggs - ₹180</p>
            <p className="text-xs text-gray-500 mt-1">1 day ago</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
          <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
            <ShoppingBag size={20} className="text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">New order received</p>
            <p className="text-sm text-gray-600">Amit Kumar ordered tomatoes - ₹225</p>
            <p className="text-xs text-gray-500 mt-1">10 min ago</p>
          </div>
        </div>

        <div className="flex items-start gap-4 p-4 bg-orange-50 rounded-xl border border-orange-100">
          <div className="w-10 h-10 bg-orange-600 rounded-full flex items-center justify-center">
            <AlertCircle size={20} className="text-white" />
          </div>
          <div>
            <p className="font-medium text-gray-900">Low stock alert</p>
            <p className="text-sm text-gray-600">Fresh Spinach - 8 left</p>
            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
          </div>
        </div>
      </div>
    </div>
  );
}
