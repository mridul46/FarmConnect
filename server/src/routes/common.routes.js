// ==========================================
// routes/user/common.routes.js
// Common user routes (for all roles)
// ==========================================

import express from "express";
import {
  getMyProfile,
  updateProfile,
  changePassword,
  getUserById,
  deleteAccount,
} from "../controllers/User/common.controllers.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// Private routes
router.get("/me", verifyJWT, getMyProfile);
router.put("/update", verifyJWT, updateProfile);
router.put("/change-password", verifyJWT, changePassword);
router.delete("/delete", verifyJWT, deleteAccount);

// Public route
router.get("/:id", getUserById);

export default router;
