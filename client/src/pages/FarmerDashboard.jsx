import React, { useContext, useState } from 'react'
import StatsCard from '../components/farmerDashboad/StatsCard'
import QuickActions from '../components/farmerDashboad/QuickActions'
import RecentActivity from '../components/farmerDashboad/RecentActivity'
import OrdersTable from '../components/farmerDashboad/OrdersTable'
import ProductsList from '../components/farmerDashboad/ProductsList'
import EarningsCard from '../components/farmerDashboad/EarningsCard'
import TopProducts from '../components/farmerDashboad/TopProducts'
import Footer from '../components/layout/Footer'
import { LogOut, Leaf } from 'lucide-react'
import { DollarSign, Package, Clock, CheckCircle } from "lucide-react";
import { useAuth } from '../Context/authContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'


export default function FarmerDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const {user,logout}=useAuth()
  const navigate =useNavigate()

  const stats = [
    { label: "Total Revenue", value: "₹45,230", change: "+12.5%", icon: DollarSign, color: "green", trend: "up" },
    { label: "Active Products", value: "24", change: "+3 this week", icon: Package, color: "blue", trend: "up" },
    { label: "Pending Orders", value: "8", change: "2 urgent", icon: Clock, color: "orange", trend: "neutral" },
    { label: "Completed", value: "156", change: "+18 this month", icon: CheckCircle, color: "purple", trend: "up" },
  ];

  const recentOrders = [
    { id: "#ORD-1234", customer: "Amit Kumar", product: "Organic Tomatoes", quantity: "5 kg", amount: "₹225", status: "pending", time: "10 min ago" },
    { id: "#ORD-1233", customer: "Priya Sharma", product: "Fresh Spinach", quantity: "3 bunches", amount: "₹90", status: "preparing", time: "1 hour ago" },
  ];

  const products = [
    { id: 1, name: "Organic Tomatoes", image: "https://...", stock: 45, price: 45, unit: "kg", sold: 120 },
    { id: 2, name: "Fresh Spinach", image: "https://...", stock: 8, price: 30, unit: "bunch", sold: 85 },
  ];

  const getStatusColor = (status) => {
    const c = {
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      preparing: "bg-blue-100 text-blue-700 border-blue-200",
      out_for_delivery: "bg-purple-100 text-purple-700 border-purple-200",
      delivered: "bg-green-100 text-green-700 border-green-200",
    };
    return c[status] || c.pending;
  };

  const getStockStatus = (stock) => {
    if (stock === 0) return { label: "Out of Stock", color: "text-red-600" };
    if (stock < 10) return { label: "Low Stock", color: "text-orange-600" };
    return { label: "In Stock", color: "text-green-600" };
  };
   const handleLogout = async () => {
    await logout(); 
    toast.success("logout successfully")
    navigate("/login");
  };
  // derive display name & initials safely
  const userName = user?.name || "Guest";

  return (
    <div className="min-h-screen bg-linear-to-r from-emerald-50 via-white to-green-100">

      {/* HEADER */}
      <div className="bg-white/80 backdrop-blur-md border-b p-4 sm:p-6 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">

          {/* Left Section */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-linear-to-r from-green-600 to-emerald-500 rounded-xl flex items-center justify-center shadow-md shrink-0">
              <Leaf size={24} className="text-white" />
            </div>

            <div className="flex flex-col">
              <h1 className="text-xl sm:text-3xl font-bold text-gray-900">
                Farmer Dashboard
              </h1>
              <p className="text-sm text-gray-600 hidden sm:block">
                Welcome back,<span className='text-green-600'> { userName}</span>👋
              </p>
            </div>
          </div>

          {/* Logout */}
          <button 
          onClick={()=>handleLogout()}
          className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg shadow-md transition">
            <LogOut size={18} />
            <span className="hidden sm:block">Logout</span>
          </button>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-7xl mx-auto p-6">

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <StatsCard stat={s} key={i} />
          ))}
        </div>

        {/* TABS */}
        <div className="mt-8 bg-white/90 backdrop-blur-xl rounded-2xl border shadow-lg">
          <div className="border-b flex overflow-x-auto">
            {["overview", "orders", "products"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-medium transition-all 
                  ${activeTab === tab
                    ? "text-green-600 border-b-2 border-green-600 bg-green-50"
                    : "text-gray-600 hover:bg-gray-50"
                  }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <div className="p-6 animate-fadeIn">
            {activeTab === "overview" && (
              <div className="space-y-8">
                <QuickActions />
                <RecentActivity />
              </div>
            )}

            {activeTab === "orders" && (
              <OrdersTable orders={recentOrders} getStatusColor={getStatusColor} />
            )}

            {activeTab === "products" && (
              <ProductsList products={products} getStockStatus={getStockStatus} />
            )}
          </div>
        </div>

        {/* BOTTOM CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
          <EarningsCard />
          <TopProducts />
        </div>

      </div>

      <Footer />
    </div>
  )
}
