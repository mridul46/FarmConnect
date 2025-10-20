// ==========================================
// controllers/user/admin.controller.js
// Admin-only operations
// ==========================================
import { User } from "../../models/User.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
// Get all users with filters
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, role, verified } = req.query;
  
  const query = {};
  if (role) query.role = role;
  if (verified !== undefined) query.verified = verified === 'true';
  
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    User.find(query)
      .select('-passwordHash -refreshToken')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query)
  ]);
  
  res.status(200).json({
    success: true,
    count: users.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: users
  });
});

// Search users
export const searchUsers = asyncHandler(async (req, res) => {
  const {
    q,
    role,
    verified,
    page = 1,
    limit = 20,
    sort = '-createdAt'
  } = req.query;
  
  const query = {};
  
  if (q) {
    query.$or = [
      { name: { $regex: q, $options: 'i' } },
      { email: { $regex: q, $options: 'i' } },
      { shopName: { $regex: q, $options: 'i' } }
    ];
  }
  
  if (role) query.role = role;
  if (verified !== undefined) query.verified = verified === 'true';
  
  const skip = (page - 1) * limit;
  
  const [users, total] = await Promise.all([
    User.find(query)
      .select('-passwordHash -refreshToken -bankDetails')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    User.countDocuments(query)
  ]);
  
  res.status(200).json({
    success: true,
    count: users.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: users
  });
});

// Update user (admin can change role, verification)
export const updateUserByAdmin = asyncHandler(async (req, res) => {
  const { verified, role } = req.body;
  
  const updateFields = {};
  if (verified !== undefined) updateFields.verified = verified;
  if (role) updateFields.role = role;
  
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select('-passwordHash -refreshToken');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'User updated successfully',
    data: user
  });
});

// Delete user (admin)
export const deleteUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  if (user.role === 'farmer') {
    await Product.updateMany(
      { farmerId: user._id },
      { visible: false }
    );
  }
  
  await user.deleteOne();
  
  res.status(200).json({
    success: true,
    message: 'User deleted successfully'
  });
});

// Get platform statistics (admin dashboard)
export const getPlatformStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalFarmers,
    totalConsumers,
    verifiedFarmers,
    totalProducts,
    totalOrders,
    totalRevenue
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'farmer' }),
    User.countDocuments({ role: 'consumer' }),
    User.countDocuments({ role: 'farmer', verified: true }),
    Product.countDocuments({ visible: true }),
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
  ]);
  
  res.status(200).json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        farmers: totalFarmers,
        consumers: totalConsumers,
        verifiedFarmers
      },
      products: {
        total: totalProducts
      },
      orders: {
        total: totalOrders
      },
      revenue: {
        total: totalRevenue[0]?.total || 0
      }
    }
  });
});