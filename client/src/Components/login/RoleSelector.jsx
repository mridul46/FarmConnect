
import React from "react";
import { User, Tractor, CheckCircle } from "lucide-react";

export default function RoleSelector({ role, setRole }) {
  const roles = [
    { id: "consumer", label: "Consumer", icon: User, color: "blue", desc: "Buy fresh produce" },
    { id: "farmer", label: "Farmer", icon: Tractor, color: "green", desc: "Sell your harvest" }
  ];

  return (
    <div className="grid grid-cols-2 gap-3 mt-2">
      {roles.map((r) => {
        const selected = role === r.id;
        const Icon = r.icon;

        return (
          <button
            key={r.id}
            type="button"
            onClick={() => setRole(r.id)}
            className={`relative p-4 rounded-xl border-2 ${
              selected ? "border-green-500 bg-green-50 shadow-lg" : "border-gray-200"
            }`}
          >
            {selected && (
              <CheckCircle className="absolute top-2 right-2 text-green-600" size={20} />
            )}

            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center mb-2 ${
                selected ? "bg-green-500" : "bg-gray-100"
              }`}
            >
              <Icon size={22} className={selected ? "text-white" : "text-gray-600"} />
            </div>

            <p className={`font-semibold ${selected ? "text-green-700" : "text-gray-900"}`}>
              {r.label}
            </p>
            <p className="text-xs text-gray-500">{r.desc}</p>
          </button>
        );
      })}
    </div>
  );
}
