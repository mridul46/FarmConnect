import { Truck } from "lucide-react";
import React from "react";
export default function DeliveryOptions() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
          <Truck size={20} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">
            Delivery Options
          </h2>
          <p className="text-sm text-gray-500">Choose your preferred delivery time</p>
        </div>
      </div>

      <div className="p-6 space-y-3">
        
        <label className="flex items-center gap-4 p-4 border-2 border-green-600 bg-green-50 rounded-xl">
          <input type="radio" name="delivery" defaultChecked className="w-5 h-5" />
          <div className="flex-1">
            <p className="font-semibold">Express Delivery</p>
            <p className="text-sm text-gray-600">Today, 5:00 PM - 7:00 PM</p>
          </div>
          <span className="font-bold text-green-600">FREE</span>
        </label>

        <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300">
          <input type="radio" name="delivery" className="w-5 h-5" />
          <div className="flex-1">
            <p className="font-semibold">Standard Delivery</p>
            <p className="text-sm text-gray-600">Tomorrow, 10:00 AM - 12:00 PM</p>
          </div>
          <span className="font-bold">FREE</span>
        </label>

        <label className="flex items-center gap-4 p-4 border-2 border-gray-200 rounded-xl hover:border-gray-300">
          <input type="radio" name="delivery" className="w-5 h-5" />
          <div className="flex-1">
            <p className="font-semibold">Scheduled Delivery</p>
            <p className="text-sm text-gray-600">Choose your date & time</p>
          </div>
          <span className="font-bold">FREE</span>
        </label>

      </div>
    </div>
  );
}
