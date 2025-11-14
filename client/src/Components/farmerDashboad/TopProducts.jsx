import React from "react";
export default function TopProducts() {
  const items = [
    { rank: 1, name: "Alphonso Mangoes", sold: "200 kg", amount: "₹24,000" },
    { rank: 2, name: "Organic Tomatoes", sold: "120 kg", amount: "₹5,400" },
    { rank: 3, name: "Fresh Spinach", sold: "85 bunches", amount: "₹2,550" },
    { rank: 4, name: "Premium Basmati Rice", sold: "65 kg", amount: "₹5,525" },
  ];

  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.rank} className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-r from-green-400 to-emerald-400 text-white flex items-center justify-center rounded-lg font-bold">
              {item.rank}
            </div>

            <div className="flex-1">
              <p className="font-medium text-gray-900">{item.name}</p>
              <p className="text-sm text-gray-600">{item.sold} sold</p>
            </div>

            <span className="font-semibold">{item.amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
