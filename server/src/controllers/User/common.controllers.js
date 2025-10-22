// ==========================================
// controllers/user/common.controllers.js
// Common user operations (for all roles)
// ==========================================

import { User } from "../../models/User.model.js";
import { asyncHandler } from "../../utils/asyncHandler.js";

// ==========================================
// @desc    Get current user profile
// @route   GET /api/v1/user/me
// @access  Private
// ==========================================
export const getMyProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-passwordHash -refreshToken");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    data: user,
  });
});

// ==========================================
// @desc    Update profile (common fields)
// @route   PUT /api/v1/user/update
// @access  Private
// ==========================================
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, phone, address, avatar } = req.body;

  const updateFields = {};
  if (name) updateFields.name = name;
  if (phone) updateFields.phone = phone;
  if (address) updateFields.address = address;
  if (avatar) updateFields.avatar = avatar;

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    { $set: updateFields },
    { new: true, runValidators: true }
  ).select("-passwordHash -refreshToken");

  if (!updatedUser) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: updatedUser,
  });
});

// ==========================================
// @desc    Change password
// @route   PUT /api/v1/user/change-password
// @access  Private
// ==========================================
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Please provide both current and new passwords",
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: "New password must be at least 6 characters long",
    });
  }

  const user = await User.findById(req.user._id).select("+passwordHash");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isMatch = await user.comparePassword(currentPassword);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: "Current password is incorrect",
    });
  }

  user.passwordHash = newPassword;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password changed successfully",
  });
});

// ==========================================
// @desc    Get public user profile
// @route   GET /api/v1/user/:id
// @access  Public
// ==========================================
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id)
    .select("-bankDetails -passwordHash -refreshToken");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.status(200).json({
    success: true,
    message: "User profile fetched successfully",
    data: user,
  });
});

// ==========================================
// @desc    Delete account
// @route   DELETE /api/v1/user/delete
// @access  Private
// ==========================================
export const deleteAccount = asyncHandler(async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({
      success: false,
      message: "Please provide your password to confirm deletion",
    });
  }

  const user = await User.findById(req.user._id).select("+passwordHash");

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, message: "Incorrect password" });
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "Account deleted successfully",
  });
});
