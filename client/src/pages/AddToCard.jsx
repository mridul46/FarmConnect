

// CartPage.jsx
import React from "react";
import {
  ArrowLeft,
  Plus,
  Minus,
  Trash2,
  TrendingUp,
  Leaf,
  MapPin,
  Check,
  ShoppingCart
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../Context/productsContext"; // <- adjust path if needed

export default function CartPage() {
  const navigate = useNavigate();
  const {
    cartItems,
    updateCartQuantity,
    removeFromCart,
    cartSummary,
    addNotification
  } = useProductContext();

  // convenience derived values
  const subtotal = cartSummary.subtotal ?? 0;
  const deliveryFee = cartSummary.delivery ?? 0;
  const discount = cartSummary.discount ?? 0;
  const total = cartSummary.total ?? 0;

  const handleCheckout = () => {
    if ((cartItems?.length || 0) === 0) {
      addNotification?.("Your cart is empty", "error");
      return;
    }
    navigate("/checkout");
  };

  const backToProducts = () => {
    navigate("/products");
  };

  const handleDecrease = (id, currentQty) => {
    const next = currentQty - 1;
    updateCartQuantity(id, next);
    addNotification?.("Cart updated", "success");
  };

  const handleIncrease = (id, currentQty, stockQuantity) => {
    const next = currentQty + 1;
    if (stockQuantity != null && next > stockQuantity) {
      addNotification?.("Quantity exceeds available stock", "error");
      return;
    }
    updateCartQuantity(id, next);
    addNotification?.("Cart updated", "success");
  };

  const handleRemove = (id) => {
    removeFromCart(id);
    addNotification?.("Item removed from cart", "success");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={backToProducts} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                <Leaf size={26} className="text-white" />
              </div>
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-gray-600 text-sm">{(cartItems?.length ?? 0)} items in your cart</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {cartItems && cartItems.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Left: Cart Items */}
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((cartItem) => {
                  // context stores items as { _id, qty, product }
                    const id = cartItem._id ?? cartItem.id;
                      const qty = cartItem.qty ?? cartItem.quantity ?? 1;
                      const product = cartItem.product || cartItem; // fallback to older shape
                      
                      const title = product?.title ?? product?.name ?? "Product";
                      const pricePerUnit = product?.pricePerUnit ?? product?.price ?? 0;
                      const unit = product?.unit ?? "unit";
                      
                      // images: prefer images array; otherwise if single image exists wrap it in an array; else empty
                      const images = Array.isArray(product?.images) && product.images.length
                        ? product.images
                        : product?.image
                          ? [product.image]
                          : [];
                      
                      // farmer name present on farmerId in your response
                      const farmerName = product?.farmerName ?? product?.farmer?.name ?? product?.farmerId?.name ?? "";
                      const distance = product?.distance ?? product?.farmer?.distance ?? "—";
                      const organic = Boolean(product?.organic ?? false);
                      
                      // prefer explicit stockQuantity, then stock, otherwise Infinity (unknown)
                      const stockQuantity = product?.stockQuantity ?? product?.stock ?? Infinity;
  
  
                    return (
                    <div
                      key={id}
                      className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 hover:shadow-lg transition-shadow"
                    >
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                        {/* Product Image */}
                        <div className="sm:col-span-1">
                          <img
                            src={images[0] ?? "https://via.placeholder.com/300?text=No+Image"}
                            alt={title}
                            className="w-full h-32 sm:h-40 object-cover rounded-xl"
                          />
                        </div>

                        {/* Product Details */}
                        <div className="sm:col-span-2">
                          <div className="mb-3">
                            <div className="flex flex-wrap items-center gap-2 mb-2">
                              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-md">
                                Fresh
                              </span>
                              {organic && (
                                <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-md flex items-center gap-1">
                                  <Leaf size={12} /> Organic
                                </span>
                              )}
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">{title}</h3>
                          </div>

                          <p className="text-sm text-gray-600 mb-2">{farmerName}</p>
                          <p className="text-xs text-gray-500 flex items-center gap-1 mb-3">
                            <MapPin size={12} /> {distance} km away
                          </p>

                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold text-gray-900">
                              ₹{pricePerUnit}
                              <span className="text-sm text-gray-500 font-normal">/{unit}</span>
                            </span>
                          </div>
                        </div>

                        {/* Quantity & Actions */}
                        <div className="sm:col-span-1 flex flex-col items-end justify-between">
                          {/* Quantity Selector */}
                          <div className="flex items-center border-2 border-green-600 rounded-lg">
                            <button
                              onClick={() => handleDecrease(id, qty)}
                              className="px-2 py-1 hover:bg-green-50 transition-colors text-gray-700"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="px-3 py-1 font-semibold text-gray-900 border-l border-r border-green-600 text-sm">
                              {qty}
                            </span>
                            <button
                              onClick={() => handleIncrease(id, qty, stockQuantity)}
                              className="px-2 py-1 hover:bg-green-50 transition-colors text-gray-700"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          {/* Remove Button */}
                          <button
                            onClick={() => handleRemove(id)}
                            className="mt-4 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Remove item"
                          >
                            <Trash2 size={20} />
                          </button>

                          {/* Item Total */}
                          <div className="mt-4 text-right">
                            <p className="text-xs text-gray-600 mb-1">Item Total</p>
                            <p className="text-xl font-bold text-green-600">
                              ₹{Math.round(pricePerUnit * qty * 100) / 100}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-gray-200 sticky top-24">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

                {/* Summary Details */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{subtotal}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="font-semibold text-gray-900">₹{deliveryFee}</span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Discount (5%)</span>
                    <span className="font-semibold text-green-600">-₹{discount}</span>
                  </div>

                  <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-green-600">₹{total}</span>
                  </div>
                </div>

                {/* Promo Code */}
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Apply promo code"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-600"
                  />
                </div>

                {/* Checkout Button */}
                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30 flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={20} />
                  Proceed to Checkout
                </button>

                {/* Continue Shopping */}
                <button
                  onClick={backToProducts}
                  className="w-full mt-3 border-2 border-green-600 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors"
                >
                  Continue Shopping
                </button>

                {/* Savings Info */}
                {discount > 0 && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-start gap-2">
                      <TrendingUp size={18} className="text-green-600 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-semibold text-green-900">You're saving ₹{discount}!</p>
                        <p className="text-xs text-green-700 mt-1">Free delivery on orders above ₹500</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <ShoppingCart size={48} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-600 text-lg mb-6">Start shopping for fresh produce from local farmers!</p>
            <button
              onClick={backToProducts}
              className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
