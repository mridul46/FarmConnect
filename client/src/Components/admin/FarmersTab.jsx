import React from "react";
import topFarmers from "../../assets/topFarmers"

export default function FarmersTab() {
  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Top Performing Farmers</h3>

      <div className="space-y-4">
        {topFarmers.map((farmer) => (
          <div key={farmer.rank} className="p-5 border rounded-xl hover:shadow-md transition">
            <div className="flex items-center gap-4">

              {/* Rank Badge */}
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                  farmer.rank === 1
                    ? "bg-linear-to-r from-yellow-400 to-yellow-600"
                    : farmer.rank === 2
                    ? "bg-linear-to-r from-gray-400 to-gray-600"
                    : farmer.rank === 3
                    ? "bg-linear-to-r from-orange-400 to-orange-600"
                    : "bg-linear-to-r from-blue-400 to-blue-600"
                }`}
              >
                #{farmer.rank}
              </div>

              {/* Farmer Info */}
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <p className="font-semibold text-gray-900 text-lg">{farmer.name}</p>
                    <p className="text-sm text-gray-600">{farmer.owner}</p>
                  </div>

                  <div className="flex items-center gap-1">
                    <span className="text-yellow-500">★</span>
                    <span className="font-semibold">{farmer.rating}</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500">Total Orders</p>
                    <p className="font-semibold">{farmer.orders}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Revenue</p>
                    <p className="font-semibold text-green-600">{farmer.revenue}</p>
                  </div>

                  <div>
                    <p className="text-gray-500">Products</p>
                    <p className="font-semibold">{farmer.products}</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
