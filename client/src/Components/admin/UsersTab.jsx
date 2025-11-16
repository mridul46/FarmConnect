import React from "react";
import { Search, Eye, Edit, Trash2, CheckCircle, XCircle } from "lucide-react";
import recentUsers from "../../assets/recentOrders";

export default function UsersTab() {
  const getStatusColor = (status) => {
    const colors = {
      active: "bg-green-100 text-green-700 border-green-200",
      pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
      suspended: "bg-red-100 text-red-700 border-red-200",
    };
    return colors[status] || colors.pending;
  };

  const getRoleColor = (role) => {
    const colors = {
      farmer: "bg-green-100 text-green-700",
      consumer: "bg-blue-100 text-blue-700",
      admin: "bg-purple-100 text-purple-700",
    };
    return colors[role] || colors.consumer;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">Recent Users</h3>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="pl-10 pr-4 py-2 border rounded-lg text-sm"
            />
          </div>

          <select className="px-4 py-2 border rounded-lg text-sm">
            <option>All Roles</option>
            <option>Farmers</option>
            <option>Consumers</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="py-3 px-4 text-left">User</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-left">Orders</th>
              <th className="py-3 px-4 text-left">Revenue</th>
              <th className="py-3 px-4 text-left">Joined</th>
              <th className="py-3 px-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {recentUsers.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-50">
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <img src={user.avatar} className="w-10 h-10 rounded-full" />
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                </td>

                <td className="py-4 px-4">
                  <span className={`px-3 py-1 text-xs rounded-full font-medium ${getRoleColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    {user.verified ? (
                      <CheckCircle size={16} className="text-green-600" />
                    ) : (
                      <XCircle size={16} className="text-red-600" />
                    )}

                    <span className={`px-3 py-1 text-xs rounded-full border font-medium ${getStatusColor(user.status)}`}>
                      {user.status}
                    </span>
                  </div>
                </td>

                <td className="py-4 px-4">{user.orders}</td>
                <td className="py-4 px-4 font-semibold">{user.revenue}</td>
                <td className="py-4 px-4">{user.joinDate}</td>

                <td className="py-4 px-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-blue-100 rounded-lg"><Eye size={16} className="text-blue-600" /></button>
                    <button className="p-2 hover:bg-green-100 rounded-lg"><Edit size={16} className="text-green-600" /></button>
                    <button className="p-2 hover:bg-red-100 rounded-lg"><Trash2 size={16} className="text-red-600" /></button>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
