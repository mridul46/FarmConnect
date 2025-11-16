import React from "react";
import systemAlerts from "../../assets/systemAlerts";
import { AlertTriangle } from "lucide-react";

export default function SystemAlerts() {
  const colors = {
    error: "bg-red-50 border-red-200 text-red-700",
    warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
    info: "bg-blue-50 border-blue-200 text-blue-700",
    success: "bg-green-50 border-green-200 text-green-700",
  };

  return (
    <div className="bg-white rounded-2xl border p-6 mb-8">
      <h3 className="text-lg font-semibold mb-4">System Alerts</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {systemAlerts.map((alert, i) => (
          <div key={i} className={`p-4 border rounded-xl flex justify-between ${colors[alert.type]}`}>
            <div className="flex items-center gap-3">
              <AlertTriangle size={20} />
              <div>
                <p className="font-medium">{alert.message}</p>
                <p className="text-xs opacity-70">{alert.time}</p>
              </div>
            </div>

            <button className="px-3 py-1 bg-white rounded-lg text-sm">
              {alert.action}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
