import React, { useState } from "react";
import {
  Leaf,
  Shield,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/authContext";
import RoleSelector from "../components/login/RoleSelector";
import toast from "react-hot-toast";

export default function LoginPage() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();

  // ====================================================
  // EMAIL LOGIN
  // ====================================================
  const handleLogin = async (e) => {
  e.preventDefault();

  if (!role) {
    toast.error("Please select your role");
    return;
  }

  try {
    setIsLoading(true);

    const user = await loginWithEmail(email, password);
     
    if (!user) {
      toast.error("Login failed!");
      return;
    }

    if (user.role !== role) {
      toast.error(`This account belongs to ${user.role}`);
      return;  
    }

    toast.success("Login successful!");

    if (role === "consumer") navigate("/consumer/dashboard");
    if (role === "farmer") navigate("/farmer/dashboard");
    if (role === "admin") navigate("/admin/dashboard");

  } catch (err) {
    toast.error(err?.response?.data?.message || "Login failed!");
  } finally {
    setIsLoading(false);
  }
};



  return (
    <div className="min-h-screen bg-linear-to-r from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-md z-10">

        {/* LOGO */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg mb-4">
            <Leaf size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome Back
          </h1>
          <p className="text-gray-600">Sign in to access FarmConnect</p>
        </div>

        {/* CARD */}
        <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">

          {/* ROLE SELECTOR */}
          <div className="p-8 border-b">
            <label className="text-sm font-semibold text-gray-700">I am a</label>
            <RoleSelector role={role} setRole={setRole} />

            {role === "farmer" && (
              <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                <p className="text-sm text-amber-700 flex items-center gap-2">
                  <Shield size={16} />
                  Farmers must use Email/Password login
                </p>
              </div>
            )}
          </div>

          {/* FORM */}
          <form onSubmit={handleLogin} className="p-8 space-y-5"> 

             {/* Divider – show only when consumer */}
             {role === "consumer" && (
               <div className="relative mt-4">
                 <div className="absolute inset-0 flex items-center">
                   <div className="w-full border-t border-gray-200"></div>
                 </div>
               </div>
             )}
             
            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full pl-12 pr-4 py-3.5 border rounded-xl"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-12 pr-12 py-3.5 border rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
              </div>
            </div>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              disabled={!role || isLoading}
              className={`w-full py-4 rounded-xl font-semibold text-white flex items-center justify-center gap-2 ${
                role
                  ? "bg-green-600 hover:bg-green-700"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight size={20} />
                </>
              )}
            </button>

            {/* ADMIN LOGIN */}
            <div className="text-center pt-4 border-t">
              <button
                type="button"
                onClick={() => navigate("/admin/login")}
                className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-2 mx-auto"
              >
                <Shield size={16} />
                Admin Login
              </button>
            </div>
          </form>
        </div>

        {/* SIGNUP */}
        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}
          <button
            onClick={() => {
           if (!role) return toast.error("Please select a role before signing up");
           navigate(role === "farmer" ? "/register/farmer" : "/register/consumer");
           }
            }
            className="text-green-600 font-semibold"
          >
            Sign up for free
          </button>
        </p>
      </div>
    </div>
  );
}
