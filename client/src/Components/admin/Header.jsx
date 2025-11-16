import React from "react";
import { Download } from "lucide-react";

export default function Header({ selectedTimeRange, setSelectedTimeRange }) {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">FarmConnect Platform Management</p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedTimeRange}
            onChange={(e) => setSelectedTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg text-sm"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>

          <button className="px-5 py-2.5 border rounded-xl flex items-center gap-2 bg-white">
            <Download size={18} />
            Export Report
          </button>
        </div>
      </div>
    </div>
  );
}
