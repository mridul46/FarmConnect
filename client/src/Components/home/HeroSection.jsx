import React from 'react'
import {ShoppingBag, ChevronRight,Star} from 'lucide-react'
const HeroSection = () => {
  return (
   <section className="relative overflow-hidden py-24 px-6 md:px-10 bg-linear-to-r from-green-50 to-emerald-50">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
        <div className="z-10">
          <div className="mb-4 px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-sm font-medium inline-block">
            🌱 From Local Farms to Your Table
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Fresh & Fair
            <span className="block bg-linear-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              Direct from Farmers
            </span>
          </h1>

          <p className="text-lg text-gray-600 mb-8">
            Skip the middlemen. Support farmers and get fresh, organic produce
            delivered to your doorstep within hours of harvest.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <button className="px-8 py-4 bg-linear-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-transform hover:scale-105 flex items-center gap-2">
              <ShoppingBag size={20} />
              Start Shopping
              <ChevronRight size={18} />
            </button>

            <button className="px-8 py-4 border-2 border-green-600 text-green-700 font-semibold rounded-xl hover:bg-green-50 transition">
              I'm a Farmer
            </button>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  src={`https://api.dicebear.com/7.x/avataaars/svg?seed=user${i}`}
                  className="w-10 h-10 rounded-full border-2 border-white shadow"
                />
              ))}
            </div>
            <div>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star
                    key={i}
                    size={16}
                    className="text-yellow-400 fill-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-semibold text-gray-900">15,000+</span>{" "}
                satisfied customers
              </p>
            </div>
          </div>
        </div>

        <div className="relative">
          <img
            src="https://images.unsplash.com/photo-1488459716781-31db52582fe9?w=800"
            alt="Farm produce"
            className="rounded-3xl shadow-2xl w-full"
          />
          <div className="absolute -top-5 -left-5 bg-white shadow-lg p-4 rounded-xl border border-gray-100 animate-bounce">
            <p className="font-semibold text-gray-800">🚚 Fast Delivery</p>
            <p className="text-sm text-gray-500">Under 24 hours</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HeroSection