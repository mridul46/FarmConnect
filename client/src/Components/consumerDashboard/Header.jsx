import React, { useEffect, useRef,useState } from "react";
import { Search, ShoppingCart, LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/authContext";
import toast from "react-hot-toast";



export default function Header() {
  const navigate = useNavigate();
  const {logout} =useAuth()
  const dropdownRef = useRef(null);
  const [openMenu, setOpenMenu] = useState(false);
  const handleProduct = () => navigate("/products");
 
  const handleLogout = async() => {
    // Clear session storage / context logout later
   await logout()
   toast.success("logout successfully")
    navigate("/login");
  };

  const userName = "John Doe"; // Replace with context
  const cartCount = 2;
  // Close when clicking outside
useEffect(() => {
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setOpenMenu(false);
    }
  };

  document.addEventListener("click", handleClickOutside);
  return () => document.removeEventListener("click", handleClickOutside);
}, []);
  return (
    <div className="bg-white/80 backdrop-blur-md border-b shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

        {/* LEFT CONTENT */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
            👋 Welcome, <span className="bg-linear-to-r from-green-600 to-emerald-600 text-transparent bg-clip-text">{userName}</span>
          </h1>
          <p className="text-gray-600 text-sm sm:text-base">Here’s your personalized dashboard.</p>
        </div>

        {/* RIGHT ACTIONS */}
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

          {/* Browse Products */}
          <button
            onClick={handleProduct}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-xl flex items-center justify-center gap-2 
            text-sm sm:text-base hover:bg-gray-100 transition-all cursor-pointer hover:shadow-md"
          >
            <Search size={18} /> Browse Products
          </button>

          {/* View Cart */}
          <button
            onClick={() => navigate("/checkout")}
            className="w-full sm:w-auto px-4 py-2 rounded-xl flex items-center justify-center gap-2 
            bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold text-sm sm:text-base 
            hover:shadow-lg hover:shadow-green-600/30 transition-all"
          >
            <ShoppingCart size={18} />
            View Cart ({cartCount})
          </button>

          {/* PROFILE DROPDOWN */}
            <div ref={dropdownRef} className="relative w-full sm:w-auto">
            <button
              onClick={() => setOpenMenu(!openMenu)}
              className="w-full sm:w-auto px-4 py-2 bg-gray-100 hover:bg-gray-200 
                rounded-xl flex items-center justify-center gap-2 text-sm sm:text-base 
                transition-all cursor-pointer"
            >
              <User size={18} /> Profile
            </button>
          
       {/* DROPDOWN MENU */}
        {openMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-xl 
                          border z-50 animate-fadeIn">
            <button
              className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50 rounded-t-xl"
              onClick={() => {
                navigate("/profile");
                setOpenMenu(false);
              }}
            >
              My Profile
            </button>
      
            <button
              onClick={() => {
                handleLogout();
                setOpenMenu(false);
              }}
              className="w-full text-left px-4 py-2 flex items-center gap-2 text-sm 
                         text-red-600 hover:bg-red-50 rounded-b-xl"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
        </div>

        </div>
      </div>
    </div>
  );
}
