import { Product } from "../models/Product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

export const createProduct = asyncHandler(async (req, res) => {
 
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded!" });
  }

  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "farmconnect/uploads",
  });
  
  fs.unlinkSync(req.file.path);


  const lat = parseFloat(req.body.lat);
  const lng = parseFloat(req.body.lng);

  const product = await Product.create({
    farmerId: req.user._id,
    title: req.body.title?.trim(),
    description: req.body.description?.trim(),
    category: req.body.category,
    pricePerUnit: Number(req.body.pricePerUnit),
    // 🔥 FIXED: Handle 'unit ' (with space) OR 'unit'
    unit: (req.body.unit || req.body['unit '])?.replace(/\s/g, "") || "kg",
    stockQuantity: Number(req.body.stockQuantity),
    images: [result.secure_url],
    location: { type: "Point", coordinates: [lng, lat] },
    visible: req.body.visible === "true",
    tags: req.body.tags ? req.body.tags.split(",").map(tag => tag.trim()) : [],
    organic: req.body.organic === "true",
    minOrder: Number(req.body.minOrder),
    deliveryRadius: Number(req.body.delveryRadius),
  });

 
  res.status(201).json({ success: true, data: product });
});
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ _id: req.params.id, farmerId: req.user._id });
  if (!product) return res.status(404).json({ success: false, message: "Not found" });

  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "farmconnect/uploads",
    });
    product.images = [result.secure_url];
  }

  Object.assign(product, req.body);
  await product.save();

  res.status(200).json(
    { 
         success: true,
         data: product 
    });
});
// ==========================================
// @desc Get all products
// @route GET /api/v1/products
// ==========================================
export const getAllProducts = asyncHandler(async (req, res) => {
  const { category, organic, minPrice, maxPrice, search } = req.query;

  const filters = { visible: true };
  if (category) filters.category = category;
  if (organic !== undefined) filters.organic = organic === "true";
  if (minPrice || maxPrice)
    filters.pricePerUnit = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    };
  if (search) filters.$text = { $search: search };

  const products = await Product.find(filters)
    .populate("farmerId", "name shopName phone")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: products.length, data: products });
});

// ==========================================
// @desc Get single product
// @route GET /api/v1/products/:id
// ==========================================
export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate("farmerId", "name shopName phone");
  if (!product) return res.status(404).json({ success: false, message: "Product not found" });
  res.status(200).json({ success: true, data: product });
});

// ==========================================
// @desc Delete product
// @route DELETE /api/v1/products/:id
// ==========================================
export const deleteProduct = asyncHandler(async (req, res) => {
  const query = req.user.role === "admin" 
    ? { _id: req.params.id }
    : { _id: req.params.id, farmerId: req.user._id };

  const product = await Product.findOneAndDelete(query);
  if (!product) return res.status(404).json({ success: false, message: "Product not found or unauthorized" });

  res.status(200).json({ success: true, message: "Product deleted successfully" });
});

// ==========================================
// @desc Get nearby products
// @route GET /api/v1/products/nearby?lat=&lng=&radius=
// ==========================================
export const getNearbyProducts = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 10, category } = req.query;
  if (!lat || !lng) return res.status(400).json({ success: false, message: "Latitude and longitude required" });

  const filters = {};
  if (category) filters.category = category;

  const products = await Product.findNearby(Number(lat), Number(lng), Number(radius), filters);
  res.status(200).json({ success: true, count: products.length, data: products });
});
