import React from "react";
import ProductCard from "../components/Products/ProductCard";
import { Leaf } from "lucide-react";
import Footer from "../components/layout/Footer";
export default function Products() {
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
  }

  ];

  const handleAddToCart = (product) => console.log("Add to cart", product);
  const handleViewDetails = (id) => console.log("View", id);
  const handleChat = (farmer) => console.log("Chat with:", farmer);

  return (
     <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      
          {/* Main Container */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      
            {/* LEFT: Logo + Title */}
            <div className="flex items-center gap-4">
              {/* Logo */}
              <div className="w-12 h-12 bg-linear-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center shadow-md shrink-0">
                <Leaf size={26} className="text-white" />
              </div>
      
              {/* Title Block */}
              <div className="flex flex-col">
                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight">
                  Fresh Produce
                </h1>
                <p className="text-gray-600 text-sm sm:text-base">
                  Direct from local farmers near you
                </p>
              </div>
            </div>
      
            {/* RIGHT: Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              
              <button className="px-5 sm:px-6 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors w-full sm:w-auto">
                Filters
              </button>
      
              <button className="px-5 sm:px-6 py-2.5 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors shadow-lg shadow-green-600/30 w-full sm:w-auto">
                Cart (0)
              </button>
      
            </div>
      
          </div>
      
        </div>
      </div>
      

      {/* ........product list........................................ */}
    <div className="min-h-screen bg-linear-to-br from-green-50 via-white to-emerald-50">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {sampleProducts.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              onViewDetails={handleViewDetails}
              onChat={handleChat}
            />
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </div>
  );
}
