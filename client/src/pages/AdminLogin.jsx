import { useState } from "react";
import { Leaf, Shield, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const navigate= useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault();

    // Hard-coded credentials
    const ADMIN_EMAIL = "admin@system.com";
    const ADMIN_PASS = "admin123";

    setIsLoading(true);

    // Simulate authentication delay
    setTimeout(() => {
      if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
        // Save admin session
        localStorage.setItem("token", "admin-token-123");
        localStorage.setItem("role", "admin");
        localStorage.setItem(
          "user",
          JSON.stringify({ role: "admin", email: ADMIN_EMAIL })
        );

        alert("Admin login successful!");
        // navigate("/admin/dashboard");
      } else {
        alert("Invalid admin credentials!");
      }
      setIsLoading(false);
    }, 1000);
  };

  const handleMainLogin =()=>{
       navigate("/login")
  }
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-50 via-white to-blue-50 flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative w-full max-w-md z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-linear-to-r from-purple-600 to-indigo-600 rounded-2xl shadow-2xl shadow-purple-600/40 mb-4 relative">
            <Shield size={40} className="text-white" />
            <div className="absolute -top-1 -right-1 w-6 h-6 bg-linear-to-r from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
              <Leaf size={14} className="text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Admin Portal
          </h1>
          <p className="text-gray-600">FarmConnect System Administration</p>
        </div>

        {/* Warning Banner */}
        <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <div className="flex items-start gap-3">
            <AlertCircle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-900 text-sm mb-1">Authorized Access Only</p>
              <p className="text-xs text-amber-700">This portal is restricted to system administrators. Unauthorized access attempts will be logged and reported.</p>
            </div>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          
          {/* Header */}
          <div className="px-8 py-6 bg-linear-to-r from-purple-600 to-indigo-600 text-white">
            <div className="flex items-center gap-3">
              <Shield size={24} />
              <div>
                <h2 className="text-xl font-bold">Secure Login</h2>
                <p className="text-sm text-purple-100">Administrator Authentication</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="p-8 space-y-5">
            
            
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Email
              </label>
              <div className="relative">
                <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@system.com"
                  className="w-full pl-12 pr-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {/* Security Notice */}
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <input 
                type="checkbox" 
                id="secure"
                className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500" 
                required
              />
              <label htmlFor="secure">I'm accessing from a secure device</label>
            </div>

            {/* Login Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2 ${
                isLoading
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-linear-to-r from-purple-600 to-indigo-600 hover:shadow-2xl hover:shadow-purple-600/40 transform hover:scale-[1.02]'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </>
              ) : (
                <>
                  <Shield size={20} />
                  Admin Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* Back to Main Login */}
            <div className="text-center pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() =>  handleMainLogin()}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm cursor-pointer"
              >
                ← Back to Main Login
              </button>
            </div>
          </div>
        </div>

        {/* Security Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="p-4 bg-white/50 backdrop-blur rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Shield size={20} className="text-purple-600" />
            </div>
            <p className="text-xs font-medium text-gray-700">2FA Ready</p>
          </div>
          <div className="p-4 bg-white/50 backdrop-blur rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Lock size={20} className="text-blue-600" />
            </div>
            <p className="text-xs font-medium text-gray-700">Encrypted</p>
          </div>
          <div className="p-4 bg-white/50 backdrop-blur rounded-xl border border-gray-200">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <Leaf size={20} className="text-green-600" />
            </div>
            <p className="text-xs font-medium text-gray-700">Logged</p>
          </div>
        </div>

        {/* Copyright */}
        <p className="text-center mt-6 text-sm text-gray-500">
          © 2025 FarmConnect. All rights reserved.
        </p>
      </div>
    </div>
  );
}