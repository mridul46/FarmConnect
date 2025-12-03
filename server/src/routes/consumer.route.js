// routes/consumer.routes.js
import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getConsumerStats,
  getConsumerProfile,
  updateConsumerProfile,
  getConsumerOrders,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../controllers/User/consumer.controllers.js";
import { upload } from "../middleware/multer.js";
const router = express.Router();

// All routes below require auth
router.use(verifyJWT);

// Dashboard stats
router.get("/dashboard", getConsumerStats);

// Profile
router.get("/profile", getConsumerProfile);
router.put(
  "/profile",
  upload.single("profileImage"), // field name: "profileImage"
  updateConsumerProfile
);

// Orders
router.get("/orders", getConsumerOrders);

// Wishlist
router.get("/wishlist", getWishlist);
router.post("/wishlist/:productId", addToWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

export default router;
