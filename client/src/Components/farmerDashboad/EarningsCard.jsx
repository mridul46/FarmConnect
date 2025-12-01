import React from "react";
import { TrendingUp, RefreshCw } from "lucide-react";

// Props:
// - orderStats: object returned from ProductContext.getOrderStats() (optional)
//    expected shape examples: { revenue: 45230, revenueChangePercent: 12.5, trendPoints: [40000,42000,43000,45000] }
// - loading: boolean (optional) show loading state
// - onRefresh: function (optional) called when refresh icon clicked

export default function EarningsCard({ orderStats = null, loading = false, onRefresh = null }) {
  const revenue =
    orderStats?.revenue ?? orderStats?.totalRevenue ?? orderStats?.monthlyRevenue ?? null;

  const changePct =
    orderStats?.revenueChangePercent ?? orderStats?.changePercent ?? orderStats?.revenueChange ?? null;

  const trendPoints = Array.isArray(orderStats?.trendPoints)
    ? orderStats.trendPoints
    : // fallback placeholder small trend
      [40000, 42000, 43000, 45230];

  // build a simple sparkline polyline points string for SVG
  const buildSparkPoints = (points = []) => {
    if (!points || points.length === 0) return "";
    const width = 160;
    const height = 40;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = Math.max(1, max - min);
    return points
      .map((v, i) => {
        const x = (i / (points.length - 1 || 1)) * width;
        const y = height - ((v - min) / range) * height;
        return `${x},${y}`;
      })
      .join(" ");
  };

  const formattedRevenue = revenue != null ? `₹${Number(revenue).toLocaleString()}` : "—";
  const formattedChange = changePct != null ? `${changePct > 0 ? "+" : ""}${changePct}% from last month` : "+0% from last month";

  return (
    <div className="bg-white border rounded-2xl p-6 shadow-sm">
      <div className="flex items-start justify-between">
        <h3 className="text-lg font-semibold">Earnings This Month</h3>
        <div className="flex items-center gap-2">
          {onRefresh ? (
            <button
              onClick={onRefresh}
              title="Refresh"
              className="p-1 rounded-md hover:bg-gray-100 transition"
            >
              <RefreshCw size={16} />
            </button>
          ) : null}
        </div>
      </div>

      <div className="mt-4 h-64 flex items-center justify-center bg-green-50 rounded-xl">
        <div className="text-center">
          <TrendingUp size={48} className="text-green-600 mx-auto mb-3" />

          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="animate-pulse h-8 w-40 bg-slate-200 rounded" />
              <div className="text-sm text-gray-600">Loading...</div>
            </div>
          ) : (
            <>
              <p className="text-3xl font-bold">{formattedRevenue}</p>
              <p className="text-sm text-gray-600">{formattedChange}</p>

              {/* Sparkline */}
              <div className="mt-4 mx-auto w-40">
                <svg width="160" height="40" viewBox="0 0 160 40" preserveAspectRatio="none">
                  <polyline
                    fill="none"
                    stroke="rgba(34,197,94,0.9)"
                    strokeWidth="2"
                    points={buildSparkPoints(trendPoints)}
                  />
                </svg>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
