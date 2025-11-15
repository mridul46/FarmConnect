import React from "react";
import { Search } from "lucide-react";

export default function Header() {
  return (
    <div className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Title Section */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            My Dashboard
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">
            Welcome back, John! 🎉
          </p>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <button className="w-full sm:w-auto px-4 py-2 border rounded-xl flex items-center justify-center sm:justify-start gap-2 text-sm sm:text-base hover:bg-gray-50 transition-colors">
            <Search size={18} /> Browse Products
          </button>

          <button className="w-full sm:w-auto px-4 py-2 rounded-xl bg-green-600 text-white text-sm sm:text-base hover:bg-green-700 transition-colors">
            View Cart (2)
          </button>
        </div>
      </div>
    </div>
  );
}
