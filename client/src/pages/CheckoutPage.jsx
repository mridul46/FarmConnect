// src/pages/CheckoutPage.jsx
import React, { useMemo, useState } from "react";
import Header from "../components/checkout/Header";
import DeliveryAddress from "../components/checkout/DeliveryAddress";
import DeliveryOptions from "../components/checkout/DeliveryOptions";
import PaymentProvider from "../components/checkout/PaymentProvider";
import PaymentMethods from "../components/checkout/PaymentMethods";
import CODSection from "../components/checkout/CODSection";
import OrderSummary from "../components/checkout/OrderSummary";
import Footer from "../components/layout/Footer";
import { useProductContext } from "../Context/productsContext"; // adjust path if needed

export default function CheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState("razorpay");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  // GET real cart items from context (your ProductProvider exposes cartItems)
  const { cartItems = [], cartSummary = {} } = useProductContext();

  // small helper to format money consistently
  const formatPrice = (n) => {
    const num = Number(n || 0);
    // round to 2 decimals but show integer when whole
    return Math.round(num * 100) / 100;
  };

  // Normalize cart items so OrderSummary receives consistent shape
  const normalizedCart = useMemo(() => {
    return (cartItems || []).map((cartItem) => {
      // following your exact mapping snippet
      const id = cartItem._id ?? cartItem.id;
      const qty = cartItem.qty ?? cartItem.quantity ?? 1;
      const product = cartItem.product || cartItem; // fallback to older shape

      const title = product?.title ?? product?.name ?? "Product";
      const pricePerUnit = product?.pricePerUnit ?? product?.price ?? cartItem.price ?? 0;
      const unit = product?.unit ?? cartItem.unit ?? "unit";

      // images: prefer images array; otherwise if single image exists wrap it in an array; else empty
      const images = Array.isArray(product?.images) && product.images.length
        ? product.images
        : product?.image
          ? [product.image]
          : cartItem.image
            ? [cartItem.image]
            : [];

      // farmer name present on farmerId in your response
      const farmerName = product?.farmerName ?? product?.farmer?.name ?? product?.farmerId?.name ?? "";
      const distance = product?.distance ?? product?.farmer?.distance ?? "—";
      const organic = Boolean(product?.organic ?? false);

      // prefer explicit stockQuantity, then stock, otherwise Infinity (unknown)
      const stockQuantity = product?.stockQuantity ?? product?.stock ?? Infinity;

      const price = Number(pricePerUnit || 0);
      const quantity = Number(qty || 0);
      const itemTotal = formatPrice(price * quantity);

      return {
        id,
        title,
        price, // per unit price (number)
        quantity, // qty number
        unit,
        image: images[0] ?? "https://via.placeholder.com/300?text=No+Image",
        images, // full array still available
        farmerName,
        distance,
        organic,
        stockQuantity,
        itemTotal,
        rawProduct: product
      };
    });
  }, [cartItems]);

  // Money calculations (use cartSummary if available so it matches CartPage)
  const subtotal = useMemo(() => {
    if (cartSummary && typeof cartSummary.subtotal === "number") return formatPrice(cartSummary.subtotal);
    return formatPrice(normalizedCart.reduce((s, it) => s + (Number(it.price || 0) * Number(it.quantity || 0)), 0));
  }, [cartSummary, normalizedCart]);

  const deliveryFee = useMemo(() => {
    if (cartSummary && typeof cartSummary.delivery === "number") return formatPrice(cartSummary.delivery);
    return subtotal > 500 ? 0 : 40;
  }, [cartSummary, subtotal]);

  const discount = useMemo(() => {
    if (cartSummary && typeof cartSummary.discount === "number") return formatPrice(cartSummary.discount);
    return Math.floor(subtotal * 0.05);
  }, [cartSummary, subtotal]);

  const total = useMemo(() => {
    if (cartSummary && typeof cartSummary.total === "number") return formatPrice(cartSummary.total);
    return formatPrice(subtotal + deliveryFee - discount);
  }, [cartSummary, subtotal, deliveryFee, discount]);

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-green-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid: stacked on mobile, 3 cols on lg */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT: forms (span 2 cols on large screens) */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <DeliveryAddress />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <DeliveryOptions />
            </div>

            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <PaymentProvider
                selectedPayment={selectedPayment}
                setSelectedPayment={setSelectedPayment}
              />

              {selectedPayment !== "cod" ? (
                <div className="mt-4">
                  <PaymentMethods
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                  />
                </div>
              ) : (
                <div className="mt-4">
                  <CODSection />
                </div>
              )}
            </div>
          </div>

          {/* RIGHT: summary (sticky on large screens) */}
          <aside className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-4 lg:sticky lg:top-20">
              <OrderSummary
                cartItems={normalizedCart}      // items with image, price, quantity, itemTotal
                subtotal={subtotal}
                deliveryFee={deliveryFee}
                discount={discount}
                total={total}
              />
            </div>

            {/* helpful empty-cart callout */}
            {normalizedCart.length === 0 && (
              <div className="mt-4 bg-yellow-50 border-l-4 border-yellow-300 p-3 text-sm text-yellow-800 rounded">
                Your cart is empty — add items from the product list to proceed to checkout.
              </div>
            )}
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
