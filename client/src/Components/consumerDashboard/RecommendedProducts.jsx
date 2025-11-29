
// components/consumerDashboard/RecommendedProducts.jsx
import React, { useMemo } from "react";
import ProductCard from "./ProductCard";
import { useProductContext } from "../../Context/productsContext";
import { useNavigate } from "react-router-dom";

const PLACEHOLDER =
  "https://via.placeholder.com/400x300.png?text=No+image";

export default function RecommendedProducts({ products: propProducts } = {}) {
  const navigate = useNavigate();
  const { allProducts = [], productsLoading } = useProductContext();

  // Prefer propProducts (parent-provided). Otherwise derive recommendations from context.
  const sourceProducts = Array.isArray(propProducts) ? propProducts : Array.isArray(allProducts) ? allProducts : [];

  // Normalize and pick top-rated recommendations (defensive)
  const recommended = useMemo(() => {
    const normalized = (sourceProducts || []).map((p) => {
      // p might be a product from backend or already a UI-shape product; normalize both.
      const id = p._id ?? p.id ?? p.orderId ?? String(Math.random());
      const image = (p.images && p.images[0]) || p.image || PLACEHOLDER;
      const name = p.title ?? p.name ?? p.productName ?? "Product";
      const farmer = p.farmerName ?? (p.farmer && (p.farmer.name || p.farmer.fullName)) ?? p.seller ?? "Seller";
      const price = p.pricePerUnit ?? p.price ?? p.amount ?? 0;
      const unit = p.unit ?? "kg";
      const distance = typeof p.distance !== "undefined" ? p.distance : (p.locationDistance || "-");
      const rating = p.ratingAverage ?? p.rating ?? p.displayRating ?? "—";

      return { id, image, name, farmer, price, unit, distance, rating, raw: p };
    });

    // If prop passed explicitly, return it (but still normalized)
    if (Array.isArray(propProducts) && propProducts.length > 0) {
      return normalized;
    }

    // Otherwise sort by rating desc, then by newest (if available), limit 8
    return normalized
      .slice()
      .sort((a, b) => {
        const ra = typeof a.rating === "number" ? a.rating : parseFloat(a.rating) || 0;
        const rb = typeof b.rating === "number" ? b.rating : parseFloat(b.rating) || 0;
        if (rb !== ra) return rb - ra;
        // fallback: if raw has createdAt, newer first
        const ad = new Date(a.raw?.createdAt || 0).getTime();
        const bd = new Date(b.raw?.createdAt || 0).getTime();
        return bd - ad;
      })
      .slice(0, 8);
  }, [sourceProducts, propProducts]);

  const handleSeeMore = () => {
    navigate("/products");
  };

  if (productsLoading && recommended.length === 0) {
    return (
      <div className="p-6 bg-white rounded-2xl border shadow-sm text-center">
        <p className="text-sm text-gray-600">Loading recommendations…</p>
      </div>
    );
  }

  if (!recommended || recommended.length === 0) {
    return (
      <div className="p-6 bg-white rounded-2xl border text-center text-sm text-gray-500">
        No recommendations available right now.
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base sm:text-lg font-semibold">Recommended for You</h3>

        <button onClick={handleSeeMore} className="text-green-600 text-xs sm:text-sm hover:underline">
          See More
        </button>
      </div>

      {/* Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {recommended.map((p) => (
          <ProductCard
            key={p.id}
            product={{
              // ProductCard expects fields: image, name, farmer, price, unit, distance, rating, id
              image: p.image,
              name: p.name,
              farmer: p.farmer,
              price: p.price,
              unit: p.unit,
              distance: p.distance,
              rating: p.rating,
              id: p.id
            }}
          />
        ))}
      </div>
    </div>
  );
}
