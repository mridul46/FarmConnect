// src/pages/FarmerProfile.jsx
import React from "react";
import Profile from "../Components/consumerDashboard/Profile";

/**
 * FarmerProfile
 * Reuses the generic Profile component.
 * For farmers, AuthContext.updateProfile will automatically
 * call /api/v1/farmer/profile based on user.role === "farmer".
 */
export default function FarmerProfile() {
  return <Profile />;
}
