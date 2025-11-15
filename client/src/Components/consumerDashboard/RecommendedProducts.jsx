import React from "react";
import ProductCard from "./ProductCard";

export default function RecommendedProducts({ products }) {
  return (
    <div className="w-full">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold">
          Recommended for You
        </h3>

        <button className="text-green-600 text-xs sm:text-sm hover:underline">
          See More
        </button>
      </div>

      {/* Responsive Grid */}
      <div className="
        grid 
        grid-cols-1 
        sm:grid-cols-2 
        md:grid-cols-3 
        lg:grid-cols-4
        gap-4
      ">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </div>
  );
}
