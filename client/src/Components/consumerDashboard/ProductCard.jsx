
// ProductCard.jsx
import React from "react";
import { ShoppingBag, Star } from "lucide-react";

export default function ProductCard({
  product = {},
  onAddToCart = () => {},
  onViewDetails = () => {},
  onChat = () => {}
}) {
  // normalize common fields with fallbacks
  const image =
    product.image ||
    (Array.isArray(product.images) && product.images[0]) ||
    "/placeholder-image.png"; // change to your placeholder path

  const title = product.title || product.name || "Untitled product";
  const farmer = product.farmerName || product.farmer || product.seller || "Seller";
  const price = product.pricePerUnit ?? product.price ?? 0;
  const unit = product.unit || "kg";
  const distance = product.distance ?? (product.location?.distance ?? "—");

  // rating may be a number, or an object { average, count }, or missing
  let ratingValue = "—";
  let ratingCount = 0;
  if (product.rating != null) {
    if (typeof product.rating === "number" || typeof product.rating === "string") {
      ratingValue = product.rating;
    } else if (typeof product.rating === "object") {
      ratingValue = product.rating.average ?? "—";
      ratingCount = product.rating.count ?? 0;
    }
  } else {
    // optionally normalized fields used elsewhere: ratingAverage / ratingCount
    ratingValue = product.ratingAverage ?? "—";
    ratingCount = product.ratingCount ?? product.reviews ?? 0;
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow w-full">
      {/* Responsive Image */}
      <button
        onClick={() => onViewDetails(product._id || product.id)}
        className="block w-full text-left"
        aria-label={`View ${title}`}
      >
        <img
          src={image}
          alt={title}
          className="w-full h-36 sm:h-40 md:h-48 object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = "/placeholder-image.png";
          }}
        />
      </button>

      <div className="p-3 sm:p-4">
        {/* Distance + Rating */}
        <div className="flex items-center justify-between mb-2">
          <span className="text-[10px] sm:text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
            {typeof distance === "number" ? `${distance} km` : distance}
          </span>

          <div className="flex items-center gap-1 text-xs sm:text-sm">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="font-medium">{ratingValue}</span>
            {ratingCount ? (
              <span className="text-gray-500 text-[11px] ml-1">({ratingCount})</span>
            ) : null}
          </div>
        </div>

        {/* Name + Farmer */}
        <h4
          className="font-semibold text-gray-900 text-sm sm:text-base leading-tight cursor-pointer"
          onClick={() => onViewDetails(product._id || product.id)}
        >
          {title}
        </h4>
        <p className="text-[11px] sm:text-xs text-gray-600 mb-2">{farmer}</p>

        {/* Price + Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-end gap-1">
            <span className="text-base sm:text-lg font-bold">₹{price}</span>
            <span className="text-xs sm:text-sm text-gray-500">/{unit}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onAddToCart(product)}
              className="p-2 sm:p-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              aria-label="Add to cart"
            >
              <ShoppingBag size={16} className="sm:w-5 sm:h-5" />
            </button>

            <button
              onClick={() => onChat(product)}
              title="Chat with farmer"
              className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50"
            >
              Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
