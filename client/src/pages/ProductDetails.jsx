import React from 'react';
import { useState } from 'react';
import { ArrowLeft, Heart, Share2, MapPin, User, Star, Check, MessageCircle, ShoppingCart, Leaf, Droplet, Sun, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';


export default function ProductDetailsUI() {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [showNotification, setShowNotification] = useState(false);

  const navigate= useNavigate()

  const backToProduct=()=>{
    navigate("/products")
  }

  // Sample product data - can be updated from props
  const product = {
    _id: '1',
    title: 'Organic Farm Fresh Tomatoes',
    category: 'Vegetables',
    pricePerUnit: 45,
    unit: 'kg',
    stockQuantity: 150,
    images: [
      'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=600',
      'https://images.unsplash.com/photo-1587381671718-e9fc59f4d0b5?w=600'
    ],
    farmerName: 'Rajesh Kumar',
    farmId: 'farm123',
    distance: 2.5,
    organic: true,
    rating: 4.8,
    reviews: 120,
    description: 'Fresh, juicy organic tomatoes grown without any chemical pesticides or fertilizers. Hand-picked daily from our farm to ensure maximum freshness and quality. Perfect for salads, cooking, and juice.',
    nutritionInfo: {
      calories: '18 kcal',
      protein: '0.9g',
      carbs: '3.9g',
      fat: '0.2g',
      vitaminC: '13.7mg'
    },
    farmingMethods: ['Organic Farming', 'Drip Irrigation', 'No Pesticides'],
    harvestDate: '2025-01-28',
    shelf: '5-7 days',
    certifications: ['Organic Certified', 'Food Safety']
  };

  const handleAddToCart = () => {
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Notification Toast */}
      {showNotification && (
        <div className="fixed top-4 right-4 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50 animate-fade-in">
          <Check size={20} />
          <span>Added {quantity} {product.unit} to cart!</span>
          <button onClick={() => setShowNotification(false)} className="ml-2">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={()=>backToProduct()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ArrowLeft size={24} className="text-gray-700" />
            </button>
            <h1 className="text-lg sm:text-xl font-semibold text-gray-900 hidden sm:block">Product Details</h1>
          </div>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Share2 size={20} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-2">
            <div className="relative bg-gray-100 rounded-2xl overflow-hidden h-80 sm:h-96 mb-4 group">
              <img 
                src={product.images[0]} 
                alt={product.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="absolute top-4 right-4 p-3 bg-white rounded-full shadow-lg hover:scale-110 transition-transform"
              >
                <Heart 
                  size={20} 
                  className={isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-400'}
                />
              </button>
              <span className="absolute top-4 left-4 bg-green-600 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium">
                In Stock
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <img 
                  key={idx}
                  src={img} 
                  alt={`thumbnail-${idx}`}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg object-cover cursor-pointer border-2 border-gray-200 hover:border-green-600 shrink-0"
                />
              ))}
            </div>
          </div>

          {/* Right: Product Info */}
          <div className="lg:col-span-3">
            {/* Category & Title */}
            <div className="mb-6">
              <div className="flex flex-wrap items-center gap-2 mb-3">
                <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-md">
                  {product.category}
                </span>
                {product.organic && (
                  <span className="text-xs font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-md flex items-center gap-1">
                    <Leaf size={12} /> Organic
                  </span>
                )}
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">{product.title}</h2>
              
              {/* Rating */}
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <div className="flex items-center gap-1">
                  <Star size={18} className="text-yellow-400 fill-yellow-400" />
                  <span className="font-semibold text-gray-900">{product.rating}</span>
                  <span className="text-gray-500 text-sm">({product.reviews} reviews)</span>
                </div>
              </div>
            </div>

            {/* Price & Stock Card */}
            <div className="bg-linear-to-br from-green-50 to-emerald-50 rounded-2xl p-5 sm:p-6 mb-6 border border-green-100">
              <div className="flex items-end justify-between mb-4">
                <div>
                  <p className="text-gray-600 text-sm mb-1">Price per unit</p>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl sm:text-4xl font-bold text-gray-900">₹{product.pricePerUnit}</span>
                    <span className="text-base sm:text-lg text-gray-500">/{product.unit}</span>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-4 flex items-center gap-1">
                <MapPin size={14} /> {product.distance} km away • Fresh today
              </p>
              
              {/* Quantity Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-5">
                <span className="text-sm font-medium text-gray-700">Quantity:</span>
                <div className="flex items-center border-2 border-green-600 rounded-lg">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 sm:px-4 py-2 hover:bg-green-50 transition-colors text-gray-700 font-medium"
                  >
                    −
                  </button>
                  <span className="px-4 sm:px-5 py-2 font-semibold text-gray-900 border-l border-r border-green-600">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 sm:px-4 py-2 hover:bg-green-50 transition-colors text-gray-700 font-medium"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-600/30"
                >
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button className="flex-1 border-2 border-green-600 text-green-600 py-3 rounded-xl font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2">
                  <MessageCircle size={20} />
                  Message
                </button>
              </div>
            </div>

            {/* Farmer Info */}
            <div className="bg-white rounded-2xl p-4 sm:p-5 border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-linear-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-lg shrink-0">
                    RK
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{product.farmerName}</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Check size={14} className="text-green-600" /> Verified Farmer
                    </p>
                  </div>
                </div>
                <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 transition-colors w-full sm:w-auto">
                  Visit Store
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-10 sm:mt-12 bg-white rounded-2xl shadow-sm border border-gray-100">
          <div className="border-b border-gray-200 flex gap-4 sm:gap-8 px-4 sm:px-6 overflow-x-auto">
            {['details', 'nutrition', 'farming', 'reviews'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 font-medium text-sm transition-colors border-b-2 whitespace-nowrap ${
                  activeTab === tab 
                    ? 'text-green-600 border-green-600' 
                    : 'text-gray-600 border-transparent hover:text-gray-900'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-4 sm:p-6">
            {activeTab === 'details' && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-3">Product Description</h3>
                <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>
                
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Storage & Shelf Life</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">Harvest Date</p>
                    <p className="font-semibold text-gray-900">{product.harvestDate}</p>
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                    <p className="text-sm text-gray-600 mb-1">Shelf Life</p>
                    <p className="font-semibold text-gray-900">{product.shelf}</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Nutritional Information (per 100g)</h3>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 sm:gap-4">
                  {Object.entries(product.nutritionInfo).map(([key, value]) => (
                    <div key={key} className="bg-linear-to-br from-orange-50 to-amber-50 rounded-lg p-4 text-center border border-orange-100">
                      <p className="text-xs text-gray-600 mb-2 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                      <p className="font-bold text-base sm:text-lg text-gray-900">{value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'farming' && (
              <div>
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Farming Methods</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  {product.farmingMethods.map((method, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                      <Check size={20} className="text-green-600 shrink-0" />
                      <span className="font-medium text-gray-900">{method}</span>
                    </div>
                  ))}
                </div>
                
                <h3 className="font-semibold text-lg text-gray-900 mb-4">Certifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {product.certifications.map((cert, idx) => (
                    <div key={idx} className="flex items-center gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <Leaf size={20} className="text-blue-600 shrink-0" />
                      <span className="font-medium text-gray-900">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div>
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-6">
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-3">Customer Reviews</h3>
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                        ))}
                      </div>
                      <span className="font-semibold text-gray-900">4.8 out of 5</span>
                      <span className="text-gray-600 text-sm">({product.reviews} reviews)</span>
                    </div>
                  </div>
                  <button className="px-4 py-2 border border-green-600 text-green-600 rounded-lg font-medium hover:bg-green-50 w-full sm:w-auto">
                    Write Review
                  </button>
                </div>
                
                <div className="space-y-4">
                  {[1, 2].map(i => (
                    <div key={i} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 mb-2">
                        <div>
                          <p className="font-semibold text-gray-900">Great quality tomatoes!</p>
                          <p className="text-sm text-gray-600">Priya M.</p>
                        </div>
                        <div className="flex gap-1">
                          {[...Array(5)].map((_, j) => (
                            <Star key={j} size={14} className="text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm">Fresh and delicious. Arrived well packaged. Highly recommend!</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}