import React from "react";
import { Activity, TrendingUp, UserCheck, BarChart3 } from "lucide-react";

export default function OverviewTab() {
  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Active Today */}
        <div className="p-4 bg-linear-to-br from-green-50 to-emerald-50 rounded-xl border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-green-700">Active Today</span>
            <Activity size={20} className="text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">1,847</p>
          <p className="text-xs text-green-600 mt-1">↑ 23% from yesterday</p>
        </div>

        {/* Pending Approvals */}
        <div className="p-4 bg-linear-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-700">Pending Approvals</span>
            <UserCheck size={20} className="text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">23</p>
          <p className="text-xs text-blue-600 mt-1">Farmers awaiting verification</p>
        </div>

        {/* Revenue Today */}
        <div className="p-4 bg-linear-to-br from-purple-50 to-pink-50 rounded-xl border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-purple-700">Revenue Today</span>
            <TrendingUp size={20} className="text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">₹28,450</p>
          <p className="text-xs text-purple-600 mt-1">↑ 15.2% from yesterday</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Revenue Trend */}
        <div className="p-6 border border-gray-200 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4">Revenue Trend</h4>
          <div className="h-48 flex items-center justify-center bg-linear-to-br from-green-50 to-emerald-50 rounded-lg">
            <div className="text-center">
              <BarChart3 size={48} className="text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Chart visualization</p>
            </div>
          </div>
        </div>

        {/* User Growth */}
        <div className="p-6 border border-gray-200 rounded-xl">
          <h4 className="font-semibold text-gray-900 mb-4">User Growth</h4>
          <div className="h-48 flex items-center justify-center bg-linear-to-br from-blue-50 to-cyan-50 rounded-lg">
            <div className="text-center">
              <TrendingUp size={48} className="text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Chart visualization</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
