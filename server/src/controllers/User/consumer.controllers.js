// ==========================================
// controllers/user/consumer.controllers.js
// Handles consumer-specific operations
// ==========================================

import { asyncHandler } from "../../utils/asyncHandler.js";
import { Order } from "../../models/Order.model.js";
import { User } from "../../models/User.model.js";
import { Product } from "../../models/Product.model.js";

// ==========================================
// @desc    Get consumer dashboard stats
// @route   GET /api/v1/consumer/dashboard
// @access  Private (consumer only)
// ==========================================
export const getConsumerStats = asyncHandler(async (req, res) => {
  const consumerId = req.user._id;

  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalSpent
  ] = await Promise.all([
    Order.countDocuments({ buyerId: consumerId }),
    Order.countDocuments({
      buyerId: consumerId,
      status: { $in: ["pending", "paid", "preparing", "out_for_delivery"] }
    }),
    Order.countDocuments({
      buyerId: consumerId,
      status: "delivered"
    }),
    Order.aggregate([
      { $match: { buyerId: consumerId, status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ])
  ]);

  const recentOrders = await Order.find({ buyerId: consumerId })
    .sort("-createdAt")
    .limit(5)
    .select("_id items.title totalAmount status createdAt");

  res.status(200).json({
    success: true,
    data: {
      user: req.user,
      stats: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders
        },
        spending: {
          total: totalSpent[0]?.total || 0
        }
      },
      recentOrders
    }
  });
});


// ==========================================
// @desc    Update consumer profile
// @route   PUT /api/v1/consumer/profile
// @access  Private (consumer only)
// ==========================================
export const updateConsumerProfile = asyncHandler(async (req, res) => {
  const { name, phone, address } = req.body;

  if (req.user.role !== "consumer") {
    return res.status(403).json({
      success: false,
      message: "Only consumers can update these fields"
    });
  }

  const updateFields = {};

  if (name) updateFields.name = name;
  if (phone) updateFields.phone = phone;
  if (address) {
    updateFields.address = {
      ...req.user.address,
      ...address
    };
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    message: "Consumer profile updated successfully",
    data: updatedUser
  });
});


// ==========================================
// @desc    Get consumer order history
// @route   GET /api/v1/consumer/orders
// @access  Private (consumer only)
// ==========================================
export const getConsumerOrders = asyncHandler(async (req, res) => {
  const consumerId = req.user._id;

  const orders = await Order.find({ buyerId: consumerId })
    .sort("-createdAt")
    .select("items.title totalAmount status createdAt");

  res.status(200).json({
    success: true,
    data: orders
  });
});


// ==========================================
// 📌 Wishlist Feature
// ==========================================

// @desc    Add product to wishlist
// @route   POST /api/v1/consumer/wishlist/:productId
// @access  Private (consumer only)
export const addToWishlist = asyncHandler(async (req, res) => {
  const consumerId = req.user._id;
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "Product not found"
    });
  }

  const user = await User.findById(consumerId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  if (user.wishlist?.includes(productId)) {
    return res.status(400).json({
      success: false,
      message: "Product already in wishlist"
    });
  }

  user.wishlist.push(productId);
  await user.save();

  res.status(200).json({
    success: true,
    message: "Product added to wishlist"
  });
});


// @desc    Remove product from wishlist
// @route   DELETE /api/v1/consumer/wishlist/:productId
// @access  Private (consumer only)
export const removeFromWishlist = asyncHandler(async (req, res) => {
  const consumerId = req.user._id;
  const { productId } = req.params;

  const user = await User.findById(consumerId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  user.wishlist = user.wishlist.filter(
    (id) => id.toString() !== productId.toString()
  );
  await user.save();

  res.status(200).json({
    success: true,
    message: "Product removed from wishlist"
  });
});


// @desc    Get wishlist products
// @route   GET /api/v1/consumer/wishlist
// @access  Private (consumer only)
export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate("wishlist", "title pricePerUnit images farmerId")
    .select("wishlist");

  res.status(200).json({
    success: true,
    count: user.wishlist.length,
    data: user.wishlist
  });
});
