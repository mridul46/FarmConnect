import { Product } from "../models/Product.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
import fs from "fs";

/**
 * Helper: parse nutrients input
 * Accepted formats:
 *  - Object: { calories: 100, protein: 3, ... }
 *  - JSON string: '{"calories":100,"protein":3}'
 *  - KV string: "calories:100,protein:3"
 */
function parseNutrients(input) {
  if (!input) return undefined;

  // If already an object, pick numeric fields and maps
  if (typeof input === "object" && !Array.isArray(input)) {
    const res = {};
    if (input.calories != null && !Number.isNaN(Number(input.calories))) res.calories = Number(input.calories);
    if (input.protein != null && !Number.isNaN(Number(input.protein))) res.protein = Number(input.protein);
    if (input.carbs != null && !Number.isNaN(Number(input.carbs))) res.carbs = Number(input.carbs);
    if (input.fat != null && !Number.isNaN(Number(input.fat))) res.fat = Number(input.fat);

    // vitamins/minerals map support
    if (input.vitamins && typeof input.vitamins === "object") {
      const v = {};
      for (const [k, val] of Object.entries(input.vitamins)) {
        const n = Number(val);
        if (!Number.isNaN(n)) v[k] = n;
      }
      if (Object.keys(v).length) res.vitamins = v;
    }
    if (input.minerals && typeof input.minerals === "object") {
      const m = {};
      for (const [k, val] of Object.entries(input.minerals)) {
        const n = Number(val);
        if (!Number.isNaN(n)) m[k] = n;
      }
      if (Object.keys(m).length) res.minerals = m;
    }

    return Object.keys(res).length ? res : undefined;
  }

  // If string: try JSON.parse, otherwise parse kv pairs
  if (typeof input === "string") {
    const trimmed = input.trim();
    try {
      const parsed = JSON.parse(trimmed);
      return parseNutrients(parsed);
    } catch (e) {
      const pairs = trimmed.split(",").map(s => s.trim()).filter(Boolean);
      const obj = {};
      pairs.forEach(p => {
        const [k, v] = p.split(":").map(s => s && s.trim());
        if (!k) return;
        const n = Number(v);
        if (!Number.isNaN(n)) obj[k] = n;
      });
      return Object.keys(obj).length ? obj : undefined;
    }
  }

  return undefined;
}

export const createProduct = asyncHandler(async (req, res) => {
  // Basic validation
  const { title, pricePerUnit, stockQuantity, lat, lng } = req.body;
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No image uploaded!" });
  }
  if (!title || !pricePerUnit || stockQuantity == null || lat == null || lng == null) {
    // allow 0 as valid stockQuantity, so check != null
    return res.status(400).json({ success: false, message: "Missing required fields (title, pricePerUnit, stockQuantity, lat, lng)" });
  }

  // upload image
  const result = await cloudinary.uploader.upload(req.file.path, {
    folder: "farmconnect/uploads",
  });

  // remove local file
  try {
    fs.unlinkSync(req.file.path);
  } catch (err) {
    // ignore unlink errors but log
    console.warn("Failed to unlink uploaded file:", err?.message || err);
  }

  // parse numeric fields safely
  const parsedLat = parseFloat(lat);
  const parsedLng = parseFloat(lng);
  const parsedPrice = Number(pricePerUnit);
  const parsedStock = Number(stockQuantity);

  // normalize unit: support 'unit' or 'unit ' from older forms, strip whitespace
  const unitRaw = (req.body.unit ?? req.body["unit "] ?? "kg");
  const unit = typeof unitRaw === "string" ? unitRaw.replace(/\s/g, "") : "kg";

  // normalize booleans and other optional fields
  const visible = String(req.body.visible) === "true";
  const organic = String(req.body.organic) === "true";

  const tags = req.body.tags
    ? String(req.body.tags)
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];

  const minOrder = req.body.minOrder != null ? Number(req.body.minOrder) : undefined;
  // fix typo: delveryRadius => deliveryRadius (accept both for backward compatibility)
  const deliveryRadiusRaw = req.body.deliveryRadius ?? req.body.delveryRadius;
  const deliveryRadius = deliveryRadiusRaw != null ? Number(deliveryRadiusRaw) : undefined;

  // parse farmingMethod (normalize to lowercase). Allowed values are enforced at model level.
  const farmingMethod = req.body.farmingMethod ? String(req.body.farmingMethod).toLowerCase() : undefined;

  // parse nutrients (accept object, JSON string, or kv string)
  const nutrients = parseNutrients(req.body.nutrients ?? req.body.nutrient);

  const product = await Product.create({
    farmerId: req.user._id,
    title: String(req.body.title).trim(),
    description: req.body.description?.trim() ?? "",
    category: req.body.category ?? null,
    pricePerUnit: Number.isFinite(parsedPrice) ? parsedPrice : 0,
    // store canonical `stock` field (also accept `stockQuantity` upstream)
    stock: Number.isFinite(parsedStock) ? parsedStock : 0,
    // keep older field too for compatibility (optional)
    stockQuantity: Number.isFinite(parsedStock) ? parsedStock : undefined,
    unit,
    images: [result.secure_url],
    location: { type: "Point", coordinates: [parsedLng || 0, parsedLat || 0] },
    visible,
    tags,
    organic,
    minOrder: minOrder != null ? minOrder : undefined,
    deliveryRadius: deliveryRadius != null ? deliveryRadius : undefined,
    // new fields
    farmingMethod,
    nutrients,
  });

  res.status(201).json({ success: true, data: product });
});

export const updateProduct = asyncHandler(async (req, res) => {
  // find product for this farmer (or existing owner)
  const product = await Product.findOne({ _id: req.params.id, farmerId: req.user._id });
  if (!product) return res.status(404).json({ success: false, message: "Not found" });

  // image update
  if (req.file) {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "farmconnect/uploads",
    });
    try {
      fs.unlinkSync(req.file.path);
    } catch (e) {
      console.warn("unlink failed:", e?.message || e);
    }
    product.images = [result.secure_url];
  }

  // Normalize certain incoming fields before applying
  const body = { ...req.body };

  if (body.pricePerUnit !== undefined) {
    body.pricePerUnit = Number(body.pricePerUnit);
    if (Number.isNaN(body.pricePerUnit)) delete body.pricePerUnit;
  }

  // accept either `stock` or `stockQuantity` from client — store canonical `stock`
  if (body.stockQuantity !== undefined) {
    const parsed = Number(body.stockQuantity);
    if (!Number.isNaN(parsed)) {
      body.stock = parsed;
      body.stockQuantity = parsed; // keep both for compatibility
    } else {
      delete body.stockQuantity;
    }
  } else if (body.stock !== undefined) {
    const parsed = Number(body.stock);
    if (!Number.isNaN(parsed)) {
      body.stock = parsed;
      body.stockQuantity = parsed;
    } else {
      delete body.stock;
    }
  }

  // normalize unit field (strip whitespace)
  if (body.unit !== undefined || body["unit "] !== undefined) {
    const unitRaw = body.unit ?? body["unit "];
    body.unit = typeof unitRaw === "string" ? unitRaw.replace(/\s/g, "") : unitRaw;
    delete body["unit "];
  }

  // parse boolean-ish fields
  if (body.visible !== undefined) body.visible = String(body.visible) === "true";
  if (body.organic !== undefined) body.organic = String(body.organic) === "true";

  // parse tags if provided as comma string
  if (body.tags && typeof body.tags === "string") {
    body.tags = body.tags.split(",").map((t) => t.trim()).filter(Boolean);
  }

  // parse location coordinates if present (lat,lng)
  if (body.lat !== undefined && body.lng !== undefined) {
    const latN = parseFloat(body.lat);
    const lngN = parseFloat(body.lng);
    if (!Number.isNaN(latN) && !Number.isNaN(lngN)) {
      body.location = { type: "Point", coordinates: [Number(lngN), Number(latN)] };
    }
    delete body.lat;
    delete body.lng;
  }

  // parse farmingMethod if provided (normalize)
  if (body.farmingMethod !== undefined) {
    body.farmingMethod = String(body.farmingMethod).toLowerCase();
  }

  // parse nutrients if provided
  if (body.nutrients !== undefined || body.nutrient !== undefined) {
    const nutrientsRaw = body.nutrients ?? body.nutrient;
    const parsed = parseNutrients(nutrientsRaw);
    if (parsed) body.nutrients = parsed;
    else delete body.nutrients;
    delete body.nutrient;
  }

  // apply changes and save
  Object.assign(product, body);
  await product.save();

  res.status(200).json({
    success: true,
    data: product,
  });
});

// ==========================================
// @desc Get all products
// @route GET /api/v1/products
// Supports optional filters: category, organic, minPrice, maxPrice, search,
// farmingMethod, minCalories, maxCalories, minProtein
// ==========================================
export const getAllProducts = asyncHandler(async (req, res) => {
  const { category, organic, minPrice, maxPrice, search, farmingMethod, minCalories, maxCalories, minProtein } = req.query;

  const filters = { visible: true };
  if (category) filters.category = category;
  if (organic !== undefined) filters.organic = organic === "true";
  if (farmingMethod) filters.farmingMethod = String(farmingMethod).toLowerCase();
  if (minPrice || maxPrice)
    filters.pricePerUnit = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    };
  if (search) filters.$text = { $search: search };

  // nutrient-based filters (simple numeric fields)
  if (minCalories || maxCalories) {
    filters["nutrients.calories"] = {
      ...(minCalories ? { $gte: Number(minCalories) } : {}),
      ...(maxCalories ? { $lte: Number(maxCalories) } : {}),
    };
  }
  if (minProtein) {
    filters["nutrients.protein"] = { $gte: Number(minProtein) };
  }

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

// ==========================================
// @desc Get current farmer's products
// @route GET /api/v1/products/mine
// @access Private (farmer)
// ==========================================
export const getMyProducts = asyncHandler(async (req, res) => {
  // req.user is set by verifyJWT middleware
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const filters = { farmerId: req.user._id, visible: true };

  // optional query-based filters (reuse query params supported by getAllProducts)
  const { category, organic, minPrice, maxPrice, search, farmingMethod } = req.query;
  if (category) filters.category = category;
  if (organic !== undefined) filters.organic = organic === "true";
  if (farmingMethod) filters.farmingMethod = String(farmingMethod).toLowerCase();
  if (minPrice || maxPrice) {
    filters.pricePerUnit = {
      ...(minPrice ? { $gte: Number(minPrice) } : {}),
      ...(maxPrice ? { $lte: Number(maxPrice) } : {}),
    };
  }
  if (search) filters.$text = { $search: search };

  const products = await Product.find(filters)
    .populate("farmerId", "name shopName phone")
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: products.length, data: products });
});

// Update product stock (farmer only)
// Route suggestion: PATCH /api/v1/products/:id/stock
export const updateStock = asyncHandler(async (req, res) => {
  // ensure authenticated user
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  const productId = req.params.id;
  const { stock, adjustBy } = req.body;

  if (stock === undefined && adjustBy === undefined) {
    return res.status(400).json({
      success: false,
      message: "Provide either 'stock' (absolute) or 'adjustBy' (delta).",
    });
  }

  // find product belonging to this farmer
  const product = await Product.findOne({ _id: productId, farmerId: req.user._id });
  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found or unauthorized" });
  }

  let current = Number.isFinite(Number(product.stock)) ? Number(product.stock) : 0;
  let newStock = current;

  if (adjustBy !== undefined) {
    const delta = Number(adjustBy);
    if (Number.isNaN(delta)) {
      return res.status(400).json({ success: false, message: "'adjustBy' must be a number" });
    }
    newStock = current + delta;
  } else {
    const absolute = Number(stock);
    if (Number.isNaN(absolute)) {
      return res.status(400).json({ success: false, message: "'stock' must be a number" });
    }
    newStock = absolute;
  }

  if (newStock < 0) {
    return res.status(400).json({ success: false, message: "Stock cannot be negative" });
  }

  // apply and keep compatibility field
  product.stock = newStock;
  product.stockQuantity = newStock; 
  await product.save();

  res.status(200).json({ success: true, data: product });
});
const parseLimitAndCategory = (req) => {
  const limit = Math.min(Number(req.query.limit) || 5, 50); // default 5, max 50
  const category = req.query.category || null;
  return { limit, category };
};

/**
 * GET /api/v1/products/top/sales
 * Top products by sold / sales count
 */
export const getTopBySales = async (req, res, next) => {
  try {
    const { limit, category } = parseLimitAndCategory(req);

    const filter = { ...(category ? { category } : {}) };

    const products = await Product.find(filter)
      .sort({ sold: -1, sales: -1, updatedAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/products/top/rating
 * Top products by rating average. Handles rating as number or object.
 */
export const getTopByRating = async (req, res, next) => {
  try {
    const { limit, category } = parseLimitAndCategory(req);
    const filter = { ...(category ? { category } : {}) };

    // Use aggregation so we can normalize different rating shapes consistently
    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          ratingAverage: {
            $switch: {
              branches: [
                { case: { $isNumber: "$rating" }, then: "$rating" },
                { case: { $and: [{ $isObject: "$rating" }, { $ne: ["$rating.average", undefined] }] }, then: "$rating.average" },
                { case: { $and: [{ $isObject: "$rating" }, { $ne: ["$rating.avg", undefined] }] }, then: "$rating.avg" }
              ],
              default: { $ifNull: ["$displayRating", 0] }
            }
          }
        }
      },
      { $sort: { ratingAverage: -1, ratingCount: -1 } },
      { $limit: limit }
    ];

    const results = await Product.aggregate(pipeline).exec();
    return res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/products/top/recent
 * Newest products by createdAt
 */
export const getTopByRecent = async (req, res, next) => {
  try {
    const { limit, category } = parseLimitAndCategory(req);
    const filter = { ...(category ? { category } : {}) };

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();

    return res.json({ success: true, count: products.length, data: products });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/products/top/views
 * Top products by views (field: views or viewsCount)
 */
export const getTopByViews = async (req, res, next) => {
  try {
    const { limit, category } = parseLimitAndCategory(req);
    const filter = { ...(category ? { category } : {}) };

    // If your schema uses viewsCount or views, try to sort both by using aggregation
    const pipeline = [
      { $match: filter },
      {
        $addFields: {
          viewsCount: { $ifNull: ["$viewsCount", "$views"] }
        }
      },
      { $sort: { viewsCount: -1, updatedAt: -1 } },
      { $limit: limit }
    ];

    const results = await Product.aggregate(pipeline).exec();
    return res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/products/top/trending
 * Trending heuristic: recent sales + rating. This is a simple and fast approach.
 */
export const getTopTrending = async (req, res, next) => {
  try {
    const { limit, category } = parseLimitAndCategory(req);
    const filter = { ...(category ? { category } : {}) };

    // Aggregation builds a score from recent sales (sold in last 30 days) + ratingAverage
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const pipeline = [
      { $match: filter },
      // if you track per-order sales timestamps you can do more — here we use sold & rating
      {
        $addFields: {
          ratingAverage: {
            $switch: {
              branches: [
                { case: { $isNumber: "$rating" }, then: "$rating" },
                { case: { $and: [{ $isObject: "$rating" }, { $ne: ["$rating.average", undefined] }] }, then: "$rating.average" },
                { case: { $and: [{ $isObject: "$rating" }, { $ne: ["$rating.avg", undefined] }] }, then: "$rating.avg" }
              ],
              default: { $ifNull: ["$displayRating", 0] }
            }
          },
          recentFactor: {
            // boost if product created recently; scale between 0..1
            $cond: [{ $gte: ["$createdAt", thirtyDaysAgo] }, 1, 0.2]
          },
          soldCount: { $ifNull: ["$sold", "$sales"] }
        }
      },
      {
        $addFields: {
          trendingScore: {
            $add: [
              { $multiply: ["$ratingAverage", 2] }, // weight rating
              { $multiply: ["$soldCount", 0.5] }, // weight sold
              { $multiply: ["$recentFactor", 2] }  // recent boost
            ]
          }
        }
      },
      { $sort: { trendingScore: -1, soldCount: -1, ratingAverage: -1 } },
      { $limit: limit }
    ];

    const results = await Product.aggregate(pipeline).exec();
    return res.json({ success: true, count: results.length, data: results });
  } catch (err) {
    next(err);
  }
};
