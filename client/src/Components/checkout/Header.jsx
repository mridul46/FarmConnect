import { ShoppingBag, Lock } from "lucide-react";
import React from "react";
export default function Header() {
  return (
    <div className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-linear-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
              <ShoppingBag size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Checkout</h1>
              <p className="text-sm text-gray-500">Complete your order</p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Lock size={16} className="text-green-600" />
            <span className="text-gray-600">Secure Payment</span>
          </div>

        </div>
      </div>
    </div>
  );
}
