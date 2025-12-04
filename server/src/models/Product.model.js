import mongoose from "mongoose";

const nutrientsSchema = new mongoose.Schema(
  {
    calories: { type: Number, min: 0, default: undefined },
    protein: { type: Number, min: 0, default: undefined },
    carbs: { type: Number, min: 0, default: undefined },
    fat: { type: Number, min: 0, default: undefined },
    // allow arbitrary vitamins/minerals as key-value pairs (optional)
    vitamins: {
      type: Map,
      of: Number,
      default: undefined,
    },
    minerals: {
      type: Map,
      of: Number,
      default: undefined,
    },
  },
  { _id: false }
);

// ===== NEW: review subdocument schema =====
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: [1, "Rating must be at least 1"],
      max: [5, "Rating cannot exceed 5"],
    },
    title: {
      type: String,
      trim: true,
      maxlength: [120, "Review title cannot exceed 120 characters"],
    },
    comment: {
      type: String,
      trim: true,
      maxlength: [2000, "Review comment cannot exceed 2000 characters"],
    },
  },
  {
    timestamps: true,
  }
);

const productSchema = new mongoose.Schema(
  {
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Farmer ID is required"],
      index: true,
    },
    title: {
      type: String,
      required: [true, "Product title is required"],
      trim: true,
      minlength: [3, "Title must be at least 3 characters"],
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [10, "Description must be at least 10 characters"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: [
          "Vegetables",
          "Fruits",
          "Grains",
          "Dairy",
          "Leafy Greens",
          "Herbs",
          "Other",
        ],
        message: "Invalid category",
      },
      index: true,
    },
    pricePerUnit: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },
    unit: {
      type: String,
      required: [true, "Unit is required"],
      enum: {
        values: ["kg", "bunch", "piece", "dozen", "liter"],
        message: "Invalid unit",
      },
    },
    // canonical stock field; older `stockQuantity` kept for compatibility
    stock: {
      type: Number,
      required: false,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    stockQuantity: {
      type: Number,
      required: true,
      min: [0, "Stock cannot be negative"],
      default: 0,
    },
    images: {
      type: [String],
      required: [true, "At least one image is required"],
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [lng, lat]
        required: true,
      },
    },
    visible: {
      type: Boolean,
      default: true,
      index: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    organic: {
      type: Boolean,
      default: false,
      index: true,
    },
    minOrder: {
      type: Number,
      default: 1,
      min: [1, "Minimum order must be at least 1"],
    },
    deliveryRadius: {
      type: Number,
      default: 10,
      min: [0, "Delivery radius cannot be negative"],
      max: [100, "Delivery radius cannot exceed 100 km"],
    },

    // aggregate rating info (kept in sync from reviews)
    rating: {
      average: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
      },
      count: {
        type: Number,
        default: 0,
        min: 0,
      },
    },

    // optional helper for aggregations / sorting (used in controllers)
    displayRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    // ===== NEW: list of consumer reviews =====
    reviews: {
      type: [reviewSchema],
      default: [],
    },

    // ===== NEW: nutrients (subdocument) =====
    nutrients: {
      type: nutrientsSchema,
      default: undefined,
    },

    // ===== NEW: farmingMethod =====
    farmingMethod: {
      type: String,
      enum: {
        values: [
          "organic",
          "conventional",
          "hydroponic",
          "permaculture",
          "aquaponic",
          "other",
        ],
        message: "Invalid farming method",
      },
      // index: true,
      default: "conventional",
    },

    // (optional but useful for your "top" endpoints)
    sold: {
      type: Number,
      default: 0,
      min: 0,
    },
    sales: {
      type: Number,
      default: 0,
      min: 0,
    },
    views: {
      type: Number,
      default: 0,
      min: 0,
    },
    viewsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Indexes
productSchema.index({ farmerId: 1, createdAt: -1 });
productSchema.index({ category: 1, visible: 1 });
productSchema.index({ location: "2dsphere" });
productSchema.index({ title: "text", description: "text", tags: "text" });
productSchema.index({ farmingMethod: 1 });
// helpful index if you ever query "reviews by user"
productSchema.index({ "reviews.user": 1 });

// Virtual farmer info
productSchema.virtual("farmer", {
  ref: "User",
  localField: "farmerId",
  foreignField: "_id",
  justOne: true,
});

// Methods
productSchema.methods.isInStock = function (quantity = 1) {
  const stockVal =
    typeof this.stock === "number" ? this.stock : this.stockQuantity;
  return stockVal >= quantity;
};

productSchema.methods.updateStock = async function (
  quantity,
  operation = "subtract"
) {
  const current =
    typeof this.stock === "number" ? this.stock : this.stockQuantity;
  if (operation === "subtract") {
    if (current < quantity) throw new Error("Insufficient stock");
    this.stock = current - quantity;
    this.stockQuantity = this.stock;
  } else if (operation === "add") {
    this.stock = current + quantity;
    this.stockQuantity = this.stock;
  }
  return await this.save();
};

// Static: find nearby
productSchema.statics.findNearby = function (lat, lng, radius = 10, filters = {}) {
  return this.find({
    ...filters,
    visible: true,
    stockQuantity: { $gt: 0 },
    location: {
      $near: {
        $geometry: { type: "Point", coordinates: [lng, lat] },
        $maxDistance: radius * 1000,
      },
    },
  }).populate("farmerId", "name shopName rating address phone");
};

export const Product = mongoose.model("Product", productSchema);
