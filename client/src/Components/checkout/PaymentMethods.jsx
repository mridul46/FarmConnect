import { Wallet, CreditCard, Building2 } from "lucide-react";
import React from "react";
export default function PaymentMethods({ paymentMethod, setPaymentMethod }) {
  const methods = [
    {
      value: "upi",
      icon: <Wallet size={20} className="text-gray-600" />,
      title: "UPI",
      subtitle: "Pay using GPay, PhonePe, Paytm",
    },
    {
      value: "card",
      icon: <CreditCard size={20} className="text-gray-600" />,
      title: "Credit/Debit Card",
      subtitle: "Visa, Mastercard, Rupay",
    },
    {
      value: "netbanking",
      icon: <Building2 size={20} className="text-gray-600" />,
      title: "Net Banking",
      subtitle: "All major banks supported",
    },
  ];

  return (
    <div className="p-6 space-y-3 bg-white rounded-2xl shadow-sm border border-gray-200">
      {methods.map((m) => (
        <label
          key={m.value}
          className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer
            ${paymentMethod === m.value ? "border-green-600 bg-green-50" : "border-gray-200 hover:border-gray-300"}`}
        >
          <input
            type="radio"
            name="payment"
            value={m.value}
            checked={paymentMethod === m.value}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-5 h-5 text-green-600"
          />
          {m.icon}
          <div className="flex-1">
            <p className="font-semibold">{m.title}</p>
            <p className="text-sm text-gray-600">{m.subtitle}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
