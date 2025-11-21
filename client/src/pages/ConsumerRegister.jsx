import { useState, useEffect } from "react";
import { Leaf, User, Mail, Lock, Phone, MapPin, Home, Map, CheckCircle, AlertCircle, Loader, ArrowRight, Shield } from "lucide-react";
import React from "react";
import toast from "react-hot-toast";
import { useAuth } from "../Context/authContext";
import { useNavigate } from "react-router-dom";

export default function ConsumerRegister() {
  const { registerConsumer } = useAuth();
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
    street: "",
    city: "",
    state: "",
    pincode: "",
  });
  const navigate = useNavigate();
  const handleBackLogin = () => {
    navigate("/login");
  };

  // Auto Location Detection
  useEffect(() => {
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
      }
    );
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // -----------------------------------------------------
  // EMAIL FORM REGISTER
  // -----------------------------------------------------
  const handleFormRegister = async () => {
    if (!locationAllowed) {
      toast.error("Location must be enabled");
      return;
    }

    setIsLoading(true);

    const payload = {
      name: form.name,
      email: form.email,
      password: form.password,
      phone: form.phone,
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        coords,
      },
    };

    try {
      // registerConsumer in authContext will save session and return the data
      await registerConsumer(payload);
      toast.success("Account created successfully");
      navigate("/consumer/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (step === 1) {
      if (!form.name || !form.email || !form.password || !form.phone) {
        toast.error("Please fill all fields");
        return;
      }
    }
    setStep(step + 1);
  };

  return (
    <div className="min-h-screen  bg-linear-to-r from-green-50 via-white to-emerald-50 flex items-center justify-center p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="relative w-full max-w-2xl z-10">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16  bg-linear-to-r from-green-600 to-emerald-600 rounded-2xl shadow-lg shadow-green-600/30 mb-4">
            <Leaf size={32} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Join FarmConnect</h1>
          <p className="text-gray-600">Start buying fresh produce from local farmers</p>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Progress Steps */}
          <div className="px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                <div
                  className="h-full  bg-linear-to-r from-green-600 to-emerald-600 transition-all duration-500"
                  style={{ width: `${((step - 1) / 2) * 100}%` }}
                ></div>
              </div>

              {[1, 2, 3].map((s) => (
                <div key={s} className="relative flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${
                    step >= s 
                      ? ' bg-linear-to-r from-green-600 to-emerald-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {step > s ? <CheckCircle size={20} /> : s}
                  </div>
                  <span className={`text-xs mt-2 font-medium ${step >= s ? 'text-green-600' : 'text-gray-500'}`}>
                    {s === 1 ? 'Account' : s === 2 ? 'Address' : 'Location'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Location Status Banner */}
          <div className={`px-8 py-4 border-b border-gray-100 ${loadingLoc ? 'bg-blue-50' : locationAllowed ? 'bg-green-50' : 'bg-red-50'}`}>
            <div className="flex items-center justify-center gap-2 text-sm font-medium">
              {loadingLoc ? (
                <>
                  <Loader size={16} className="animate-spin text-blue-600" />
                  <span className="text-blue-700">Detecting your location...</span>
                </>
              ) : locationAllowed ? (
                <>
                  <CheckCircle size={16} className="text-green-600" />
                  <span className="text-green-700">Location detected: {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}</span>
                </>
              ) : (
                <>
                  <AlertCircle size={16} className="text-red-600" />
                  <span className="text-red-700">Please enable location access to continue</span>
                </>
              )}
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Step 1: Account Details */}
            {step === 1 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Account</h2>
                  <p className="text-gray-600">Let's start with your basic information</p>
                </div>
                
                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <div className="relative">
                      <User size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        placeholder="John Doe"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <div className="relative">
                      <Mail size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                    <div className="relative">
                      <Lock size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="password"
                        name="password"
                        value={form.password}
                        onChange={handleChange}
                        placeholder="••••••••"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <div className="relative">
                      <Phone size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+91 98765 43210"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={nextStep}
                  className="w-full py-4  bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-green-600/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  Continue
                  <ArrowRight size={20} />
                </button>
              </div>
            )}

            {/* Step 2: Address */}
            {step === 2 && (
              <div className="space-y-5">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Address</h2>
                  <p className="text-gray-600">Where should we deliver your fresh produce?</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Street Address</label>
                    <div className="relative">
                      <Home size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="street"
                        value={form.street}
                        onChange={handleChange}
                        placeholder="123 Main Street, Apartment 4B"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      name="city"
                      value={form.city}
                      onChange={handleChange}
                      placeholder="Guwahati"
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                    <input
                      type="text"
                      name="state"
                      value={form.state}
                      onChange={handleChange}
                      placeholder="Assam"
                      className="w-full px-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pincode</label>
                    <div className="relative">
                      <Map size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        name="pincode"
                        value={form.pincode}
                        onChange={handleChange}
                        placeholder="400001"
                        className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="flex-1 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl hover:shadow-xl hover:shadow-green-600/30 transition-all transform hover:scale-[1.02] flex items-center justify-center gap-2"
                  >
                    Continue
                    <ArrowRight size={20} />
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Confirmation */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapPin size={32} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Almost Done!</h2>
                  <p className="text-gray-600">Review your information before creating your account</p>
                </div>

                {/* Review Information */}
                <div className="space-y-3">
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Name</p>
                    <p className="font-semibold text-gray-900">{form.name}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Email</p>
                    <p className="font-semibold text-gray-900">{form.email}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Phone</p>
                    <p className="font-semibold text-gray-900">{form.phone}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-xl">
                    <p className="text-sm text-gray-600 mb-1">Address</p>
                    <p className="font-semibold text-gray-900">
                      {form.street}, {form.city}, {form.state} - {form.pincode}
                    </p>
                  </div>
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl">
                    <p className="text-sm text-green-700 mb-1 flex items-center gap-2">
                      <MapPin size={16} />
                      Location
                    </p>
                    <p className="font-semibold text-green-900">
                      {coords.lat.toFixed(6)}, {coords.lng.toFixed(6)}
                    </p>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    onClick={()=>handleFormRegister()}
                    disabled={!locationAllowed || isLoading}
                    className={`flex-1 py-4 rounded-xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                      locationAllowed && !isLoading
                        ? 'bg-linear-to-r from-green-600 to-emerald-600 hover:shadow-xl hover:shadow-green-600/30 transform hover:scale-[1.02]'
                        : 'bg-gray-300 cursor-not-allowed'
                    }`}
                  >
                    {isLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <CheckCircle size={20} />
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Login Link */}
        <p className="text-center mt-6 text-gray-600">
          Already have an account?{' '}
          <button
            onClick={() => handleBackLogin()}
            className="text-green-600 hover:text-green-700 font-semibold"
          >
            Sign in here
          </button>
        </p>

        {/* Trust Indicators */}
        <div className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            <Shield size={16} className="text-green-600" />
            <span>Secure Registration</span>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle size={16} className="text-green-600" />
            <span>Data Protected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
