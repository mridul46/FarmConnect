// ==========================================
// controllers/user/farmer.controllers.js
// Farmer-specific operations
// ==========================================

import { Product } from "../../models/Product.model.js";
import { Order } from "../../models/Order.model.js";

// Get farmer dashboard stats
export const getFarmerStats = asyncHandler(async (req, res) => {
  const farmerId = req.user._id;
  
  const [
    totalProducts,
    activeProducts,
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue,
    monthlyRevenue
  ] = await Promise.all([
    Product.countDocuments({ farmerId }),
    Product.countDocuments({ 
      farmerId, 
      visible: true, 
      stockQuantity: { $gt: 0 } 
    }),
    Order.countDocuments({ 'items.farmerId': farmerId }),
    Order.countDocuments({ 
      'items.farmerId': farmerId, 
      status: { $in: ['pending', 'paid'] } 
    }),
    Order.countDocuments({ 
      'items.farmerId': farmerId, 
      status: 'delivered' 
    }),
    Order.aggregate([
      { $unwind: '$items' },
      { $match: { 'items.farmerId': farmerId, status: 'delivered' } },
      { 
        $group: { 
          _id: null, 
          total: { 
            $sum: { 
              $multiply: ['$items.priceAtPurchase', '$items.qty'] 
            } 
          } 
        } 
      }
    ]),
    Order.aggregate([
      { $unwind: '$items' },
      {
        $match: {
          'items.farmerId': farmerId,
          status: 'delivered',
          createdAt: { $gte: new Date(new Date().setDate(1)) }
        }
      },
      { 
        $group: { 
          _id: null, 
          total: { 
            $sum: { 
              $multiply: ['$items.priceAtPurchase', '$items.qty'] 
            } 
          } 
        } 
      }
    ])
  ]);
  
  const topProducts = await Order.aggregate([
    { $unwind: '$items' },
    { $match: { 'items.farmerId': farmerId, status: 'delivered' } },
    {
      $group: {
        _id: '$items.productId',
        title: { $first: '$items.title' },
        totalSold: { $sum: '$items.qty' },
        revenue: { 
          $sum: { 
            $multiply: ['$items.priceAtPurchase', '$items.qty'] 
          } 
        }
      }
    },
    { $sort: { revenue: -1 } },
    { $limit: 5 }
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
      stats: {
        products: {
          total: totalProducts,
          active: activeProducts
        },
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders
        },
        revenue: {
          total: totalRevenue[0]?.total || 0,
          thisMonth: monthlyRevenue[0]?.total || 0
        }
      },
      topProducts
    }
  });
});

// Update farmer-specific profile fields
export const updateFarmerProfile = asyncHandler(async (req, res) => {
  const { shopName, bankDetails } = req.body;
  
  if (req.user.role !== 'farmer') {
    return res.status(403).json({
      success: false,
      message: 'Only farmers can update these fields'
    });
  }
  
  const updateFields = {};
  if (shopName) updateFields.shopName = shopName;
  
  // FIXED: Properly update nested bankDetails
  if (bankDetails) {
    if (bankDetails.accountNumber) {
      updateFields['bankDetails.accountNumber'] = bankDetails.accountNumber;
    }
    if (bankDetails.ifscCode) {
      updateFields['bankDetails.ifscCode'] = bankDetails.ifscCode.toUpperCase();
    }
    if (bankDetails.accountHolderName) {
      updateFields['bankDetails.accountHolderName'] = bankDetails.accountHolderName;
    }
    if (bankDetails.upiId) {
      // Validate UPI format
      const upiRegex = /^[\w.-]+@[\w.-]+$/;
      if (!upiRegex.test(bankDetails.upiId)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid UPI ID format'
        });
      }
      updateFields['bankDetails.upiId'] = bankDetails.upiId;
    }
  }
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select('+bankDetails');  // Include bankDetails in response
  
  res.status(200).json({
    success: true,
    message: 'Farmer profile updated successfully',
    data: user
  });
});
// Get nearby farmers (public)
export const getNearbyFarmers = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 10, page = 1, limit = 20 } = req.query;
  
  if (!lat || !lng) {
    return res.status(400).json({
      success: false,
      message: 'Please provide latitude and longitude'
    });
  }
  
  const skip = (page - 1) * limit;
  
  // FIXED: Using GeoJSON format for $near query
  const farmers = await User.find({
    role: 'farmer',
    verified: true,
    'address.coords': {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [parseFloat(lng), parseFloat(lat)]  // [longitude, latitude]
        },
        $maxDistance: radius * 1000  // Convert km to meters
      }
    }
  })
    .select('name shopName avatar rating address')
    .skip(skip)
    .limit(parseInt(limit));
  
  const total = await User.countDocuments({
    role: 'farmer',
    verified: true
  });
  
  res.status(200).json({
    success: true,
    count: farmers.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: farmers
  });
});
// Get farmer public profile with products
export const getFarmerProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-bankDetails -refreshToken');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  if (user.role !== 'farmer') {
    return res.status(400).json({
      success: false,
      message: 'User is not a farmer'
    });
  }
  
  const products = await Product.find({ 
    farmerId: user._id,
    visible: true 
  })
    .select('title category pricePerUnit images rating')
    .limit(10);
  
  const stats = {
    totalProducts: await Product.countDocuments({ 
      farmerId: user._id,
      visible: true 
    }),
    totalOrders: await Order.countDocuments({ 
      'items.farmerId': user._id,
      status: 'delivered'
    })
  };
  
  res.status(200).json({
    success: true,
    data: {
      user,
      products,
      stats
    }
  });
});

// Rate a farmer
export const rateFarmer = asyncHandler(async (req, res) => {
  const { rating } = req.body;
  
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid rating between 1 and 5'
    });
  }
  
  const farmer = await User.findById(req.params.id);
  
  if (!farmer) {
    return res.status(404).json({
      success: false,
      message: 'Farmer not found'
    });
  }
  
  if (farmer.role !== 'farmer') {
    return res.status(400).json({
      success: false,
      message: 'Can only rate farmers'
    });
  }
  
  const currentTotal = farmer.rating.average * farmer.rating.count;
  const newCount = farmer.rating.count + 1;
  const newAverage = (currentTotal + rating) / newCount;
  
  farmer.rating.average = Math.round(newAverage * 10) / 10;
  farmer.rating.count = newCount;
  
  await farmer.save();
  
  res.status(200).json({
    success: true,
    message: 'Rating submitted successfully',
    data: {
      rating: farmer.rating
    }
  });
});
