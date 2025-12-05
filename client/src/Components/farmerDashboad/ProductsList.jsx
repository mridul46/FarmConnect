import React, { useMemo, useState } from "react";
import { Edit, Trash2, Plus, ShoppingCart, X, AlertCircle, CheckCircle, TrendingUp, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useProductContext } from "../../Context/productsContext";
import { useAuth } from "../../Context/authContext";
import ProductForm from "./ProductForm"

export default function ProductsList({
  products: propProducts = null,
  getStockStatus,
  onUpdateStock,
  onDelete,
}) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    allProducts,
    productsLoading,
    refreshProducts,
    addToCart,
    fetchProductById,
    deleteProduct: ctxDeleteProduct,
    updateProductStock: ctxUpdateProductStock,
    createProductByFarmer,
    editProductByFarmer,
  } = useProductContext();

  const products = Array.isArray(propProducts) && propProducts.length ? propProducts : allProducts || [];

  const farmerProducts = useMemo(() => {
    if (!user || !user._id) return products;
    const uid = String(user._id);
    return products.filter((p) => {
      const fid = p?.farmerId?._id ?? p?.farmerId ?? p?.farmer?._id ?? p?.farmer;
      return fid ? String(fid) === uid : false;
    });
  }, [products, user]);

  const [filter, setFilter] = useState("");
  const [query, setQuery] = useState("");
  const [updating, setUpdating] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState("create");
  const [editingProduct, setEditingProduct] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const filtered = useMemo(() => {
    let list = (farmerProducts || []).slice();
    if (filter === "low") list = list.filter((p) => (p.stock ?? p.quantity ?? 0) < 10 && (p.stock ?? p.quantity ?? 0) > 0);
    if (filter === "out") list = list.filter((p) => (p.stock ?? p.quantity ?? 0) === 0);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) =>
        (p.name || p.title || "").toLowerCase().includes(q) ||
        (p.category || "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [farmerProducts, filter, query]);

  const stats = useMemo(() => {
    if (!farmerProducts.length) return { total: 0, active: 0, lowStock: 0, outOfStock: 0, totalSold: 0 };
    return {
      total: farmerProducts.length,
      active: farmerProducts.filter((p) => (p.stock ?? p.quantity ?? 0) > 0).length,
      lowStock: farmerProducts.filter((p) => {
        const stock = p.stock ?? p.quantity ?? 0;
        return stock < 10 && stock > 0;
      }).length,
      outOfStock: farmerProducts.filter((p) => (p.stock ?? p.quantity ?? 0) === 0).length,
      totalSold: farmerProducts.reduce((sum, p) => sum + (p.sold ?? p.sales ?? 0), 0),
    };
  }, [farmerProducts]);

  const openCreateDrawer = () => {
    setDrawerMode("create");
    setEditingProduct(null);
    setDrawerOpen(true);
  };

  const openEditDrawer = async (p) => {
    const id = p._id || p.id;
    if (!id) return toast.error("Unable to identify product");
    try {
      setDrawerMode("edit");
      setDrawerLoading(true);
      const fresh = await fetchProductById(id);
      setEditingProduct(fresh);
      setDrawerOpen(true);
    } catch (err) {
      console.error("openEdit failed:", err);
      toast.error("Failed to load product for edit");
    } finally {
      setDrawerLoading(false);
    }
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setEditingProduct(null);
  };

  const handleCreateSubmit = async (productData, imageFile) => {
    setDrawerLoading(true);
    try {
      await createProductByFarmer(productData, imageFile, { navigateTo: null, notify: true });
      toast.success(" Product created successfully!");
      await refreshProducts();
      closeDrawer();
    } catch (err) {
      console.error("create failed:", err);
      toast.error(err?.response?.data?.message || err.message || "Failed to create product");
      throw err;
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleEditSubmit = async (productData, imageFile) => {
    const id = editingProduct?._id || editingProduct?.id;
    if (!id) return toast.error("Invalid product");
    setDrawerLoading(true);
    try {
      await editProductByFarmer(id, productData, imageFile, { navigateTo: null, notify: true });
      toast.success("Product updated successfully!");
      await refreshProducts();
      closeDrawer();
    } catch (err) {
      console.error("edit failed:", err);
      toast.error(err?.response?.data?.message || err.message || "Failed to update product");
      throw err;
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleAddProduct = () => {
    setMobileMenuOpen(false);
    openCreateDrawer();
  };

  const handleEdit = (p) => openEditDrawer(p);

  const handleDelete = async (p) => {
    const id = p._id || p.id;
    if (!id) return toast.error("Unable to identify product");

    const callerDelete = typeof onDelete === "function" ? onDelete : ctxDeleteProduct;

    if (typeof callerDelete !== "function") {
      return toast("Delete action is not implemented. Provide onDelete prop or implement deleteProduct in ProductProvider.", { icon: "⚠️" });
    }

    try {
      setUpdating(id);
      await callerDelete(id);
      toast.success("Product deleted");
      await refreshProducts();
    } catch (err) {
      console.error("delete failed:", err);
      toast.error(err?.response?.data?.message || "Failed to delete product");
    } finally {
      setUpdating(null);
    }
  };

  const handleUpdateStock = async (p, amt) => {
    const id = p._id || p.id;
    const newStock = Number(amt);
    if (!id || Number.isNaN(newStock)) return toast.error("Invalid stock value");

    const callerUpdate = typeof onUpdateStock === "function" ? onUpdateStock : ctxUpdateProductStock;

    if (typeof callerUpdate !== "function") {
      try {
        setUpdating(id);
        await fetchProductById(id).catch(() => {});
        toast("Stock update isn't implemented. Provide onUpdateStock prop or add updateProductStock in ProductProvider.", { icon: "⚠️" });
      } finally {
        setUpdating(null);
      }
      return;
    }

    try {
      setUpdating(id);
      await callerUpdate(id, newStock);
      toast.success("Stock updated");
      await refreshProducts();
    } catch (err) {
      console.error("update stock failed:", err);
      toast.error(err?.response?.data?.message || "Failed to update stock");
    } finally {
      setUpdating(null);
    }
  };

  

  return (
    <>
      <div className="w-full min-h-screen bg-gray-50">
        <div className="w-full px-4 sm:px-6 lg:px-8 py-4 sm:py-8 max-w-7xl mx-auto">
          <div className="space-y-6 sm:space-y-8">
            {/* Header Section */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                <div className="flex-1 min-w-0">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 wrap-break-words">My Products</h1>
                  <p className="text-gray-600 text-xs sm:text-sm mt-1">Manage your farm inventory and track sales</p>
                </div>
                
                <button
                  onClick={handleAddProduct}
                  className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-2.5 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium flex items-center justify-center gap-2 hover:from-green-700 hover:to-green-800 transition shadow-lg hover:shadow-xl shrink-0"
                >
                  <Plus size={16} className="hidden sm:inline" />
                  <Plus size={16} className="sm:hidden" />
                  <span className="hidden xs:inline">Add Product</span>
                  <span className="xs:hidden">Add</span>
                </button>
              </div>

              {/* Stats Cards - Responsive Grid */}
              <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3">
                <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                  <p className="text-xs text-gray-600 mb-1 truncate">Total</p>
                  <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.total}</p>
                </div>
                
                <div className="bg-white border border-green-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                  <p className="text-xs text-green-600 mb-1 truncate">Active</p>
                  <p className="text-xl sm:text-2xl font-bold text-green-600">{stats.active}</p>
                </div>
                
                <div className="bg-white border border-orange-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition">
                  <p className="text-xs text-orange-600 mb-1 truncate">Low</p>
                  <p className="text-xl sm:text-2xl font-bold text-orange-600">{stats.lowStock}</p>
                </div>
                
                <div className="bg-white border border-red-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition hidden xs:block">
                  <p className="text-xs text-red-600 mb-1 truncate">Out</p>
                  <p className="text-xl sm:text-2xl font-bold text-red-600">{stats.outOfStock}</p>
                </div>
                
                <div className="bg-white border border-blue-200 rounded-lg p-3 sm:p-4 hover:shadow-md transition hidden sm:block">
                  <p className="text-xs text-blue-600 mb-1 truncate">Sold</p>
                  <p className="text-xl sm:text-2xl font-bold text-blue-600">{stats.totalSold}</p>
                </div>
              </div>
            </div>

            {/* Search & Filter Section */}
            <div className="bg-white border border-gray-200 rounded-lg p-3 sm:p-4 space-y-3">
              <div className="flex flex-col gap-3">
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />

                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">All Products</option>
                  <option value="low">Low Stock</option>
                  <option value="out">Out of Stock</option>
                </select>
              </div>
            </div>

            {/* Products List */}
            <div className="space-y-3 sm:space-y-4">
              {productsLoading && (products || []).length === 0
                ? new Array(3).fill(0).map((_, i) => (
                    <div key={i} className="bg-white border rounded-lg p-3 sm:p-4 animate-pulse space-y-3">
                      <div className="h-20 sm:h-24 bg-gray-200 rounded"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded"></div>
                      <div className="h-3 sm:h-4 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  ))
                : filtered.length > 0 ? (
                    filtered.map((product) => {
                      const id = product._id || product.id;
                      const stockVal = product.stock ?? product.quantity ?? 0;
                      const stockStatus = typeof getStockStatus === "function"
                        ? getStockStatus(stockVal)
                        : {
                            label: stockVal === 0 ? "Out" : stockVal < 10 ? "Low" : "In Stock",
                            color: stockVal === 0 ? "text-red-600" : stockVal < 10 ? "text-orange-600" : "text-green-600",
                            icon: stockVal === 0 ? AlertCircle : stockVal < 10 ? AlertCircle : CheckCircle,
                          };

                      const StockIcon = stockStatus.icon || CheckCircle;

                      return (
                        <div
                          key={id || product.name || product.title}
                          className="bg-white border border-gray-200 rounded-lg p-3 sm:p-5 hover:shadow-lg transition flex flex-col sm:flex-row gap-3 sm:gap-5 group"
                        >
                          {/* Product Image */}
                          <div className="relative w-full sm:w-28 sm:h-28 h-32 shrink-0">
                            <img
                              src={product.image || product.images?.[0] || "/placeholder.png"}
                              className="w-full h-full rounded-lg object-cover"
                              alt={product.name || product.title}
                            />
                            <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md">
                              <StockIcon size={16} className={`${stockStatus.color} w-4 h-4 sm:w-5 sm:h-5`} />

                            </div>
                          </div>

                          {/* Product Info */}
                          <div className="flex-1 min-w-0 space-y-3">
                            {/* Header with Title and Actions */}
                            <div className="flex items-start justify-between gap-2 sm:gap-3">
                              <div className="min-w-0 flex-1">
                                <h4 className="font-bold text-gray-900 text-base sm:text-lg truncate">
                                  {product.name || product.title}
                                </h4>
                                <div className="flex items-center gap-1 sm:gap-2 mt-1 flex-wrap">
                                  <span className={`text-xs font-semibold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full whitespace-nowrap ${
                                    stockVal === 0
                                      ? "bg-red-100 text-red-700"
                                      : stockVal < 10
                                      ? "bg-orange-100 text-orange-700"
                                      : "bg-green-100 text-green-700"
                                  }`}>
                                    {stockStatus.label}
                                  </span>
                                  {product.category && (
                                    <span className="text-xs bg-gray-100 text-gray-700 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full truncate">
                                      {product.category}
                                    </span>
                                  )}
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex gap-1 shrink-0">
                                <button
                                  title="Edit product"
                                  onClick={() => handleEdit(product)}
                                  className="p-2 hover:bg-blue-100 rounded-lg transition"
                                >
                                  <Edit size={16} className="text-blue-600 sm:w-5 sm:h-5" />
                                </button>

                                <button
                                  title="Delete product"
                                  onClick={() => handleDelete(product)}
                                  disabled={updating === id}
                                  className="p-2 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                                >
                                  <Trash2 size={16} className="text-red-600 sm:w-5 sm:h-5" />
                                </button>
                              </div>
                            </div>

                            {/* Product Details - Responsive Layout */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 pt-2 sm:pt-3 border-t border-gray-100">
                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium truncate">Price</p>
                                <p className="text-base sm:text-lg font-bold text-gray-900 truncate">
                                  ₹{product.price ?? product.pricePerUnit ?? 0}
                                </p>
                                <p className="text-xs text-gray-600 truncate">per {product.unit || "unit"}</p>
                              </div>

                              <div className="min-w-0">
                                <p className="text-xs text-gray-500 font-medium truncate">Stock</p>
                                <p className="text-base sm:text-lg font-bold text-gray-900">{stockVal}</p>
                                <p className="text-xs text-gray-600">units</p>
                              </div>

                              <div className="min-w-0 hidden sm:block">
                                <p className="text-xs text-gray-500 font-medium truncate">Sold</p>
                                <p className="text-base sm:text-lg font-bold text-blue-600 flex items-center gap-1">
                                  <TrendingUp size={14} /> {product.sold ?? product.sales ?? 0}
                                </p>
                                <p className="text-xs text-gray-600">this month</p>
                              </div>

                              {/* Stock Update - Mobile Optimized */}
                              <div className="flex flex-col gap-1 sm:gap-2 min-w-0">
                               <p className="text-xs text-gray-500 font-medium truncate">Update</p>
                               <div className="flex gap-1 flex-col">
                                 <input
                                   type="number"
                                   min={0}
                                   placeholder="qty"
                                   className="flex-1 px-2 py-1 sm:py-1.5 border border-gray-300 rounded text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                   id={`add-stock-${id}`}
                                   disabled={updating === id}
                                 />
                                 <button
                                   onClick={() => {
                                     const el = document.getElementById(`add-stock-${id}`);
                                     const val = el ? Number(el.value) : NaN;
                                     if (Number.isNaN(val) || val < 0) return toast.error("Enter valid stock");
                                     handleUpdateStock(product, val);
                                   }}
                                   disabled={updating === id}
                                   className="px-2 sm:px-3 py-3 sm:py-1.5 bg-green-600 text-white rounded text-xs sm:text-sm font-medium hover:bg-green-700 transition disabled:opacity-50 whitespace-nowrap"
                                 >
                                   Update
                                 </button>
                               </div>
                              </div>

                            </div>

                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="py-12 sm:py-16 text-center">
                      <div className="text-5xl sm:text-6xl mb-4">🌾</div>
                      <p className="text-gray-600 font-medium text-base sm:text-lg">No products found</p>
                      <p className="text-gray-500 text-xs sm:text-sm mt-1 px-4">
                        {query || filter ? "Try adjusting your search filters" : "Start by adding your first product"}
                      </p>
                    </div>
                  )}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Drawer Modal - Responsive */}
      {drawerOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/50 z-40 transition backdrop-blur-sm"
            onClick={() => { if (!drawerLoading) closeDrawer(); }}
          />

          <div className="fixed inset-0 sm:right-0 sm:top-0 sm:h-full sm:w-[620px] bg-white z-50 shadow-2xl overflow-auto animate-slide-in rounded-t-2xl sm:rounded-none flex flex-col max-h-screen sm:max-h-screen">
            {/* Sticky Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between shrink-0">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 flex-1 min-w-0 truncate">
                {drawerMode === "create" ? " Add Product" : drawerLoading ? " Loading..." : ` Edit: ${editingProduct?.title ?? editingProduct?.name ?? "Product"}`}
              </h3>
              <button
                onClick={() => { if (!drawerLoading) closeDrawer(); }}
                className="p-2 rounded-lg hover:bg-gray-100 transition shrink-0"
              >
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-auto">
              <div className="p-4 sm:p-6">
                {drawerMode === "create" && (
                  <ProductForm
                    onSubmit={handleCreateSubmit}
                    submitLabel="Create Product"
                    loading={drawerLoading}
                  />
                )}

                {drawerMode === "edit" && (
                  drawerLoading && !editingProduct ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
                    </div>
                  ) : (
                    <ProductForm
                      initial={editingProduct}
                      onSubmit={handleEditSubmit}
                      submitLabel="Save Changes"
                      loading={drawerLoading}
                    />
                  )
                )}
              </div>
            </div>
          </div>

          <style>{`
            @keyframes slideIn {
              from {
                transform: translateY(100%);
              }
              to {
                transform: translateY(0);
              }
            }
            @media (min-width: 640px) {
              @keyframes slideIn {
                from {
                  transform: translateX(100%);
                }
                to {
                  transform: translateX(0);
                }
              }
            }
            .animate-slide-in {
              animation: slideIn 0.3s ease-out;
            }
          `}</style>
        </>
      )}
    </>
  );
}