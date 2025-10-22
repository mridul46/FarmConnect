import express from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import {
  getConsumerStats,
  updateConsumerProfile,
  getConsumerOrders,
  addToWishlist,
  removeFromWishlist,
  getWishlist
} from "../controllers/User/consumer.controllers.js";

const router = express.Router();

router.use(verifyJWT);

router.get("/dashboard", getConsumerStats);
router.put("/profile", updateConsumerProfile);
router.get("/orders", getConsumerOrders);

// Wishlist routes
router.get("/wishlist", getWishlist);
router.post("/wishlist/:productId", addToWishlist);
router.delete("/wishlist/:productId", removeFromWishlist);

export default router;
