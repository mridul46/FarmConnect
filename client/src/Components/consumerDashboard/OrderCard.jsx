
// components/consumerDashboard/OrderCard.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import { Clock, MessageCircle } from "lucide-react";

/**
 * OrderCard - defensive rendering for different backend shapes
 * Expects `order` which may contain fields like:
 *  - _id or id
 *  - image or items[0].product.images[0]
 *  - farmerName, farmer (string) or farmer: { name, _id }
 *  - items: array of strings OR array of objects { name/title, product, qty }
 *  - amount / totalAmount / summary?.total
 *  - date / createdAt
 *  - estimatedDelivery / deliveryETA
 *  - status
 */
export default function OrderCard({ order = {} }) {
  const navigate = useNavigate();

  // id
  const id = order._id || order.id || String(order.orderId || "unknown");

  // image: prefer explicit order.image, fallback to first product image if items are objects
  const image =
    order.image ||
    (Array.isArray(order.items) &&
      order.items.find((it) => it?.product?.images?.[0])?.product?.images?.[0]) ||
    "/placeholder.png";

  // farmer: support multiple shapes
  const farmer =
    typeof order.farmer === "string"
      ? order.farmer
      : order.farmerName ||
        order.farmer?.name ||
        order.seller?.name ||
        order.seller ||
        "Seller";

  const farmerId = order.farmer?._id || order.farmerId || order.seller?._id || "";

  // items: if array of strings -> join; if array of objects -> prefer item.name || item.title || item.product.name
  let itemsText = "";
  if (Array.isArray(order.items)) {
    itemsText = order.items
      .map((it) => {
        if (typeof it === "string") return it;
        const qty = it.qty || it.quantity || it.count;
        const name =
          it.name || it.title || it.product?.title || it.product?.name || it.product?.name_en;
        if (name && qty != null) return `${qty} × ${name}`;
        return name || it.product?.name || JSON.stringify(it);
      })
      .join(", ");
  } else if (typeof order.items === "string") {
    itemsText = order.items;
  } else {
    itemsText = (order.summary?.items || []).join(", ") || "—";
  }

  // amount
  const amount = order.totalAmount ?? order.amount ?? order.summary?.total ?? order.price ?? "—";

  // date
  const rawDate = order.createdAt || order.date || order.orderDate;
  const date = rawDate ? new Date(rawDate).toLocaleDateString() : "—";

  // estimated delivery
  const estimatedDelivery =
    order.estimatedDelivery || order.deliveryETA || order.eta || order.estimated || "—";

  // status
  const status = order.status || order.orderStatus || "unknown";

  // handlers
  const handleTrack = () => {
    navigate(`/orders/${id}`);
  };

  const handleChat = () => {
    // navigate to a chat or farmer page — fallback to farmer store if chat route not present
    if (farmerId) navigate(`/chat/${farmerId}`);
    else navigate(`/farmer/${farmerId || ""}`);
  };

  return (
    <div className="p-4 border rounded-xl hover:shadow-md transition-shadow bg-white">
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Image */}
        <img
          src={image}
          alt={id}
          className="w-full sm:w-20 h-32 sm:h-20 rounded-lg object-cover"
        />

        {/* Order Content */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <p className="font-semibold text-base truncate">{id}</p>
              <p className="text-sm text-gray-600 truncate">{farmer}</p>
            </div>

            <div className="sm:shrink-0">
              <StatusBadge status={status} />
            </div>
          </div>

          {/* Order Items */}
          <p className="text-sm mt-1 text-gray-700 truncate">{itemsText}</p>

          {/* Date & Amount */}
          <div className="flex justify-between text-sm mt-2">
            <span className="text-gray-500">{date}</span>
            <span className="font-semibold">{typeof amount === "number" ? `₹${amount}` : amount}</span>
          </div>

          {/* Delivery Time */}
          <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
            <Clock size={14} />
            <span className="truncate">{estimatedDelivery}</span>
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-4 pt-3 border-t flex flex-col sm:flex-row gap-2">
        <button
          onClick={handleTrack}
          className="w-full sm:flex-1 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 transition-colors"
        >
          Track Order
        </button>

        <button
          onClick={handleChat}
          className="w-full sm:w-auto py-2 px-4 border rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-gray-50 transition-colors"
        >
          <MessageCircle size={16} /> Chat
        </button>
      </div>
    </div>
  );
}
