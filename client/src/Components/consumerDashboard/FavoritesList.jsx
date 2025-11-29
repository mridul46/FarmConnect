

import React from "react";
import { useProductContext } from "../../Context/productsContext"; // adjust path if needed

export default function FavoritesList({ favorites = [], onRemoveFavorite }) {
  const { addToCart } = useProductContext();

  if (!Array.isArray(favorites) || favorites.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 border rounded-xl">
        <p className="text-gray-600 text-sm">No favorites saved yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {favorites.map((product) => {
        // Normalize backend + mock fields
        const id = product._id || product.id;
        const image =
          (product.images && product.images[0]) || product.image || "";
        const name = product.title || product.name || "Untitled product";
        const farmer = product.farmerName || product.farmer || "Seller";
        const price = product.pricePerUnit ?? product.price ?? 0;
        const unit = product.unit || "kg";
        const stockQty = product.stockQuantity ?? product.stock ?? 0;
        const inStock = Number(stockQty) > 0;

        return (
          <div
            key={id}
            className="p-4 border rounded-xl flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow bg-white"
          >
            {/* Image */}
            <div className="w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
              {image ? (
                <img
                  src={image}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                  No image
                </div>
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col">
              <h4 className="font-semibold text-gray-900 text-base sm:text-lg line-clamp-2">
                {name}
              </h4>
              <p className="text-sm text-gray-600">{farmer}</p>

              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-lg font-bold text-gray-900">
                    ₹{price}
                  </span>
                  <span className="text-xs sm:text-sm text-gray-500 ml-1">
                    /{unit}
                  </span>
                </div>

                <span
                  className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                    inStock
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {inStock ? `In Stock (${stockQty})` : "Out of Stock"}
                </span>
              </div>

              {/* Buttons */}
              <div className="mt-3 flex gap-2">
                {/* Add to Cart */}
                <button
                  onClick={() => addToCart && addToCart(id, 1)}
                  disabled={!inStock}
                  className={`flex-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center ${
                    !inStock ? "opacity-60 cursor-not-allowed" : ""
                  }`}
                >
                  Add to Cart
                </button>

                {/* Remove from favorites */}
                <button
                  onClick={() => onRemoveFavorite && onRemoveFavorite(id)}
                  className="px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
