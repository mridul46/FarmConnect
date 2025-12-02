import React, { useEffect, useState } from "react";
import { useProductContext } from "../../Context/productsContext";

export default function TopProducts({ limit = 5 }) {
  const { getTopProductsBySales, getFarmerOrders } = useProductContext();

  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format INR
  const money = (v) =>
    typeof v === "number" ? "₹" + v.toLocaleString() : v ?? "—";

  useEffect(() => {
    let mounted = true;

    const loadFromOrders = async () => {
      try {
        const orders = await getFarmerOrders().catch(() => []);
        if (!Array.isArray(orders) || orders.length === 0) {
          if (mounted) setTopItems([]);
          return;
        }

        const productMap = {};

        orders.forEach((order) => {
          if (!Array.isArray(order.items)) return;

          order.items.forEach((it) => {
            const id = it.productId || it._id || it.id;
            if (!id) return;

            const name = it.name || it.productName || (it.product && (it.product.name || it.product.title)) || "Unnamed Product";
            const qty = Number(it.qty ?? it.quantity ?? it.count ?? 0);
            const price = Number(it.pricePerUnit ?? it.unitPrice ?? it.price ?? 0);
            const revenue = qty * price;

            if (!productMap[id]) {
              productMap[id] = { id, name, qty: 0, revenue: 0 };
            }

            productMap[id].qty += qty;
            productMap[id].revenue += revenue;
          });
        });

        const ranked = Object.values(productMap)
          .sort((a, b) => b.qty - a.qty || b.revenue - a.revenue)
          .slice(0, limit)
          .map((p, idx) => ({
            rank: idx + 1,
            name: p.name,
            sold: p.qty,
            amount: p.revenue,
          }));

        if (mounted) setTopItems(ranked);
      } catch (err) {
        console.error("TopProducts (orders) fetch error:", err);
        if (mounted) setTopItems([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    const loadTopProducts = async () => {
      setLoading(true);

      // Prefer the dedicated top-by-sales endpoint if available
      if (typeof getTopProductsBySales === "function") {
        try {
          const results = await getTopProductsBySales(limit);
          // Normalize results into the shape we expect (rank, name, sold, amount)
          const normalized = (Array.isArray(results) ? results : [])
            .slice(0, limit)
            .map((p, idx) => ({
              rank: idx + 1,
              name: p.name || p.title || p.productName || "Unnamed Product",
              sold: Number(p.sold ?? p.sales ?? p.qty ?? 0),
              amount: Number(p.revenue ?? p.amount ?? (p.price && p.sold ? p.price * p.sold : 0)) || 0,
            }));

          if (mounted) {
            setTopItems(normalized);
            setLoading(false);
          }
          return;
        } catch (err) {
          console.warn("getTopProductsBySales failed, falling back to orders aggregation:", err);
          // fall through to orders-based aggregation
        }
      }

      // Fallback: aggregate from farmer orders
      await loadFromOrders();
    };

    loadTopProducts();

    return () => {
      mounted = false;
    };
  }, [getTopProductsBySales, getFarmerOrders, limit]);

  return (
    <div className="bg-white rounded-2xl p-6 border shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Top Selling Products</h3>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : topItems.length === 0 ? (
        <p className="text-sm text-gray-500">No sales yet.</p>
      ) : (
        <div className="space-y-4">
          {topItems.map((item) => (
            <div key={item.rank + String(item.name)} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-r from-green-400 to-emerald-400 text-white flex items-center justify-center rounded-lg font-bold">
                {item.rank}
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.sold ?? 0} sold
                </p>
              </div>

              <span className="font-semibold whitespace-nowrap">{money(item.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
