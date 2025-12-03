import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/authContext";
import React from "react";

export default function ProtectedRoute({ allowedRoles=[] }) {
  const { user, token } = useAuth();

  // Not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but role not allowed → show unauthorized page
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Allowed → show the route
  return <Outlet />;
}
