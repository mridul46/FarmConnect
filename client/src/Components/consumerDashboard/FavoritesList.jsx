// src/components/consumerDashboard/FavoritesList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductContext } from "../../Context/productsContext"; 


export default function FavoritesList({ favorites = [], onRemoveFavorite }) {
  const navigate = useNavigate();
  const { addToCart, fetchProductById } = useProductContext();

  const [loadingMap, setLoadingMap] = useState({});
  const [items, setItems] = useState([]);

  const setItemLoading = (id, key, val) =>
    setLoadingMap((m) => ({ ...(m || {}), [id]: { ...(m[id] || {}), [key]: val } }));

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      const resolved = await Promise.all(
        (favorites || []).map(async (p) => {
          if (!p) return null;
          if (typeof p === "string") {
            try {
              const meta = await fetchProductById(p).catch(() => null);
              return meta ? { id: p, meta } : { id: p, meta: null };
            } catch {
              return { id: p, meta: null };
            }
          }
          const id = p._id || p.id || null;
          return { id, meta: p };
        })
      );
      if (!mounted) return;
      setItems(resolved.filter(Boolean));
    };

    load();
    return () => {
      mounted = false;
    };
  }, [favorites, fetchProductById]);

  const handleAddToCart = async (item) => {
    const id = item?.id || item?.meta?._id || item?.meta?.id;
    if (!id) {
      toast.error("Unable to identify product");
      return;
    }
    if (loadingMap[id]?.adding) return;
    setItemLoading(id, "adding", true);
    try {
      await addToCart(id, 1);
      toast.success("Added to cart");
    } catch (err) {
      console.error("Add to cart failed:", err);
      toast.error(err?.response?.data?.message || "Failed to add to cart");
    } finally {
      setItemLoading(id, "adding", false);
    }
  };

  const handleRemove = async (id) => {
    if (!id) return;
    if (loadingMap[id]?.removing) return;
    const confirmed = window.confirm("Remove this product from favorites?");
    if (!confirmed) return;
    setItemLoading(id, "removing", true);
    try {
      if (typeof onRemoveFavorite === "function") {
        await Promise.resolve(onRemoveFavorite(id));
        toast.success("Removed from favorites");
      } else {
        setItems((prev) => prev.filter((it) => it.id !== id));
        toast.success("Removed from favorites");
      }
    } catch (err) {
      console.error("Remove favorite failed:", err);
      toast.error("Failed to remove favorite");
    } finally {
      setItemLoading(id, "removing", false);
    }
  };

  const openDetails = (item) => {
    const id = item?.id || item?.meta?._id || item?.meta?.id;
    if (!id) return;
    navigate(`/view-details/${id}`);
  };

  if (!Array.isArray(items) || items.length === 0) {
    return (
      <div className="text-center py-8 bg-gray-50 border rounded-xl">
        <p className="text-gray-600 text-sm">No favorites saved yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {items.map((entry) => {
        const id = entry.id;
        const p = entry.meta || {};
        const image = (p.images && p.images[0]) || p.image || "";
        const name = p.title || p.name || "Untitled product";
        const farmer = p.farmerName || (p.farmer && (p.farmer.name || p.farmer)) || "Seller";
        const price = p.pricePerUnit ?? p.price ?? 0;
        const unit = p.unit || "kg";
        const stockQty = p.stockQuantity ?? p.stock ?? 0;
        const inStock = Number(stockQty) > 0;

        const isAdding = loadingMap[id]?.adding;
        const isRemoving = loadingMap[id]?.removing;

        return (
          <div
            key={id || name}
            className="p-4 border rounded-xl flex flex-col sm:flex-row gap-4 hover:shadow-md transition-shadow bg-white"
          >
            <div
              onClick={() => openDetails(entry)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && openDetails(entry)}
              className="w-full sm:w-24 h-32 sm:h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0 cursor-pointer"
            >
              {image ? (
                <img src={image} alt={`Image of ${name}`} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                  No image
                </div>
              )}
            </div>

            <div className="flex-1 flex flex-col">
              <h4 onClick={() => openDetails(entry)} className="font-semibold text-gray-900 text-base sm:text-lg line-clamp-2 cursor-pointer" title={name}>
                {name}
              </h4>

              <p className="text-sm text-gray-600">{farmer}</p>

              <div className="flex items-center justify-between mt-3">
                <div>
                  <span className="text-lg font-bold text-gray-900">₹{price}</span>
                  <span className="text-xs sm:text-sm text-gray-500 ml-1">/{unit}</span>
                </div>

                <span className={`px-2 py-1 text-xs rounded-full whitespace-nowrap ${inStock ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                  {inStock ? `In Stock (${stockQty})` : "Out of Stock"}
                </span>
              </div>

              <div className="mt-3 flex gap-2">
                <button onClick={() => handleAddToCart(entry)} disabled={!inStock || isAdding} className={`flex-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors flex items-center justify-center ${!inStock ? "opacity-60 cursor-not-allowed" : ""}`}>
                  {isAdding ? "Adding…" : "Add to Cart"}
                </button>

                <button onClick={() => handleRemove(id)} disabled={isRemoving} className="px-3 py-2 border rounded-lg text-sm text-gray-700 hover:bg-gray-50">
                  {isRemoving ? "Removing…" : "Remove"}
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
