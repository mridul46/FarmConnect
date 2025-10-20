const mongoose = require('mongoose');
const productSchema = new mongoose.Schema({
  farmerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Farmer ID is required'],
    index: true
  },
  title: {
    type: String,
    required: [true, 'Product title is required'],
    trim: true,
    minlength: [3, 'Title must be at least 3 characters'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Product description is required'],
    trim: true,
    minlength: [10, 'Description must be at least 10 characters'],
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: {
      values: ['Vegetables', 'Fruits', 'Grains', 'Dairy', 'Leafy Greens', 'Herbs', 'Other'],
      message: 'Invalid category'
    },
    index: true
  },
  pricePerUnit: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: {
      values: ['kg', 'bunch', 'piece', 'dozen', 'liter'],
      message: 'Invalid unit'
    }
  },
  stockQuantity: {
    type: Number,
    required: [true, 'Stock quantity is required'],
    min: [0, 'Stock cannot be negative'],
    default: 0
  },
  images: {
    type: [String],
    required: [true, 'At least one image is required'],
    validate: {
      validator: function(v) {
        return v && v.length > 0 && v.length <= 5;
      },
      message: 'Product must have 1-5 images'
    }
  },
  location: {
    lat: {
      type: Number,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  visible: {
    type: Boolean,
    default: true,
    index: true
  },
  tags: {
    type: [String],
    default: []
  },
  organic: {
    type: Boolean,
    default: false,
    index: true
  },
  minOrder: {
    type: Number,
    default: 1,
    min: [1, 'Minimum order must be at least 1']
  },
  deliveryRadius: {
    type: Number,
    default: 10,
    min: [0, 'Delivery radius cannot be negative'],
    max: [100, 'Delivery radius cannot exceed 100 km']
  },
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0,
      min: 0
    }
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
productSchema.index({ farmerId: 1, createdAt: -1 });
productSchema.index({ category: 1, visible: 1 });
productSchema.index({ location: '2dsphere' });
productSchema.index({ title: 'text', description: 'text', tags: 'text' });
productSchema.index({ pricePerUnit: 1 });
productSchema.index({ stockQuantity: 1 });

// Virtual for farmer details
productSchema.virtual('farmer', {
  ref: 'User',
  localField: 'farmerId',
  foreignField: '_id',
  justOne: true
});

// Method to check if product is in stock
productSchema.methods.isInStock = function(quantity = 1) {
  return this.stockQuantity >= quantity;
};

// Method to update stock
productSchema.methods.updateStock = async function(quantity, operation = 'subtract') {
  if (operation === 'subtract') {
    if (this.stockQuantity < quantity) {
      throw new Error('Insufficient stock');
    }
    this.stockQuantity -= quantity;
  } else if (operation === 'add') {
    this.stockQuantity += quantity;
  }
  return await this.save();
};

// Static method to find nearby products
productSchema.statics.findNearby = function(lat, lng, radius = 10, filters = {}) {
  return this.find({
    ...filters,
    visible: true,
    stockQuantity: { $gt: 0 },
    location: {
      $near: {
        $geometry: {
          type: 'Point',
          coordinates: [lng, lat]
        },
        $maxDistance: radius * 1000 // Convert km to meters
      }
    }
  }).populate('farmerId', 'name shopName rating address phone');
};

export const Product = mongoose.model('Product', productSchema);