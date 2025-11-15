import { CreditCard, Wallet } from "lucide-react";
import React from "react";
export default function PaymentProvider({ selectedPayment, setSelectedPayment }) {
  const buttons = [
    { key: "razorpay", color: "bg-blue-600", icon: <CreditCard size={20} className="text-white" /> },
    { key: "stripe", color: "bg-purple-600", icon: <CreditCard size={20} className="text-white" /> },
    { key: "cod", color: "bg-orange-600", icon: <Wallet size={20} className="text-white" /> },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">

      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
          <CreditCard size={20} className="text-purple-600" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
          <p className="text-sm text-gray-500">Choose how you want to pay</p>
        </div>
      </div>

      <div className="p-6 grid grid-cols-3 gap-3">
        {buttons.map((btn) => (
          <button
            key={btn.key}
            onClick={() => setSelectedPayment(btn.key)}
            className={`p-4 rounded-xl border-2 transition-all ${
              selectedPayment === btn.key
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className={`w-10 h-10 ${btn.color} rounded-lg mx-auto mb-2 flex items-center justify-center`}>
              {btn.icon}
            </div>
            <p className="text-sm font-medium">{btn.key.toUpperCase()}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
