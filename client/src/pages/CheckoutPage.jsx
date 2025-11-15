import { useState } from "react";
import React from "react";
import Header from "../components/checkout/Header";
import DeliveryAddress from "../components/checkout/DeliveryAddress";
import DeliveryOptions from "../components/checkout/DeliveryOptions";
import PaymentProvider from "../components/checkout/PaymentProvider";
import PaymentMethods from "../components/checkout/PaymentMethods";
import CODSection from "../components/checkout/CODSection";
import OrderSummary from "../components/checkout/OrderSummary";
import Footer from "../components/layout/Footer";

export default function CheckoutPage() {
  const [selectedPayment, setSelectedPayment] = useState("razorpay");
  const [paymentMethod, setPaymentMethod] = useState("upi");

  const cartItems = [
    {
      id: 1,
      title: "Organic Farm Fresh Tomatoes",
      farmer: "Rajesh Kumar",
      quantity: 3,
      unit: "kg",
      price: 45,
      image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=100",
    },
    {
      id: 2,
      title: "Sweet Alphonso Mangoes",
      farmer: "Priya Sharma",
      quantity: 2,
      unit: "kg",
      price: 120,
      image:
        "https://images.unsplash.com/photo-1553279768-865429fa0078?w=100",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 500 ? 0 : 40;
  const total = subtotal + deliveryFee;

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 via-white to-green-50">

      <Header />

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* LEFT SIDE */}
          <div className="lg:col-span-2 space-y-6">
            <DeliveryAddress />
            <DeliveryOptions />

            {/* Payment Section */}
            <PaymentProvider 
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
            />

            {selectedPayment !== "cod" ? (
              <PaymentMethods 
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            ) : (
              <CODSection />
            )}
          </div>

          {/* RIGHT SIDE */}
          <OrderSummary
            cartItems={cartItems}
            subtotal={subtotal}
            deliveryFee={deliveryFee}
            total={total}
          />
        </div>
      </div>
      <Footer/>
    </div>
  );
}
