import mongoose from "mongoose";
const orderSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Buyer ID is required'],
    index: true
  }, 
  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    farmerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    qty: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1']
    },
    priceAtPurchase: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    unit: {
      type: String,
      required: true
    }
  }],
  totalAmount: {
    type: Number,
    required: [true, 'Total amount is required'],
    min: [0, 'Total amount cannot be negative']
  },
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String,
    coords: {
      lat: Number,
      lng: Number
    },
    phone: String
  },
  status: {
    type: String,
    enum: {
      values: ['pending', 'paid', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'],
      message: 'Invalid status'
    },
    default: 'pending',
    index: true
  },
  payment: {
    provider: {
      type: String,
      enum: {
        values: ['stripe', 'razorpay', 'cod'],
        message: 'Invalid payment provider'
      },
      required: true
    },
    providerPaymentId: String,
    providerOrderId: String,
    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },
    paidAt: Date
  },
  deliveryCharges: {
    type: Number,
    default: 0,
    min: [0, 'Delivery charges cannot be negative']
  },
  notes: {
    type: String,
    maxlength: [500, 'Notes cannot exceed 500 characters']
  },
  cancellationReason: String,
  estimatedDelivery: Date
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
orderSchema.index({ buyerId: 1, createdAt: -1 });
orderSchema.index({ 'items.farmerId': 1, createdAt: -1 });
orderSchema.index({ status: 1, createdAt: -1 });
orderSchema.index({ 'payment.status': 1 });
orderSchema.index({ createdAt: -1 });

// Virtual for buyer details
orderSchema.virtual('buyer', {
  ref: 'User',
  localField: 'buyerId',
  foreignField: '_id',
  justOne: true
});

// Method to calculate total
orderSchema.methods.calculateTotal = function() {
  const itemsTotal = this.items.reduce((sum, item) => {
    return sum + (item.priceAtPurchase * item.qty);
  }, 0);
  return itemsTotal + this.deliveryCharges;
};

// Pre-save validation
orderSchema.pre('save', function(next) {
  if (this.items.length === 0) {
    return next(new Error('Order must have at least one item'));
  }
  
  const calculatedTotal = this.calculateTotal();
  if (Math.abs(this.totalAmount - calculatedTotal) > 0.01) {
    this.totalAmount = calculatedTotal;
  }
  
  next();
});

// Static method to get farmer orders
orderSchema.statics.findByFarmer = function(farmerId, status = null) {
  const query = { 'items.farmerId': farmerId };
  if (status) query.status = status;
  
  return this.find(query)
    .populate('buyerId', 'name phone address')
    .populate('items.productId', 'title images')
    .sort('-createdAt');
};
export const Order = mongoose.model('Order', orderSchema);