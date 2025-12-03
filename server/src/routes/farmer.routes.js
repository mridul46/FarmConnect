import {Router} from "express";
import {
  getFarmerStats,
  updateFarmerProfile,
  getNearbyFarmers,
  getFarmerProfile,
  rateFarmer
} from "../controllers/User/farmer.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isFarmer, isConsumer } from "../middleware/role.middleware.js";
import { upload } from "../middleware/multer.js";

const router = Router();

/**
 * @route   GET /api/v1/farmer/stats
 * @desc    Get dashboard stats for a farmer
 * @access  Private (Farmer only)
 */
router.get("/stats", verifyJWT, isFarmer, getFarmerStats);


/**
 * @route   GET /api/v1/farmer/nearby
 * @desc    Get nearby verified farmers using GeoJSON coordinates
 * @access  Public
 */
router.get("/nearby", getNearbyFarmers);

/**
 * @route   GET /api/v1/farmer/:id
 * @desc    Get farmer public profile with basic info and top products
 * @access  Public
 */
router.get("/:id",verifyJWT, isFarmer, getFarmerProfile);
router.put(
  "/profile",
  verifyJWT,
  isFarmer,
  upload.single("profileImage"),   
  updateFarmerProfile
);

/**
 * @route   POST /api/v1/farmer/:id/rate
 * @desc    Submit rating for a farmer
 * @access  Private (Consumer only)
 */
router.post("/:id/rate", verifyJWT, isConsumer, rateFarmer);

export default router;
