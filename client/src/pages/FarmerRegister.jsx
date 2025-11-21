import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import {
  Leaf, User, Mail, Lock, Phone, Store, MapPin, Home, Map,
  CheckCircle, AlertCircle, Loader, ArrowRight, Tractor, Shield
} from "lucide-react";
import toast from "react-hot-toast";

export default function FarmerRegister() {
  const navigate = useNavigate();


  const [step, setStep] = useState(1);
  const [coords, setCoords] = useState({ lat: "", lng: "" });
  const [locationAllowed, setLocationAllowed] = useState(false);
  const [loadingLoc, setLoadingLoc] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    shopName: "",
    street: "",
    city: "",
    state: "",
    pincode: "",
  });

  // ============================================
  // GEOLOCATION DETECTION
  // ============================================
  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Your device does not support location access.");
      setLoadingLoc(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setLocationAllowed(true);
        setLoadingLoc(false);
      },
      () => {
        setLocationAllowed(false);
        setLoadingLoc(false);
      },
      { enableHighAccuracy: true }
    );
  }, []);

  // Input Handler
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Step Navigation
  const nextStep = () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.password || !form.phone || !form.shopName) {
        alert("Please fill all required fields.");
        return;
      }
    }
    setStep(step + 1);
  };

  // ============================================
  // SUBMIT FORM (REAL BACKEND)
  // ============================================
  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!locationAllowed) {
      alert("Location must be enabled.");
      return;
    }

    setIsLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      shopName: form.shopName,
      role: "farmer",
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        coords,
      },
    };

    try {
      const res = await axios.post(
        '/api/v1/auth/register/farmer',
        payload,
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success("Farmer registered successfully!");
        navigate("/farmer/dashboard");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-green-50 via-white to-emerald-50 flex items-center justify-center p-4 relative">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-lime-200 rounded-full blur-3xl opacity-20 animate-pulse"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-2xl z-10">

        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg shadow-green-600/30 mb-4">
            <Tractor size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Become a Farmer Partner</h1>
          <p className="text-gray-600">Sell directly to consumers via FarmConnect</p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-2xl border overflow-hidden">

          {/* Progress Bar */}
          <div className="px-8 pt-8 pb-6 border-b">
            <div className="flex justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full bg-linear-to-r from-green-600 to-emerald-600 transition-all"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                ></div>
              </div>

              {[1, 2, 3].map((s) => (
                <div key={s} className="relative flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      step >= s
                        ? "bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step > s ? <CheckCircle size={20} /> : s}
                  </div>
                  <span
                    className={`text-xs mt-2 ${
                      step >= s ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    {s === 1 ? "Farm Details" : s === 2 ? "Address" : "Location"}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Banner */}
          <div
            className={`px-8 py-4 border-b ${
              loadingLoc ? "bg-blue-50" : locationAllowed ? "bg-green-50" : "bg-red-50"
            }`}
          >
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              {loadingLoc ? (
                <>
                  <Loader size={16} className="animate-spin text-blue-600" />
                  <span className="text-blue-700">Detecting your location...</span>
                </>
              ) : locationAllowed ? (
                <>
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-green-700">
                    Location detected: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
                  </span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="text-red-600" />
                  <span className="text-red-700">Enable location to continue</span>
                </>
              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">

            {/* ------------------ STEP 1 ------------------ */}
            {step === 1 && (
              <div className="space-y-5">
                <h2 className="text-2xl font-bold text-center">Setup Your Farm</h2>

                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex gap-3">
                    <Shield size={20} className="text-amber-600" />
                    <p className="text-xs text-amber-700">
                      Your farm will be manually verified in 24–48 hours.
                    </p>
                  </div>
                </div>

                {/* Shop Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium">Farm/Shop Name *</label>
                  <div className="relative">
                    <Store size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="shopName"
                      value={form.shopName}
                      onChange={handleChange}
                      className="w-full pl-12 py-3 border rounded-xl"
                      placeholder="Kumar Organic Farm"
                    />
                  </div>
                </div>

                {/* Full Name */}
                <div>
                  <label className="block mb-2 text-sm font-medium">Full Name *</label>
                  <div className="relative">
                    <User size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      className="w-full pl-12 py-3 border rounded-xl"
                      placeholder="Rajesh Kumar"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block mb-2 text-sm font-medium">Email *</label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      className="w-full pl-12 py-3 border rounded-xl"
                      placeholder="email@example.com"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block mb-2 text-sm font-medium">Password *</label>
                  <div className="relative">
                    <Lock size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="password"
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      className="w-full pl-12 py-3 border rounded-xl"
                      placeholder="•••••••"
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block mb-2 text-sm font-medium">Phone *</label>
                  <div className="relative">
                    <Phone size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="w-full pl-12 py-3 border rounded-xl"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl flex justify-center items-center gap-2"
                >
                  Continue <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* ------------------ STEP 2 ------------------ */}
            {step === 2 && (
              <>
                <h2 className="text-2xl font-bold text-center mb-4">Farm Address</h2>

                <div className="space-y-4">

                  {/* Street */}
                  <div>
                    <label className="block mb-2">Street *</label>
                    <div className="relative">
                      <Home size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        className="w-full pl-12 py-3 border rounded-xl"
                        placeholder="Village/Area"
                      />
                    </div>
                  </div>

                  {/* City */}
                  <div>
                    <label className="block mb-2">City *</label>
                    <input
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      className="w-full py-3 border rounded-xl px-4"
                      placeholder="City"
                    />
                  </div>

                  {/* State */}
                  <div>
                    <label className="block mb-2">State *</label>
                    <input
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      className="w-full py-3 border rounded-xl px-4"
                      placeholder="State"
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label className="block mb-2">Pincode *</label>
                    <div className="relative">
                      <Map size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        className="w-full pl-12 py-3 border rounded-xl"
                        placeholder="400001"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 border rounded-xl text-gray-700"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white rounded-xl flex justify-center items-center gap-2"
                  >
                    Continue <ArrowRight size={20} />
                  </button>
                </div>
              </>
            )}

            {/* ------------------ STEP 3 ------------------ */}
            {step === 3 && (
              <>
                <h2 className="text-2xl font-bold text-center mb-6">Review & Confirm</h2>

                <div className="space-y-3">
                  <div className="p-4 bg-green-50 border rounded-xl">
                    <p className="text-sm text-green-700">Farm Name</p>
                    <p className="font-semibold">{form.shopName}</p>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">Owner</p>
                    <p className="font-semibold">{form.name}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-sm">{form.email}</p>
                    </div>

                    <div className="p-4 bg-gray-50 rounded-xl">
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-semibold">{form.phone}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="font-semibold">
                      {form.street}, {form.city}, {form.state} - {form.pincode}
                    </p>
                  </div>

                  <div className="p-4 bg-green-50 border rounded-xl">
                    <p className="text-sm text-green-700 flex items-center gap-2">
                      <MapPin size={16} /> Coordinates
                    </p>
                    <p className="font-semibold text-green-900">
                      {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                    </p>
                  </div>
                </div>

                {/* Terms */}
                <div className="p-4 bg-blue-50 border rounded-xl">
                  <div className="flex gap-3">
                    <input type="checkbox" required />
                    <p className="text-sm">
                      I agree to the <b>Terms & Conditions</b> and confirm details are correct.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 border rounded-xl"
                  >
                    Back
                  </button>

                  <button
                    type="button"
                    disabled={!locationAllowed || isLoading}
                    onClick={handleSubmit}
                    className={`flex-1 py-4 rounded-xl text-white flex items-center justify-center gap-2 ${
                      locationAllowed && !isLoading
                        ? "bg-linear-to-r from-green-600 to-emerald-600"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Registering...
                      </>
                    ) : (
                      <>
                        Register Farm
                        <CheckCircle size={20} />
                      </>
                    )}
                  </button>
                </div>
              </>
            )}

          </div>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-green-600 font-semibold">
            Login
          </button>
        </p>

      </div>
    </div>
  );
}
