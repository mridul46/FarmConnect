import React from "react";
import { TrendingUp } from "lucide-react";

export default function EarningsCard() {
  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Earnings This Month</h3>

      <div className="h-64 flex items-center justify-center bg-green-50 rounded-xl">
        <div className="text-center">
          <TrendingUp size={48} className="text-green-600 mx-auto mb-3" />
          <p className="text-3xl font-bold">₹45,230</p>
          <p className="text-sm text-gray-600">+12.5% from last month</p>
        </div>
      </div>
    </div>
  );
}
