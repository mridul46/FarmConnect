// routes/product.routes.js
import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getNearbyProducts,
  getMyProducts,
} from "../controllers/product.controllers.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { isFarmer, isAdmin } from "../middleware/role.middleware.js";
import { upload } from "../middleware/multer.js";

const router = Router();

// -----------------------------------------
// Public / literal routes (must come FIRST)
// -----------------------------------------
router.get("/", getAllProducts);
router.get("/nearby", getNearbyProducts);

// Farmer-only endpoint (server-side filtered) — literal path BEFORE :id
router.get("/mine", verifyJWT, isFarmer, getMyProducts);

// -----------------------------------------
// Param route (/:id) after all literals
// -----------------------------------------
router.get("/:id", getProductById);

// -----------------------------------------
// Farmer Routes (must be authenticated)
// -----------------------------------------

// Create Product
router.post(
  "/",
  verifyJWT,
  isFarmer,
  upload.single("file"), // matches frontend FormData fd.append("file", ...)
  createProduct
);

// Full Update (PUT)
router.put(
  "/:id",
  verifyJWT,
  isFarmer,
  upload.single("file"),
  updateProduct
);

// Partial Update (PATCH) — Stock update, price update, visibility toggle, etc.
router.patch(
  "/:id",
  verifyJWT,
  isFarmer,
  upload.single("file"), // optional image update
  updateProduct
);

// -----------------------------------------
// Delete Product
// -----------------------------------------
// allow farmer to delete own products OR admin to delete any
router.delete(
  "/:id",
  verifyJWT,
  (req, res, next) => {
    if (req.user.role === "admin") return next();
    return isFarmer(req, res, next);
  },
  deleteProduct
);

export default router;
