import { Wallet } from "lucide-react";
import React from "react";
export default function CODSection() {
  return (
    <div className="p-6 bg-white rounded-2xl shadow-sm border border-gray-200">
      <div className="p-4 bg-orange-50 border border-orange-200 rounded-xl">
        <div className="flex gap-3">
          <Wallet size={20} className="text-orange-600" />
          <div>
            <p className="font-semibold text-gray-900">Cash on Delivery</p>
            <p className="text-sm text-gray-600">
              Pay with cash when your order arrives. Please keep exact change ready.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
