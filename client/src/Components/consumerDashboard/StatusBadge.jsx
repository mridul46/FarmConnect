
import React from "react";

/**
 * StatusBadge
 * Accepts either:
 *  - <StatusBadge status="delivered" />
 *  - <StatusBadge status={{ status: "delivered", label: "Delivered" }} />
 *  - <StatusBadge status={someNullableValue} />
 */
export default function StatusBadge({ status }) {
  // allow object or primitive
  const statusObj = status && typeof status === "object" ? status : { status };
  const raw = (statusObj.status ?? "").toString();

  // normalize to key format used in maps
  const key = raw.trim().toLowerCase().replace(/\s+/g, "_") || "unknown";

  const colors = {
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
    paid: "bg-blue-100 text-blue-700 border-blue-200",
    preparing: "bg-purple-100 text-purple-700 border-purple-200",
    out_for_delivery: "bg-orange-100 text-orange-700 border-orange-200",
    delivered: "bg-green-100 text-green-700 border-green-200",
    cancelled: "bg-red-100 text-red-700 border-red-200",
    unknown: "bg-gray-100 text-gray-700 border-gray-200"
  };

  const texts = {
    pending: "Pending",
    paid: "Paid",
    preparing: "Preparing",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    cancelled: "Cancelled",
    unknown: "Unknown"
  };

  // allow explicit label override: status={{ status: 'delivered', label: 'Received' }}
  const label = statusObj.label ?? texts[key] ?? texts.unknown;
  const colorClass = colors[key] ?? colors.unknown;

  return (
    <span
      role="status"
      aria-label={`order-status-${key}`}
      title={label}
      className={`
        inline-flex items-center
        px-2.5 sm:px-3
        py-0.5 sm:py-1
        rounded-full
        text-[10px] sm:text-xs
        font-medium
        border
        whitespace-nowrap
        transition-all
        ${colorClass}
      `}
    >
      {label}
    </span>
  );
}
