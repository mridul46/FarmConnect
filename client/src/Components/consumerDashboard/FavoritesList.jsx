import React from "react";

export default function FavoritesList({ favorites }) {
  if (!favorites || favorites.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 border rounded-xl">
        <p className="text-gray-600 text-sm">No favorites saved yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {favorites.map((product) => (
        <div
          key={product.id}
          className="p-4 border rounded-xl flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow bg-white"
        >
          {/* Image */}
          <img
            src={product.image}
            alt={product.name}
            className="w-full sm:w-24 h-32 sm:h-24 rounded-lg object-cover"
          />

          {/* Content */}
          <div className="flex-1 flex flex-col">
            <h4 className="font-semibold text-gray-900 text-base sm:text-lg">
              {product.name}
            </h4>
            <p className="text-sm text-gray-600">{product.farmer}</p>

            <div className="flex items-center justify-between mt-3">
              <span className="text-lg font-bold text-gray-900">
                ₹{product.price}
              </span>

              <span
                className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${
                  product.stock === "In Stock"
                    ? "bg-green-100 text-green-700"
                    : "bg-orange-100 text-orange-700"
                }`}
              >
                {product.stock}
              </span>
            </div>

            <button className="w-full py-2 mt-3 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
