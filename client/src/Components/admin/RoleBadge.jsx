import React from "react";
export default function RoleBadge({ role }) {
  const colors = {
    farmer: "bg-green-100 text-green-700",
    consumer: "bg-blue-100 text-blue-700",
    admin: "bg-purple-100 text-purple-700",
  };

  const appliedClass = colors[role] || "bg-gray-100 text-gray-700";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium ${appliedClass}`}>
      {role}
    </span>
  );
}
