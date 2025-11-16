import React from "react";
export default function StatusBadge({ status }) {
  const colors = {
    active: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    suspended: "bg-red-100 text-red-700 border-red-200",

    // Orders-specific
    delivered: "bg-green-100 text-green-700 border-green-200",
    out_for_delivery: "bg-blue-100 text-blue-700 border-blue-200",
    preparing: "bg-purple-100 text-purple-700 border-purple-200",
  };

  const appliedClass = colors[status] || "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${appliedClass}`}>
      {status.replace("_", " ")}
    </span>
  );
}
