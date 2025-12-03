// controllers/User/consumer.controllers.js

import { asyncHandler } from "../../utils/asyncHandler.js";
import { Order } from "../../models/Order.model.js";
import { User } from "../../models/User.model.js";
import { Product } from "../../models/Product.model.js";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";

// Small helper to enforce consumer role
const ensureConsumer = (req, res) => {
  if (req.user.role !== "consumer") {
    res.status(403).json({
      success: false,
      message: "Only consumers can access this resource"
    });
    return false;
  }
  return true;
};

// ==========================================
// @desc    Get consumer dashboard stats
// @route   GET /api/v1/consumer/dashboard
// @access  Private (consumer only)
// ==========================================
export const getConsumerStats = asyncHandler(async (req, res) => {
  if (!ensureConsumer(req, res)) return;

  const consumerId = req.user._id;

  const [totalOrders, pendingOrders, completedOrders, totalSpent] =
    await Promise.all([
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
// @desc    Get consumer profile (safe fields)
// @route   GET /api/v1/consumer/profile
// @access  Private (consumer only)
// ==========================================
export const getConsumerProfile = asyncHandler(async (req, res) => {
  if (!ensureConsumer(req, res)) return;

  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    data: user.getSafeProfile()
  });
});

// ==========================================
// @desc    Update consumer profile
// @route   PUT /api/v1/consumer/profile
// @access  Private (consumer only)
// ==========================================
export const updateConsumerProfile = asyncHandler(async (req, res) => {
  if (!ensureConsumer(req, res)) return;

  const { name, email, phone, address } = req.body || {};



  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // --------------------------
  // EMAIL CHANGE
  // --------------------------
  if (email && email.toLowerCase() !== user.email) {
    const exists = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: user._id },
    });

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already in use",
      });
    }

    user.email = email.toLowerCase();
  }

  // --------------------------
  // BASIC FIELDS
  // --------------------------
  if (name) user.name = name;
  if (phone) user.phone = phone;

  // --------------------------
  // PROFILE IMAGE → CLOUDINARY
  // --------------------------
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "farmconnect/profilePhotos",
      });

      console.log("Cloudinary upload result:", result?.secure_url);

      // Remove temp local file
      try {
        fs.unlinkSync(req.file.path);
      } catch (e) {
        console.warn("unlink failed:", e?.message || e);
      }

      //IMPORTANT: write to BOTH avatar and profileImage for compatibility
      user.avatar = result.secure_url;
      user.profileImage = result.secure_url;
    } catch (err) {
      console.error("Cloudinary upload failed:", err);
      return res.status(500).json({
        success: false,
        message: "Failed to upload image",
      });
    }
  }

  // --------------------------
  // ADDRESS (PARSE IF STRING)
  // --------------------------
  let addressObj = address;

  if (typeof addressObj === "string") {
    try {
      addressObj = JSON.parse(addressObj);
    } catch (e) {
      addressObj = null;
    }
  }

  if (addressObj) {
    user.address = {
      street: addressObj.street ?? user.address?.street ?? "",
      city: addressObj.city ?? user.address?.city ?? "",
      state: addressObj.state ?? user.address?.state ?? "",
      pincode: addressObj.pincode ?? user.address?.pincode ?? "",
      coords: addressObj.coords
        ? {
            type: "Point",
            coordinates: [
              Number(addressObj.coords.lng),
              Number(addressObj.coords.lat),
            ],
          }
        : user.address?.coords,
    };
  }

  await user.save();

  const safe = user.getSafeProfile();
  console.log("updateConsumerProfile -> safe profile:", safe);

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    data: safe,
  });
});


// ==========================================
// @desc    Get consumer order history
// @route   GET /api/v1/consumer/orders
// @access  Private (consumer only)
// ==========================================
export const getConsumerOrders = asyncHandler(async (req, res) => {
  if (!ensureConsumer(req, res)) return;

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
  if (!ensureConsumer(req, res)) return;

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
  if (!ensureConsumer(req, res)) return;

  const consumerId = req.user._id;
  const { productId } = req.params;

  const user = await User.findById(consumerId);
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  user.wishlist = (user.wishlist || []).filter(
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
  if (!ensureConsumer(req, res)) return;

  const user = await User.findById(req.user._id)
    .populate("wishlist", "title pricePerUnit images farmerId")
    .select("wishlist");

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found"
    });
  }

  res.status(200).json({
    success: true,
    count: user.wishlist.length,
    data: user.wishlist
  });
});
