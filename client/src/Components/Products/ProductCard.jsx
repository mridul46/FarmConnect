// src/components/ProductCard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, MapPin, User, TrendingUp, MessageCircle } from "lucide-react";
import toast from "react-hot-toast";
import { useProductContext } from "../../Context/productsContext";
import { useAuth } from "../../Context/authContext";

/**
 * ProductCard
 * - displays product info
 * - shows farmer name (from farmerId / farmer / farmerName)
 * - calculates distance between consumer and farmer/store (Haversine)
 *
 * Notes:
 * - product.location.coordinates expected as [lng, lat]
 * - consumer location is obtained in this order:
 *    1) user.location.coordinates or user.location (from auth user object)
 *    2) navigator.geolocation (asks permission)
 *    3) fallback -> no distance shown ("—")
 */

const toRad = (deg) => (deg * Math.PI) / 180;

function haversineDistanceKm(lat1, lon1, lat2, lon2) {
  // returns distance in kilometers
  const R = 6371; // Earth radius km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ProductCard({ product: initialProduct, onAddToCart: propAdd, onViewDetails: propView, onChat: propChat }) {
  const [isHovered, setIsHovered] = useState(false);
  const [consumerCoords, setConsumerCoords] = useState(null); // { lat, lng } or null
  const [computedDistanceKm, setComputedDistanceKm] = useState(null); // number or null

  const navigate = useNavigate();
  const { addToCart, fetchProductById } = useProductContext();
  const { user } = useAuth();

  const product = initialProduct || {};

  // Resolve farmer name robustly (farmerId, farmer, or fallback)
  const farmerName =
    product?.farmerId?.name ??
    product?.farmer?.name ??
    product?.farmerName ??
    product?.farmerId?.shopName ??
    "";

  // product location coords (backend uses GeoJSON: coordinates = [lng, lat])
  const productLng = product?.location?.coordinates?.[0] ?? product?.location?.lng ?? null;
  const productLat = product?.location?.coordinates?.[1] ?? product?.location?.lat ?? null;

  // quantity available
  const qtyAvailable = Number(product.stockQuantity ?? product.stock ?? Infinity);

  useEffect(() => {
    // 1) try to read consumer coords from user profile (if available)
    if (user) {
      // common shapes:
      // user.location?.coordinates -> [lng, lat]
      // user.location -> { type: 'Point', coordinates: [lng, lat] } or { lat, lng }
      // user.lat / user.lng
      const uLoc = user?.location;
      if (uLoc) {
        if (Array.isArray(uLoc.coordinates) && uLoc.coordinates.length >= 2) {
          setConsumerCoords({ lat: Number(uLoc.coordinates[1]), lng: Number(uLoc.coordinates[0]) });
          return;
        } else if (uLoc.lat != null && uLoc.lng != null) {
          setConsumerCoords({ lat: Number(uLoc.lat), lng: Number(uLoc.lng) });
          return;
        }
      }
      if (user?.lat != null && user?.lng != null) {
        setConsumerCoords({ lat: Number(user.lat), lng: Number(user.lng) });
        return;
      }
    }

    // 2) if not available, try browser geolocation (ask permission)
    if (navigator && navigator.geolocation) {
      let mounted = true;
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          if (!mounted) return;
          const { latitude, longitude } = pos.coords;
          setConsumerCoords({ lat: Number(latitude), lng: Number(longitude) });
        },
        (err) => {
          // ignore permission errors; we'll just show fallback
          // console.warn("geolocation failed", err);
        },
        { maximumAge: 1000 * 60 * 10, timeout: 5000 } // 10 min cache, 5s timeout
      );
      return () => {
        // no persistent watcher here, so nothing to cleanup
        mounted = false;
      };
    }
    // else no geolocation available -> consumerCoords remains null
  }, [user]);

  useEffect(() => {
    // Compute distance if possible
    if (consumerCoords && productLat != null && productLng != null) {
      // haversine expects lat/lon pairs
      const d = haversineDistanceKm(consumerCoords.lat, consumerCoords.lng, Number(productLat), Number(productLng));
      setComputedDistanceKm(Number.isFinite(d) ? Number(d.toFixed(1)) : null);
    } else {
      setComputedDistanceKm(null);
    }
  }, [consumerCoords, productLat, productLng]);

  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: "Out of Stock", color: "text-red-600 bg-red-50" };
    if (quantity < 10) return { text: "Low Stock", color: "text-orange-600 bg-orange-50" };
    return { text: "In Stock", color: "text-green-600 bg-green-50" };
  };

  const stockStatus = getStockStatus(qtyAvailable);

  // INTERNAL handlers use context; if parent passed handlers, call them instead (prop overrides)
  const handleAddToCart = async (p = product) => {
    if (typeof propAdd === "function") return propAdd(p);

    if (qtyAvailable === 0) {
      toast.error("This product is out of stock");
      return;
    }

    try {
      const ok = await addToCart(p, 1);
      if (ok) {
        toast.success("Added to cart");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (err) {
      console.error("addToCart error:", err);
      toast.error(err?.message || "Failed to add to cart");
    }
  };

  const handleViewDetails = async (id = product._id || product.id) => {
    if (typeof propView === "function") return propView(id);

    if (!id) {
      toast.error("Product id not available");
      return;
    }

    try {
      // optionally prefetch product details
      await fetchProductById(id).catch(() => {});
    } catch (e) {
      // ignore prefetch errors, still navigate
    }
    navigate(`/product/${id}`);
  };

  const handleChat = (farmerId = product.farmerId ?? product.farmer ?? product.farmer?._id) => {
    if (typeof propChat === "function") return propChat(farmerId);

    if (!user) {
      toast("Please login to chat with the farmer");
      navigate("/login", { state: { from: window.location.pathname } });
      return;
    }

    // farmerId could be object with _id, or id string
    const fid = typeof farmerId === "string" ? farmerId : farmerId?._id ?? farmerId?.id;
    if (!fid) {
      toast.error("Farmer info not available");
      return;
    }

    navigate("/chatroom", { state: { farmerId: fid } });
  };

  // friendly distance string
  const distanceLabel = computedDistanceKm != null ? `${computedDistanceKm} km` : (product.distance != null ? `${product.distance} km` : "—");

  return (
    <div
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-linear-to-br from-green-50 to-emerald-50">
        <img
          src={(Array.isArray(product.images) && product.images[0]) || product.image || "/placeholder-product.jpg"}
          alt={product.title || product.name || "Product"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Distance + Farmer name badge (left) */}
        <div className="absolute top-3 left-3 bg-white/95 px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
          <MapPin size={14} className="text-green-600" />
          <div className="text-left">
            <div className="text-xs font-medium text-gray-800 line-clamp-1">{farmerName || "Seller"}</div>
            <div className="text-[11px] text-gray-500">{distanceLabel}</div>
          </div>
        </div>

        {/* Stock Badge (right) */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>

        {/* Hover Actions */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isHovered ? "opacity-100" : "opacity-0"}`}>
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button
              onClick={() => handleViewDetails(product._id || product.id)}
              className="flex-1 bg-white text-gray-900 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
            >
              View Details
            </button>
            <button
              onClick={() => handleChat()}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
              title="Chat with farmer"
            >
              <MessageCircle size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium bg-green-50 text-green-600 px-2 py-1 rounded-md">
            {product.category}
          </span>
          {product.organic && (
            <span className="text-xs font-medium bg-blue-50 text-blue-600 px-2 py-1 rounded-md">
              Organic
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
          {product.title || product.name}
        </h3>

        {/* Farmer (detailed) */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <User size={14} />
          <span className="line-clamp-1">{farmerName}</span>
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">₹{product.pricePerUnit ?? product.price}</span>
              <span className="text-sm text-gray-500">/{product.unit ?? "unit"}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <TrendingUp size={12} />
              <span>{qtyAvailable === Infinity ? "—" : `${qtyAvailable} ${product.unit ?? ""} available`}</span>
            </div>
          </div>

          <button
            disabled={qtyAvailable === 0}
            onClick={() => handleAddToCart(product)}
            className={`
              p-3 rounded-xl transition-all duration-300 
              ${qtyAvailable === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-600 text-white hover:bg-green-700 hover:scale-105 shadow-lg shadow-green-600/30"}
            `}
            aria-label="Add to cart"
          >
            <ShoppingCart size={20} />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <span>⭐ {product.ratingAverage ?? 4.8} ({product.ratingCount ?? 0} reviews)</span>
          <span>Fresh Today</span>
        </div>
      </div>
    </div>
  );
}

