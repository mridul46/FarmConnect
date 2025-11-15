import React from "react";
export default function CartItem({ item }) {
  return (
    <div className="flex gap-3">
      <img src={item.image} className="w-16 h-16 rounded-lg object-cover" />
      <div className="flex-1">
        <p className="font-medium text-sm line-clamp-1">{item.title}</p>
        <p className="text-xs text-gray-500 mb-1">{item.farmer}</p>
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">{item.quantity} {item.unit}</span>
          <span className="text-sm font-semibold">₹{item.price * item.quantity}</span>
        </div>
      </div>
    </div>
  );
}
