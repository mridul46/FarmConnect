// ==========================================
// controllers/user/common.controllers.js
// Common user operations (all roles)
// ==========================================

import { User } from "../../models/User.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// Get current user profile
export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// Update profile (common fields)
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, avatar } = req.body;
  
  const updateFields = {};
  if (name) updateFields.name = name;
  if (phone) updateFields.phone = phone;
  if (address) updateFields.address = address;
  if (avatar) updateFields.avatar = avatar;
  
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  );
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.status(200).json({
    success: true,
    message: 'Profile updated successfully',
    data: user
  });
});

// Change password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide current and new password'
    });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'New password must be at least 6 characters'
    });
  }
  
  // FIXED: Explicitly select passwordHash
  const user = await User.findById(req.user._id).select('+passwordHash');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const isMatch = await user.comparePassword(currentPassword);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Current password is incorrect'
    });
  }
  
  user.passwordHash = newPassword;
  await user.save();
  
  res.status(200).json({
    success: true,
    message: 'Password changed successfully'
  });
});

// Get public user profile
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select('-bankDetails -refreshToken');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  res.status(200).json({
    success: true,
    data: user
  });
});

// Delete account
export const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;
  
  if (!password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide your password to confirm deletion'
    });
  }
  
  // FIXED: Explicitly select passwordHash
  const user = await User.findById(req.user._id).select('+passwordHash');
  
  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }
  
  const isMatch = await user.comparePassword(password);
  
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Incorrect password'
    });
  }
  
  await user.deleteOne();
  
  res.status(200).json({
    success: true,
    message: 'Account deleted successfully'
  });
});