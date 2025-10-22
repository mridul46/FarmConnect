import { Router } from "express";
import {
  createProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getNearbyProducts
} from "../controllers/product.controllers.js";  
import { verifyJWT } from "../middleware/auth.middleware.js";
import { isFarmer,isAdmin } from "../middleware/role.middleware.js";
import { upload } from "../middleware/multer.js";  
const router = Router();


router.get("/", getAllProducts);
router.get("/nearby", getNearbyProducts);
router.get("/:id", getProductById);


router.post("/", upload.single("image"), verifyJWT, isFarmer, createProduct);
router.put("/:id", upload.single("image"), verifyJWT, isFarmer, updateProduct);
router.delete("/:id", verifyJWT, isAdmin, deleteProduct);

export default router;