import express from "express";
import {
  register,
  registerConsumer,
  registerFarmer,
  login,
  logout,
  getMe
} from "../controllers/auth.controllers.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

const router = express.Router();

// ------------------------------
// REGISTER
// ------------------------------
router.post("/register", register);                 // auto-detect role
router.post("/register/consumer", registerConsumer);
router.post("/register/farmer", registerFarmer);

// ------------------------------
// LOGIN
// ------------------------------
router.post("/login",login);


// ------------------------------
// SESSION
// ------------------------------
router.post("/logout", verifyJWT, logout);
router.get("/me", verifyJWT, getMe);

export default router;
