import { MapPin, Edit2, Check } from "lucide-react";
import React from "react";
export default function DeliveryAddress() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <MapPin size={20} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Delivery Address</h2>
            <p className="text-sm text-gray-500">Where should we deliver?</p>
          </div>
        </div>

        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Edit2 size={18} className="text-gray-600" />
        </button>
      </div>

      <div className="p-6">

        <div className="flex items-start gap-4 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <Check size={16} className="text-white" />
          </div>

          <div>
            <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs rounded-full mb-2">
              Primary
            </span>

            <p className="font-semibold text-gray-900">Home</p>

            <p className="text-sm text-gray-600 leading-relaxed">
              John Doe <br />
              123, MG Road, Koramangala <br />
              Bangalore, Karnataka 560034 <br />
              Phone: +91 98765 43210
            </p>
          </div>
        </div>

        <button className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-green-500 hover:text-green-600 transition-colors">
          + Add New Address
        </button>
      </div>
    </div>
  );
}
