import React, { useEffect, useState } from "react";
import { useProductContext } from "../../Context/productsContext"; 
export default function TopProducts() {
  const { getFarmerOrders } = useProductContext();

  const [topItems, setTopItems] = useState([]);
  const [loading, setLoading] = useState(true);

  // Format INR
  const money = (v) =>
    typeof v === "number" ? "₹" + v.toLocaleString() : v;

  useEffect(() => {
    const loadTopProducts = async () => {
      try {
        const orders = await getFarmerOrders(); // fetch farmer-owned product orders

        if (!Array.isArray(orders) || orders.length === 0) {
          setTopItems([]);
          return;
        }

        // Aggregate sales by product
        const productMap = {};

        orders.forEach((order) => {
          if (!Array.isArray(order.items)) return;

          order.items.forEach((it) => {
            const id = it.productId || it._id || it.id;
            if (!id) return;

            const name = it.name || it.productName || "Unnamed Product";

            const qty =
              it.qty ||
              it.quantity ||
              it.count ||
              0;

            const price =
              it.pricePerUnit ||
              it.unitPrice ||
              it.price ||
              0;

            const revenue = qty * price;

            if (!productMap[id]) {
              productMap[id] = {
                id,
                name,
                qty: 0,
                revenue: 0,
              };
            }

            productMap[id].qty += qty;
            productMap[id].revenue += revenue;
          });
        });

        // Convert map to sorted array
        const ranked = Object.values(productMap)
          .sort((a, b) => b.qty - a.qty)
          .slice(0, 5) // top 5
          .map((p, idx) => ({
            rank: idx + 1,
            name: p.name,
            sold: p.qty,
            amount: p.revenue,
          }));

        setTopItems(ranked);
      } catch (err) {
        console.error("TopProducts fetch error:", err);
        setTopItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadTopProducts();
  }, [getFarmerOrders]);

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
            <div key={item.rank} className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-r from-green-400 to-emerald-400 text-white flex items-center justify-center rounded-lg font-bold">
                {item.rank}
              </div>

              <div className="flex-1">
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-sm text-gray-600">
                  {item.sold} sold
                </p>
              </div>

              <span className="font-semibold">{money(item.amount)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
