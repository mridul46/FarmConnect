import React from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole } from "lucide-react";

export default function Unauthorized() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-emerald-50 via-white to-emerald-100 px-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl border border-emerald-100 p-8 sm:p-10 text-center relative overflow-hidden">
        {/* Accent blur circle */}
        <div className="pointer-events-none absolute -top-16 -right-16 w-40 h-40 bg-emerald-200/40 rounded-full blur-2xl" />

        <div className="relative">
          {/* Icon circle */}
          <div className="mx-auto mb-4 w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center shadow-sm">
            <LockKeyhole className="text-red-500" size={28} />
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Access Denied
          </h1>

          <p className="text-sm sm:text-base text-gray-600 mb-6">
            You don’t have permission to view this page. 
            If you think this is a mistake, try logging in with a different account
            or returning to the homepage.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              Go Back
            </button>

            <button
              onClick={() => navigate("/")}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 text-sm font-semibold text-white shadow-md hover:bg-emerald-700 hover:shadow-lg transition-all"
            >
              Go to Homepage
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
