import React, { useMemo, useState } from "react";
import { Edit, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductContext } from "../../Context/productsContext"; 

const STATUS_OPTIONS = [
  { value: "", label: "All Orders" },
  { value: "pending", label: "Pending" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for Delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

export default function OrdersTable({ orders: propOrders = null, getStatusColor }) {
  const navigate = useNavigate();
  const {
    orders: ctxOrders,
    ordersLoading,
    refreshOrders,
    updateOrderStatus,
    getOrderById,
  } = useProductContext();

  // use propOrders if passed, else context orders
  const orders = Array.isArray(propOrders) && propOrders.length ? propOrders : ctxOrders || [];

  const [filterStatus, setFilterStatus] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [localSort, setLocalSort] = useState("newest"); // newest | oldest

  const filtered = useMemo(() => {
    let list = orders.slice();
    if (filterStatus) {
      list = list.filter((o) => String(o.status).toLowerCase() === String(filterStatus).toLowerCase());
    }
    if (localSort === "newest") {
      list.sort((a, b) => new Date(b.createdAt || b.updatedAt || 0) - new Date(a.createdAt || a.updatedAt || 0));
    } else {
      list.sort((a, b) => new Date(a.createdAt || a.updatedAt || 0) - new Date(b.createdAt || b.updatedAt || 0));
    }
    return list;
  }, [orders, filterStatus, localSort]);

  const safeGetCustomerName = (order) => {
    if (!order) return "—";
    if (order.customer) {
      if (typeof order.customer === "string") return order.customer;
      if (typeof order.customer === "object") return order.customer.name || order.customer.fullName || order.customer.email || "Customer";
    }
    return order.customerName || order.buyerName || "Customer";
  };

  const safeGetProductSummary = (order) => {
    if (!order) return "—";
    if (Array.isArray(order.items) && order.items.length) {
      const first = order.items[0];
      const name = first.product?.name || first.name || first.title || "Item";
      const qty = first.qty ?? first.quantity ?? first.count ?? "";
      return `${name} ${qty ? `• ${qty}` : ""}`;
    }
    // fallback single fields (if older shape)
    return order.product || order.productName || "—";
  };

  const safeGetAmount = (order) => {
    const amt = order.totalAmount ?? order.amount ?? order.subtotal ?? order.total;
    if (amt == null) return "—";
    try {
      return `₹${Number(amt).toLocaleString()}`;
    } catch {
      return String(amt);
    }
  };

  const handleView = async (order) => {
    // try to fetch fresh order then navigate to detail page
    try {
      await getOrderById(order._id || order.id);
    } catch {
      // ignore error, still navigate
    }
    navigate(`/orders/${order._id || order.id}`);
  };

  const handleChangeStatus = async (orderId, nextStatus) => {
    if (!orderId || !nextStatus) return;
    setUpdatingId(orderId);
    toast.loading("Updating order...", { id: `upd-${orderId}` });
    try {
      await updateOrderStatus(orderId, nextStatus);
      toast.success("Order status updated", { id: `upd-${orderId}` });
      // refresh list
      await refreshOrders().catch(() => {});
    } catch (err) {
      console.error("updateOrderStatus error:", err);
      toast.error("Failed to update status", { id: `upd-${orderId}` });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-3">
        <h3 className="text-lg font-semibold">Recent Orders</h3>

        <div className="flex items-center gap-3">
          <select
            className="px-4 py-2 border rounded-lg text-sm"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value || "all"} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>

          <select
            className="px-4 py-2 border rounded-lg text-sm"
            value={localSort}
            onChange={(e) => setLocalSort(e.target.value)}
            title="Sort"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left">Order ID</th>
              <th className="py-3 px-4 text-left">Customer</th>
              <th className="py-3 px-4 text-left">Product</th>
              <th className="py-3 px-4 text-left">Qty</th>
              <th className="py-3 px-4 text-left">Amount</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {(ordersLoading ? new Array(6).fill(0) : filtered).map((order, idx) => {
              if (ordersLoading) {
                return (
                  <tr key={`skeleton-${idx}`} className="border-b">
                    <td className="py-4 px-4">
                      <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-32 bg-slate-200 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-40 bg-slate-200 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-12 bg-slate-200 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-20 bg-slate-200 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 w-24 bg-slate-200 rounded animate-pulse" />
                    </td>
                    <td className="py-4 px-4" />
                  </tr>
                );
              }

              const id = order._id || order.id || `order-${idx}`;
              const status = String(order.status || "").toLowerCase();

              return (
                <tr key={id} className="border-b hover:bg-gray-50">
                  <td className="py-4 px-4 font-medium">{id}</td>
                  <td className="py-4 px-4">{safeGetCustomerName(order)}</td>
                  <td className="py-4 px-4">{safeGetProductSummary(order)}</td>
                  <td className="py-4 px-4">
                    {/* show total quantity if available */}
                    {order.totalQty ?? order.qty ?? (Array.isArray(order.items) ? order.items.reduce((s, it) => s + (it.qty || it.quantity || 0), 0) : "—")}
                  </td>
                  <td className="py-4 px-4 font-semibold">{safeGetAmount(order)}</td>

                  <td className="py-4 px-4">
                    <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor ? getStatusColor(status) : "bg-gray-100 text-gray-700 border-gray-200"}`}>
                      {status.replace("_", " ") || "—"}
                    </span>
                  </td>

                  <td className="py-4 px-4 flex gap-2 items-center">
                    <button
                      title="View details"
                      onClick={() => handleView(order)}
                      className="p-2 hover:bg-green-100 rounded-lg"
                    >
                      <Eye size={16} className="text-green-600" />
                    </button>

                    {/* Quick status change dropdown */}
                    <div className="relative">
                      <select
                        value={status}
                        onChange={(e) => {
                          const next = e.target.value;
                          if (next === status) return;
                          handleChangeStatus(order._id || order.id, next);
                        }}
                        disabled={updatingId === (order._id || order.id)}
                        className="px-3 py-1 border rounded-lg text-sm"
                        title="Change status"
                      >
                        {/* keep current status as a selectable option */}
                        {STATUS_OPTIONS.filter(s => s.value).map((opt) => (
                          <option key={opt.value} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      title="Edit"
                      onClick={() => navigate(`/orders/${order._id || order.id}/edit`)}
                      className="p-2 hover:bg-blue-100 rounded-lg"
                    >
                      <Edit size={16} className="text-blue-600" />
                    </button>
                  </td>
                </tr>
              );
            })}
            {(!ordersLoading && filtered.length === 0) && (
              <tr>
                <td colSpan={7} className="py-8 px-4 text-center text-gray-500">
                  No orders found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
