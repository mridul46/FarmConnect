// ==========================================
// controllers/user/admin.controller.js
// Admin-only operations
// ==========================================

import { User } from "../../models/User.model.js";
import { Product } from "../../models/Product.model.js";
import { Order } from "../../models/Order.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// ==========================================
// @desc    Get all users with filters and pagination
// @route   GET /api/v1/admin/users
// @access  Private (Admin)
// ==========================================
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, verified } = req.query;

  const query = {};
  if (role) query.role = role;
  if (verified !== undefined) query.verified = verified === "true";

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-passwordHash -refreshToken -bankDetails")
      .sort("-createdAt")
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
    data: users,
  });
});

// ==========================================
// @desc    Search users by keyword, role, or verification
// @route   GET /api/v1/admin/users/search
// @access  Private (Admin)
// ==========================================
export const searchUsers = asyncHandler(async (req, res) => {
  const { q, role, verified, page = 1, limit = 20, sort = "-createdAt" } = req.query;

  const query = {};

  if (q) {
    query.$or = [
      { name: { $regex: q, $options: "i" } },
      { email: { $regex: q, $options: "i" } },
      { shopName: { $regex: q, $options: "i" } },
    ];
  }

  if (role) query.role = role;
  if (verified !== undefined) query.verified = verified === "true";

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query)
      .select("-passwordHash -refreshToken -bankDetails")
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query),
  ]);

  res.status(200).json({
    success: true,
    count: users.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit),
    },
    data: users,
  });
});

// ==========================================
// @desc    Update a user's role or verification status
// @route   PUT /api/v1/admin/users/:id
// @access  Private (Admin)
// ==========================================
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { verified, role } = req.body;

  const updateFields = {};
  if (verified !== undefined) updateFields.verified = verified;
  if (role) updateFields.role = role;

  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-passwordHash -refreshToken -bankDetails");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    data: user,
  });
});

// ==========================================
// @desc    Delete a user (admin)
// @route   DELETE /api/v1/admin/users/:id
// @access  Private (Admin)
// ==========================================
export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // Hide farmer products before deletion
  if (user.role === "farmer") {
    await Product.updateMany({ farmerId: user._id }, { visible: false });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

// ==========================================
// @desc    Get platform-wide statistics for admin dashboard
// @route   GET /api/v1/admin/stats
// @access  Private (Admin)
// ==========================================
export const getPlatformStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalFarmers,
    totalConsumers,
    verifiedFarmers,
    totalProducts,
    totalOrders,
    totalRevenue,
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: "farmer" }),
    User.countDocuments({ role: "consumer" }),
    User.countDocuments({ role: "farmer", verified: true }),
    Product.countDocuments({ visible: true }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]),
  ]);

  res.status(200).json({
    success: true,
    message: "Platform stats fetched successfully",
    data: {
      users: {
        total: totalUsers,
        farmers: totalFarmers,
        consumers: totalConsumers,
        verifiedFarmers,
      },
      products: {
        total: totalProducts,
      },
      orders: {
        total: totalOrders,
      },
      revenue: {
        total: totalRevenue[0]?.total || 0,
      },
    },
  });
});
