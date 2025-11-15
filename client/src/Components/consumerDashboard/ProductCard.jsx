import { ShoppingBag, Star } from "lucide-react";
import React from "react";

export default function ProductCard({ product }) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow w-full">

      {/* Responsive Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-36 sm:h-40 md:h-48 object-cover"
      />

      <div className="p-3 sm:p-4">
        {/* Distance + Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] sm:text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {product.distance}
          </span>

          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{product.rating}</span>
          </div>
        </div>

        {/* Name + Farmer */}
        <h4 className="font-semibold text-gray-900 text-sm sm:text-base leading-tight">
          {product.name}
        </h4>
        <p className="text-[11px] sm:text-xs text-gray-600 mb-2">
          {product.farmer}
        </p>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-1">
            <span className="text-base sm:text-lg font-bold">
              ₹{product.price}
            </span>
            <span className="text-xs sm:text-sm text-gray-500">/{product.unit}</span>
          </div>

          <button className="p-2 sm:p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <ShoppingBag size={16} className="sm:w-5 sm:h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
