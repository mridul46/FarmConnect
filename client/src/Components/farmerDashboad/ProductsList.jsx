import React from "react";
import { Edit, Trash2, Plus } from "lucide-react";

export default function ProductsList({ products, getStockStatus }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-900">My Products</h3>

        <div className="flex gap-3">
          <select className="px-4 py-2 border rounded-lg text-sm">
            <option>All Products</option>
            <option>Active</option>
            <option>Low Stock</option>
            <option>Out of Stock</option>
          </select>

          <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center gap-2">
            <Plus size={16} /> Add Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {products.map((product) => {
          const stockStatus = getStockStatus(product.stock);

          return (
            <div
              key={product.id}
              className="bg-linear-to-br from-white to-gray-50 border rounded-xl p-5"
            >
              <div className="flex gap-4">
                <img
                  src={product.image}
                  className="w-24 h-24 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {product.name}
                      </h4>
                      <p className={`text-sm ${stockStatus.color}`}>
                        {stockStatus.label}
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-blue-100 rounded-lg">
                        <Edit size={16} className="text-blue-600" />
                      </button>
                      <button className="p-2 hover:bg-red-100 rounded-lg">
                        <Trash2 size={16} className="text-red-600" />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-6 mb-3">
                    <p>
                      <span className="text-xs text-gray-500">Price</span>
                      <br />
                      <span className="font-semibold">
                        ₹{product.price}/{product.unit}
                      </span>
                    </p>

                    <p>
                      <span className="text-xs text-gray-500">Stock</span>
                      <br />
                      <span className="font-semibold">{product.stock}</span>
                    </p>

                    <p>
                      <span className="text-xs text-gray-500">Sold</span>
                      <br />
                      <span className="font-semibold">{product.sold}</span>
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Add stock"
                      className="flex-1 px-3 py-2 border rounded-lg text-sm"
                    />
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm">
                      Update
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
