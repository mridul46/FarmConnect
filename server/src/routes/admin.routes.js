// ==========================================
// routes/user/admin.routes.js
// Admin routes for managing users & platform
// ==========================================

import express from "express";
import {
  getAllUsers,
  searchUsers,
  updateUserByAdmin,
  deleteUserByAdmin,
  getPlatformStats,
} from "../controllers/User/admin.controllers.js";
import { verifyJWT} from "../middleware/auth.middleware.js";
import { isAdmin } from "../middleware/role.middleware.js";

const router = express.Router();

// All routes below are admin-protected
router.use(verifyJWT, isAdmin);

// User management
router.get("/users", getAllUsers);
router.get("/users/search", searchUsers);
router.put("/users/:id", updateUserByAdmin);
router.delete("/users/:id", deleteUserByAdmin);

// Platform stats
router.get("/stats", getPlatformStats);

export default router;
