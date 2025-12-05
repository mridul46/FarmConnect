import React, { useRef } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Home from "./pages/Home/";
import Products from "./pages/Products";
import FarmerDashboard from "./pages/FarmerDashboard";
import CheckoutPage from "./pages/CheckoutPage";
import ChatPage from "./pages/ChatPage";
import ConsumerDashboard from "./pages/ConsumerDashboard";
import AdminDashboard from "./pages/AdminDashboard";

import LoginPage from "./pages/LoginPage";
import ConsumerLogin from "./pages/ConsumerLogin";
import FarmerLogin from "./pages/FarmerLogin";
import AdminLogin from "./pages/AdminLogin";

import ConsumerRegister from "./pages/ConsumerRegister";
import FarmerRegister from "./pages/FarmerRegister";

import Unauthorized from "./pages/Unauthorized";
import ProtectedRoute from "../src/components/protected/ProtectedRoute"
import ProductDetailsUI from "./pages/ProductDetails";
import AddToCard from "./pages/AddToCard"
import Profile from "../src/components/consumerDashboard/Profile";
import FarmerProfile from "./pages/FarmerProfile";

export default function App() {
  const productsRef = useRef(null);
  const farmerRef = useRef(null);
  const navigate = useNavigate();

  const handleStartShopping = () => {
    navigate("/products");
    setTimeout(() => {
      productsRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  const handleFarmerLoginScroll = () => {
    navigate("/farmer/login");
    setTimeout(() => {
      farmerRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 0);
  };

  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <Home
            onStartShopping={handleStartShopping}
            farmerLogin={handleFarmerLoginScroll}
          />
        }
      />

      <Route path="/products" element={<Products ref={productsRef} />} />

      {/* Login & Register */}
      <Route path="/view-details/:id" element={<ProductDetailsUI />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/consumer/login" element={<ConsumerLogin />} />
      <Route path="/farmer/login" element={<FarmerLogin />} />
      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/register/consumer" element={<ConsumerRegister />} />
      <Route path="/register/farmer" element={<FarmerRegister />} />

      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes */}

      {/* Consumer Routes */}
      <Route element={<ProtectedRoute allowedRoles={["consumer"]} />}>
        <Route path="/consumer/dashboard" element={<ConsumerDashboard />} />
        <Route path="/add-to-cart"  element={<AddToCard/>} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/chatroom" element={<ChatPage />} />
        <Route path="/consumer/dashboard/profile" element={<Profile/>}/>
      </Route>

      {/* Farmer Routes */}
      <Route element={<ProtectedRoute allowedRoles={["farmer"]} />}>
        <Route
          path="/farmer/dashboard"
          element={<FarmerDashboard ref={farmerRef} />}
        />
        <Route
        path="/farmer/dashboard/profile"
        element={<FarmerProfile/>}
        />
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Route>
    </Routes>
  );
}
