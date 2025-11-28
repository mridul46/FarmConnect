import React, { useEffect, useMemo, useState } from "react";
import ProductCard from "../components/Products/ProductCard/";
import { Leaf, ShoppingCart, Search } from "lucide-react";
import Footer from "../components/layout/Footer";
import { useNavigate } from "react-router-dom";

export default function Products() {
  const navigate = useNavigate();

  const sampleProducts = [
    {
      _id: "1",
      title: "Organic Farm Fresh Tomatoes",
      category: "Vegetables",
      pricePerUnit: 45,
      unit: "kg",
      stockQuantity: 150,
      images: [
        "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=400",
      ],
      farmerName: "Rajesh Kumar",
      distance: 2.5,
      organic: true,
    },
    {
      _id: "2",
      title: "Sweet Alphonso Mangoes",
      category: "Fruits",
      pricePerUnit: 120,
      unit: "kg",
      stockQuantity: 8,
      images: [
        "https://images.unsplash.com/photo-1553279768-865429fa0078?w=400",
      ],
      farmerName: "Priya Sharma",
      distance: 5.2,
      organic: false,
    },
    {
      _id: "3",
      title: "Fresh Green Spinach",
      category: "Leafy Greens",
      pricePerUnit: 30,
      unit: "bunch",
      stockQuantity: 0,
      images: [
        "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400",
      ],
      farmerName: "Amit Patel",
      distance: 1.8,
      organic: true,
    },
    {
      _id: "4",
      title: "Crisp Lettuce",
      category: "Leafy Greens",
      pricePerUnit: 25,
      unit: "bunch",
      stockQuantity: 45,
      images: [
        "https://images.unsplash.com/photo-1506801310323-534be5e7c1f5?w=400",
      ],
      farmerName: "Neha Verma",
      distance: 4.2,
      organic: true,
    },
    {
      _id: "5",
      title: "Golden Potatoes",
      category: "Vegetables",
      pricePerUnit: 40,
      unit: "kg",
      stockQuantity: 120,
      images: [
        "https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=400",
      ],
      farmerName: "Ramesh Yadav",
      distance: 3.9,
      organic: false,
    },
    {
      _id: "6",
      title: "Juicy Watermelons",
      category: "Fruits",
      pricePerUnit: 28,
      unit: "piece",
      stockQuantity: 32,
      images: [
        "https://images.unsplash.com/photo-1560807707-8cc77767d783?w=400",
      ],
      farmerName: "Sunita Mishra",
      distance: 6.3,
      organic: true,
    },
    {
      _id: "7",
      title: "Premium Brown Eggs",
      category: "Dairy & Poultry",
      pricePerUnit: 6,
      unit: "piece",
      stockQuantity: 200,
      images: [
        "https://images.unsplash.com/photo-1560185127-6ed189bf02df?w=400",
      ],
      farmerName: "Harpreet Singh",
      distance: 2.0,
      organic: false,
    },
    {
      _id: "8",
      title: "Farm Fresh Cucumbers",
      category: "Vegetables",
      pricePerUnit: 35,
      unit: "kg",
      stockQuantity: 60,
      images: [
        "https://images.unsplash.com/photo-1592924356763-7fbd308014c5?w=400",
      ],
      farmerName: "Kavita Joshi",
      distance: 1.4,
      organic: true,
    },
    {
      _id: "9",
      title: "Sweet Pineapples",
      category: "Fruits",
      pricePerUnit: 55,
      unit: "piece",
      stockQuantity: 25,
      images: [
        "https://images.unsplash.com/photo-1502741338009-cac2772e18bc?w=400",
      ],
      farmerName: "Vikram Rao",
      distance: 7.1,
      organic: false,
    },
  ];

  const categories = [
    "All",
    "Vegetables",
    "Fruits",
    "Grains",
    "Dairy & Poultry",
    "Leafy Greens",
    "Herbs",
    "Other",
  ];

  // UI state
  const [products] = useState(sampleProducts);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [showOrganicOnly, setShowOrganicOnly] = useState(false);
  const [showInStockOnly, setShowInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("");
  const [cartCount, setCartCount] = useState(0);

const handleAddToCart = (id) => {
  setCartCount((prev) => prev + 1);
  navigate(`/add-to-card/${id}`);
};

// Load initial cart count
useEffect(() => {
  const saved = localStorage.getItem("cartCount");
  if (saved) setCartCount(Number(saved));
}, []);

// Save cart count to local storage
useEffect(() => {
  localStorage.setItem("cartCount", cartCount);
}, [cartCount]);

    const handleViewDetails = (id) => {
    navigate(`/view-details/${id}`);
  };
  const handleChat = (farmer) => console.log("Chat with:", farmer);

  // Derived filtered list
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Category
    if (selectedCategory && selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    // Search
    if (searchTerm.trim() !== "") {
      const q = searchTerm.toLowerCase();
      result = result.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.farmerName.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }

    // Organic
    if (showOrganicOnly) result = result.filter((p) => p.organic === true);

    // In stock
    if (showInStockOnly) result = result.filter((p) => p.stockQuantity > 0);

    // Sorting
    if (sortBy === "price-asc") result.sort((a, b) => a.pricePerUnit - b.pricePerUnit);
    if (sortBy === "price-desc") result.sort((a, b) => b.pricePerUnit - a.pricePerUnit);
    if (sortBy === "distance") result.sort((a, b) => a.distance - b.distance);
    if (sortBy === "stock") result.sort((a, b) => b.stockQuantity - a.stockQuantity);

    return result;
  }, [products, selectedCategory, searchTerm, showOrganicOnly, showInStockOnly, sortBy]);

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
              {/* Search */}
             
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
                onClick={() => navigate('/checkout')}
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

      {/* Controls row (compact) */}
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
        {filteredProducts.length === 0 ? (
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
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                onViewDetails={handleViewDetails}
                onChat={handleChat}
              />
            ))}
          </div>
        )}
      </main>

      {/* Floating quick cart (mobile) */}
      <button
        onClick={() => navigate('/checkout')}
        className="fixed bottom-6 right-6 md:hidden flex items-center gap-3 bg-emerald-600 text-white px-4 py-3 rounded-2xl shadow-lg"
      >
        <ShoppingCart />
        <span className="font-medium">Cart ({cartCount})</span>
      </button>

      <Footer />
    </div>
  );
}
