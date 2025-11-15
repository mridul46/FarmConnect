
import React, { useRef } from "react"
import { Routes, Route, useNavigate } from 'react-router-dom'
import Home from './pages/Home/'
import Products from './pages/Products'
import  FarmerDashboard  from "./pages/FarmerDashboard";
import CheckoutPage from "./pages/CheckoutPage";
import ChatPage from "./pages/ChatPage";

export default function App() {
  const productsRef = useRef(null);
  const farmerRef = useRef(null);
  const navigate = useNavigate();

  const handleStartShopping = () => {
    navigate('/products');
   // If you want to scroll within the same page instead:
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };
 const handlefarmerLogin = () => {
    navigate('/farmer');
   // If you want to scroll within the same page instead:
    setTimeout(() => {
      farmerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };
  return (
    <Routes>
      <Route path="/" element={<Home onStartShopping={handleStartShopping} farmerLogin={handlefarmerLogin} />} />
      <Route path="/products" element={<Products ref={productsRef} />} />
      <Route path="/farmer" element={<FarmerDashboard ref={farmerRef}  />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/chatroom" element={<ChatPage/>} />
    </Routes>
  );
}