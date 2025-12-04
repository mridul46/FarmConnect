// src/components/Products/PaginatedProducts.jsx
import React, { useMemo, useState } from "react";
import ProductCard from "./ProductCard";

export default function PaginatedProducts({
  products = [],
  onViewDetails,
  onAddToCart,
  onChat,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  const totalPages = Math.max(1, Math.ceil(products.length / pageSize));

  const pageProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return products.slice(start, start + pageSize);
  }, [products, currentPage]);

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };

  if (!products.length) {
    return (
      <div className="py-10 text-center text-gray-500">
        No products found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Product cards grid */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {pageProducts.map((p) => {
          const id = p._id || p.id;
          return (
            <ProductCard
              key={id}
              product={p}
              onViewDetails={() => onViewDetails?.(id)}
              onAddToCart={() => onAddToCart?.(p)}
              onChat={() =>
                onChat?.(p.farmerId || p.farmer?._id || p.farmerId?._id)
              }
            />
          );
        })}
      </div>

      {/* Pagination controls (same as before) */}
      <div className="flex items-center justify-center gap-2 pt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-sm rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Prev
        </button>

        {Array.from({ length: totalPages }).map((_, idx) => {
          const page = idx + 1;
          const isActive = page === currentPage;
          return (
            <button
              key={page}
              onClick={() => goToPage(page)}
              className={`px-3 py-1 text-sm rounded-lg border ${
                isActive
                  ? "bg-green-600 text-white border-green-600"
                  : "border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {page}
            </button>
          );
        })}

        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-sm rounded-lg border border-gray-200 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Next
        </button>
      </div>
    </div>
  );
}
