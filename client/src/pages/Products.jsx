// src/pages/Products.jsx
import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/Products/ProductCard/";
import { Leaf, ShoppingCart, Search } from "lucide-react";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router-dom";
import { useProductContext } from "../Context/productsContext";

export default function Products() {
  const navigate = useNavigate();
  const {
    allProducts = [],
    productsLoading,
    productsError,
    fetchProducts,
    addToCart,
    cartCount
  } = useProductContext();

  // UI state
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showOrganicOnly, setShowOrganicOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("");

  // fetch products on mount (context already does an initial fetch, but safe to call)
  useEffect(() => {
    fetchProducts().catch(() => {});
  }, [fetchProducts]);

  // dynamic categories from backend (safe)
  const categories = useMemo(() => {
    const set = new Set((allProducts || []).map((p) => p?.category).filter(Boolean));
    return ["All", ...Array.from(set)];
  }, [allProducts]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product._id ?? product.id ?? product, 1);
      navigate("/add-to-cart");
    } catch (err) {
      console.error("Failed to add to cart", err);
      navigate("/add-to-cart");
    }
  };

  const handleViewDetails = (id) => {
    if (!id) return;
    navigate(`/view-details/${id}`);
  };
  const handleChat = (farmer) => console.log("Chat with:", farmer);

  // Derived filtered list (client-side) with robust distance sorting
  const filteredProducts = useMemo(() => {
    let result = Array.isArray(allProducts) ? [...allProducts] : [];

    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((p) => p?.category === selectedCategory);
    }

    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          ((p.title || p.name || "") + " " + (p.farmerName || p.farmer?.name || "") + " " + (p.category || ""))
            .toLowerCase()
            .includes(q)
      );
    }

    if (showOrganicOnly) result = result.filter((p) => p?.organic === true);
    if (showInStockOnly) result = result.filter((p) => (p?.stockQuantity ?? p?.stock ?? 0) > 0);

    // sorting helpers
    // const safeNum = (v) => {
    //   if (v == null) return Infinity; // missing -> push to end
    //   const n = Number(v);
    //   return Number.isNaN(n) ? Infinity : n;
    // };
    const safeNum = (v) => (Number.isFinite(Number(v)) ? Number(v) : Infinity);

    if (sortBy === "price-asc") {
      result.sort((a, b) => (safeNum(a?.pricePerUnit) - safeNum(b?.pricePerUnit)));
    }
    if (sortBy === "price-desc") {
      result.sort((a, b) => (safeNum(b?.pricePerUnit) - safeNum(a?.pricePerUnit)));
    }

  

if (sortBy === "distance") {
  result.sort((a, b) => {
    const da = safeNum(a?.distance);
    const db = safeNum(b?.distance);
    if (da === db) {
      // tie-break: cheaper price first
      return safeNum(a?.pricePerUnit ?? a?.price ?? 0) - safeNum(b?.pricePerUnit ?? b?.price ?? 0);
    }
    return da - db;
  });
}

    if (sortBy === "stock") {
      result.sort((a, b) => (safeNum(b?.stockQuantity ?? b?.stock) - safeNum(a?.stockQuantity ?? a?.stock)));
    }

    return result;
  }, [allProducts, selectedCategory, searchTerm, showOrganicOnly, showInStockOnly, sortBy]);

  return (
    <div className="min-h-screen bg-linear-to-r from-green-50 via-white to-emerald-50 transition-colors">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                <Leaf size={26} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">Fresh Produce</h1>
                <p className="hidden sm:block text-sm text-gray-500">Direct from local farmers — fresh & transparent</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="relative hidden sm:flex items-center w-96">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </span>

                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products, farmers or categories"
                  className="pl-10 pr-4 py-2 w-full rounded-2xl border border-gray-200 shadow-sm 
                             text-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                />
              </div>

              {/* Cart */}
              <button
                onClick={() => navigate("/add-to-cart")}
                className="relative px-3 py-2 rounded-xl bg-emerald-600 text-white flex items-center gap-2 hover:scale-105 transition-transform shadow-md"
              >
                <ShoppingCart size={18} />
                <span className="text-sm font-medium">Cart</span>
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-6 h-6 flex items-center justify-center shadow">{cartCount}</span>
              </button>
            </div>
          </div>

          {/* Category chips */}
          <div className="mt-4 flex gap-2 overflow-x-auto py-2">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === c ? 'bg-emerald-600 text-white shadow' : 'bg-white border border-gray-200 text-gray-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Controls row */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white border rounded-xl px-3 py-2 shadow-sm">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showOrganicOnly} onChange={(e) => setShowOrganicOnly(e.target.checked)} />
                <span className="text-sm">Organic</span>
              </label>
              <div className="h-5 w-px bg-gray-200 mx-2" />
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={showInStockOnly} onChange={(e) => setShowInStockOnly(e.target.checked)} />
                <span className="text-sm">In stock</span>
              </label>
            </div>

            <div className="hidden sm:flex items-center gap-2">
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="px-3 py-2 border rounded-xl text-sm bg-white">
                <option value="">Sort</option>
                <option value="price-asc">Price: Low → High</option>
                <option value="price-desc">Price: High → Low</option>
                <option value="distance">Nearest</option>
                <option value="stock">Most stock</option>
              </select>

              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchTerm("");
                  setShowOrganicOnly(false);
                  setShowInStockOnly(false);
                  setSortBy("");
                }}
                className="px-4 py-2 rounded-xl border bg-white text-sm"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Search for small screens */}
          <div className="w-full md:w-1/2">
            <div className="flex sm:hidden items-center gap-2">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </span>
                <input
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search products or farmers"
                  className="pl-10 pr-4 py-2 w-full rounded-2xl border border-gray-200 shadow-sm text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product list + empty state */}
      <main className="max-w-7xl mx-auto px-6 pb-20">
        {productsLoading ? (
          <div className="p-12 bg-white rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold">Loading products…</h3>
          </div>
        ) : productsError ? (
          <div className="p-12 bg-white rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold">Failed to load products</h3>
            <p className="text-gray-600 mt-2">{productsError}</p>
            <div className="mt-4">
              <button onClick={() => fetchProducts().catch(()=>{})} className="px-4 py-2 rounded-xl border">Retry</button>
            </div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="p-12 bg-white rounded-xl shadow text-center">
            <h3 className="text-xl font-semibold">No products match your filters.</h3>
            <p className="text-gray-600 mt-2">Try clearing filters or search terms.</p>
            <div className="mt-4">
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSearchTerm("");
                  setShowOrganicOnly(false);
                  setShowInStockOnly(false);
                  setSortBy("");
                }}
                className="px-4 py-2 rounded-xl border"
              >
                Reset Filters
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product._id ?? product.id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                onViewDetails={() => handleViewDetails(product._id ?? product.id)}
                onChat={() => handleChat(product.farmerName)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating quick cart (mobile) */}
      <button
        onClick={() => navigate("/add-to-cart")}
        className="fixed bottom-6 right-6 md:hidden flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg"
      >
        <ShoppingCart />
        <span className="font-medium">Cart ({cartCount})</span>
      </button>

      <Footer />
    </div>
  );
}
