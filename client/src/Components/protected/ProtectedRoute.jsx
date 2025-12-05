// client/src/components/protected/ProtectedRoute.jsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../Context/authContext"; 

export default function ProtectedRoute({ allowedRoles }) {
  const { user, token, role } = useAuth();

  // Not logged in → go to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required and user doesn't match → redirect
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // Otherwise render nested routes
  return <Outlet />;
}
