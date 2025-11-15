import { Lock, Truck, ChevronRight } from "lucide-react";
import CartItem from "./CartItem";
import React from "react";
export default function OrderSummary({ cartItems, subtotal, deliveryFee, total }) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 sticky top-24">

        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold">Order Summary</h2>
        </div>

        <div className="p-6 border-b max-h-80 overflow-y-auto space-y-4">
          {cartItems.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="p-6 space-y-3">

          <div className="flex justify-between text-gray-600">
            <span>Subtotal</span>
            <span className="font-medium">₹{subtotal}</span>
          </div>

          <div className="flex justify-between text-gray-600">
            <span>Delivery Fee</span>
            <span className="font-medium">
              {deliveryFee === 0 ? <span className="text-green-600">FREE</span> : `₹${deliveryFee}`}
            </span>
          </div>

          {deliveryFee === 0 && (
            <div className="text-xs text-green-600 bg-green-50 px-3 py-2 rounded">
              🎉 You saved ₹40 on delivery!
            </div>
          )}

          <div className="pt-3 border-t flex justify-between text-lg font-bold">
            <span>Total</span>
            <span>₹{total}</span>
          </div>

        </div>

        <div className="p-6 pt-0">
          <button className="w-full py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl flex items-center justify-center gap-2">
            <span>Place Order</span>
            <ChevronRight size={20} />
          </button>

          <p className="text-xs text-center text-gray-500 mt-4">
            By placing this order, you agree to our Terms & Conditions
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="mt-6 grid grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl border text-center">
          <div className="w-10 h-10 bg-green-100 rounded-full mx-auto mb-2 flex items-center justify-center">
            <Lock size={20} className="text-green-600" />
          </div>
          <p className="text-xs font-medium">Secure Payment</p>
        </div>

        <div className="bg-white p-4 rounded-xl border text-center">
          <div className="w-10 h-10 bg-blue-100 rounded-full mx-auto mb-2 flex items-center justify-center">
            <Truck size={20} className="text-blue-600" />
          </div>
          <p className="text-xs font-medium">Fast Delivery</p>
        </div>
      </div>
    </div>
  );
}
