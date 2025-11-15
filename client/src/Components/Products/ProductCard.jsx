import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, MapPin, User, TrendingUp, MessageCircle } from 'lucide-react';

export default function ProductCard({ product, onAddToCart, onViewDetails, onChat }) {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();
  
  const getStockStatus = (quantity) => {
    if (quantity === 0) return { text: 'Out of Stock', color: 'text-red-600 bg-red-50' };
    if (quantity < 10) return { text: 'Low Stock', color: 'text-orange-600 bg-orange-50' };
    return { text: 'In Stock', color: 'text-green-600 bg-green-50' };
  };

  const stockStatus = getStockStatus(product.stockQuantity);

  return (
    <div 
      className="group relative bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden bg-linear-to-br from-green-50 to-emerald-50">
        <img 
          src={product.images[0] || '/placeholder-product.jpg'}
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />

        {/* Stock Badge */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${stockStatus.color}`}>
            {stockStatus.text}
          </span>
        </div>

        {/* Distance */}
        {product.distance && (
          <div className="absolute top-3 left-3 bg-white/90 px-3 py-1 rounded-full flex items-center gap-1.5">
            <MapPin size={14} className="text-green-600" />
            <span className="text-xs font-medium text-gray-700">{product.distance} km</span>
          </div>
        )}

        {/* Hover Actions */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          <div className="absolute bottom-4 left-4 right-4 flex gap-2">
            <button 
              onClick={() => onViewDetails(product._id)}
              className="flex-1 bg-white text-gray-900 py-2 rounded-lg text-sm font-medium hover:bg-gray-100"
            >
              View Details
            </button>
            <button 
             onClick={() => navigate("/chatroom", { state: { farmerId: product.farmerId } })}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-700"
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
          {product.title}
        </h3>

        {/* Farmer */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <User size={14} />
          <span className="line-clamp-1">{product.farmerName}</span>
        </div>

        {/* Price & Cart */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gray-900">₹{product.pricePerUnit}</span>
              <span className="text-sm text-gray-500">/{product.unit}</span>
            </div>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <TrendingUp size={12} />
              <span>{product.stockQuantity} {product.unit} available</span>
            </div>
          </div>

          <button
            disabled={product.stockQuantity === 0}
            onClick={() => onAddToCart(product)}
            className={`
              p-3 rounded-xl transition-all duration-300 
              ${product.stockQuantity === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 hover:scale-105 shadow-lg shadow-green-600/30'}
            `}
          >
            <ShoppingCart size={20} />
          </button>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 border-t pt-3">
          <span>⭐ 4.8 (120 reviews)</span>
          <span>Fresh Today</span>
        </div>
      </div>
    </div>
  );
}





