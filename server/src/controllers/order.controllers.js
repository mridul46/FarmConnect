// ==========================================
// controllers/order.controller.js
// Order management operations
// ==========================================

import { Order } from "../models/Order.model.js";
import { Product } from "../models/Product.model.js";
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";
// Helper: Haversine formula to calculate distance (in km)
const calculateDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Earth radius (km)
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};
// ==========================================
// @desc    Create new order
// @route   POST /api/v1/orders
// @access  Private (Consumer)
// ==========================================


export const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress, paymentProvider = 'razorpay', notes } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please provide order items'
    });
  }

  if (!deliveryAddress) {
    return res.status(400).json({
      success: false,
      message: 'Please provide delivery address'
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    let totalAmount = 0;
    const orderItems = [];
    let farmerCoords = null; // To calculate distance from first farmer (you can enhance this per-item later)

    for (const item of items) {
      const product = await Product.findById(item.productId)
        .populate('farmerId', 'name location coords')
        .session(session);

      if (!product) throw new Error(`Product ${item.productId} not found`);
      if (!product.visible) throw new Error(`${product.title} is not available`);
      if (product.stockQuantity < item.qty)
        throw new Error(`Insufficient stock for ${product.title}`);

      // Store first farmer's coords for distance calculation
      if (!farmerCoords && product.farmerId?.coords) {
        farmerCoords = product.farmerId.coords; // { lat, lng }
      }

      const itemTotal = product.pricePerUnit * item.qty;
      totalAmount += itemTotal;

      orderItems.push({
        productId: product._id,
        farmerId: product.farmerId._id,
        title: product.title,
        qty: item.qty,
        priceAtPurchase: product.pricePerUnit,
        unit: product.unit
      });

      product.stockQuantity -= item.qty;
      await product.save({ session });
    }

    // ==============================
    // 🧭 Delivery Distance Calculation
    // ==============================
    let deliveryCharges = 0;
    let distanceKm = 0;

    if (deliveryAddress?.coords && farmerCoords) {
      distanceKm = calculateDistanceKm(
        farmerCoords.lat,
        farmerCoords.lng,
        deliveryAddress.coords.lat,
        deliveryAddress.coords.lng
      );

      if (distanceKm <= 50) deliveryCharges = 40;
      else if (distanceKm <= 100) deliveryCharges = 100;
      else deliveryCharges = 1000;
    } else {
      // Default if coordinates not provided
      deliveryCharges = 40;
    }

    totalAmount += deliveryCharges;

    // Handle coordinate format for GeoJSON (if used)
    let formattedAddress = deliveryAddress;
    if (deliveryAddress?.coords) {
      formattedAddress = {
        ...deliveryAddress,
        coords: {
          type: 'Point',
          coordinates: [deliveryAddress.coords.lng, deliveryAddress.coords.lat]
        }
      };
    }

    const order = new Order({
      buyerId: req.user._id,
      items: orderItems,
      totalAmount,
      deliveryCharges,
      deliveryAddress: formattedAddress,
      payment: {
        provider: paymentProvider,
        status: 'pending'
      },
      notes,
      estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000)
    });

    await order.save({ session });
    await session.commitTransaction();

    await order.populate([
      { path: 'buyerId', select: 'name email phone' },
      { path: 'items.productId', select: 'title images' },
      { path: 'items.farmerId', select: 'name shopName' }
    ]);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
        distanceKm: distanceKm.toFixed(2),
        deliveryCharges
      }
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});


// ==========================================
// @desc    Get user orders
// @route   GET /api/v1/orders
// @access  Private
// ==========================================
export const getUserOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 10, sort = '-createdAt' } = req.query;

  let query = {};

  // Different queries based on user role
  if (req.user.role === 'farmer') {
    query['items.farmerId'] = req.user._id;
  } else if (req.user.role === 'consumer') {
    query.buyerId = req.user._id;
  } else if (req.user.role === 'admin') {
    // Admin can see all orders
  } else {
    return res.status(403).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  // Filter by status if provided
  if (status) {
    query.status = status;
  }

  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('buyerId', 'name phone email address')
      .populate('items.productId', 'title images category')
      .populate('items.farmerId', 'name shopName phone')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Order.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: orders
  });
});

// ==========================================
// @desc    Get single order by ID
// @route   GET /api/v1/orders/:id
// @access  Private
// ==========================================
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id)
    .populate('buyerId', 'name phone email address')
    .populate('items.productId', 'title images category pricePerUnit unit')
    .populate('items.farmerId', 'name shopName phone address rating');

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check authorization
  const isAuthorized =
    order.buyerId._id.equals(req.user._id) ||
    order.items.some(item => item.farmerId._id.equals(req.user._id)) ||
    req.user.role === 'admin';

  if (!isAuthorized) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to view this order'
    });
  }

  res.status(200).json({
    success: true,
    data: order
  });
});

// ==========================================
// @desc    Update order status
// @route   PATCH /api/v1/orders/:id/status
// @access  Private (Farmer/Admin)
// ==========================================
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  // Validate status
  const validStatuses = ['pending', 'paid', 'preparing', 'out_for_delivery', 'delivered', 'cancelled'];
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Please provide a valid status'
    });
  }

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Check if user is farmer of this order or admin
  const isFarmer = order.items.some(item => item.farmerId.equals(req.user._id));
  const isAdmin = req.user.role === 'admin';

  if (!isFarmer && !isAdmin) {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to update this order'
    });
  }

  // Validate status transitions
  const statusFlow = {
    pending: ['paid', 'cancelled'],
    paid: ['preparing', 'cancelled'],
    preparing: ['out_for_delivery', 'cancelled'],
    out_for_delivery: ['delivered'],
    delivered: [],
    cancelled: []
  };

  if (!statusFlow[order.status]?.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Cannot change status from ${order.status} to ${status}`
    });
  }

  order.status = status;
  await order.save();

  // TODO: Send notification to buyer
  // await sendOrderStatusNotification(order);

  // TODO: Emit socket event for real-time update
  // io.to(`order_${order._id}`).emit('order_status_updated', { orderId: order._id, status });

  res.status(200).json({
    success: true,
    message: 'Order status updated successfully',
    data: order
  });
});

// ==========================================
// @desc    Cancel order
// @route   POST /api/v1/orders/:id/cancel
// @access  Private (Buyer)
// ==========================================
export const cancelOrder = asyncHandler(async (req, res) => {
  const { reason } = req.body;

  const order = await Order.findById(req.params.id);

  if (!order) {
    return res.status(404).json({
      success: false,
      message: 'Order not found'
    });
  }

  // Only buyer can cancel their order
  if (!order.buyerId.equals(req.user._id) && req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'You are not authorized to cancel this order'
    });
  }

  // Check if order can be cancelled
  const cancellableStatuses = ['pending', 'paid', 'preparing'];
  if (!cancellableStatuses.includes(order.status)) {
    return res.status(400).json({
      success: false,
      message: `Cannot cancel order with status: ${order.status}`
    });
  }

  // Start session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Restore product stock
    for (const item of order.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { stockQuantity: item.qty } },
        { session }
      );
    }

    order.status = 'cancelled';
    order.cancellationReason = reason;
    await order.save({ session });

    // Commit transaction
    await session.commitTransaction();

    // TODO: Process refund if payment was completed
    // if (order.payment.status === 'completed') {
    //   await processRefund(order);
    // }

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});

// ==========================================
// @desc    Get farmer orders (organized by status)
// @route   GET /api/v1/orders/farmer/dashboard
// @access  Private (Farmer)
// ==========================================
export const getFarmerOrders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const farmerId = req.user._id;

  const skip = (page - 1) * limit;

  // Get orders grouped by status
  const [pendingOrders, preparingOrders, deliveredOrders, total] = await Promise.all([
    Order.find({
      'items.farmerId': farmerId,
      status: { $in: ['pending', 'paid'] }
    })
      .populate('buyerId', 'name phone address')
      .sort('-createdAt')
      .limit(5),

    Order.find({
      'items.farmerId': farmerId,
      status: { $in: ['preparing', 'out_for_delivery'] }
    })
      .populate('buyerId', 'name phone address')
      .sort('-createdAt')
      .limit(5),

    Order.find({
      'items.farmerId': farmerId,
      status: 'delivered'
    })
      .populate('buyerId', 'name phone address')
      .sort('-createdAt')
      .skip(skip)
      .limit(parseInt(limit)),

    Order.countDocuments({ 'items.farmerId': farmerId })
  ]);

  res.status(200).json({
    success: true,
    data: {
      pending: pendingOrders,
      preparing: preparingOrders,
      delivered: deliveredOrders,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total
      }
    }
  });
});

// ==========================================
// @desc    Get order statistics
// @route   GET /api/v1/orders/stats
// @access  Private
// ==========================================
export const getOrderStats = asyncHandler(async (req, res) => {
  let matchQuery = {};

  if (req.user.role === 'farmer') {
    matchQuery['items.farmerId'] = req.user._id;
  } else if (req.user.role === 'consumer') {
    matchQuery.buyerId = req.user._id;
  }

  const stats = await Order.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 },
        totalAmount: { $sum: '$totalAmount' }
      }
    }
  ]);

  const totalOrders = await Order.countDocuments(matchQuery);
  const totalRevenue = stats.reduce((sum, stat) => sum + stat.totalAmount, 0);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      totalRevenue,
      byStatus: stats
    }
  });
});

// ==========================================
// ADMIN ONLY CONTROLLERS
// ==========================================

// @desc    Get all orders (Admin)
// @route   GET /api/v1/orders/admin/all
// @access  Private/Admin
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20, sort = '-createdAt' } = req.query;

  const query = status ? { status } : {};
  const skip = (page - 1) * limit;

  const [orders, total] = await Promise.all([
    Order.find(query)
      .populate('buyerId', 'name email phone')
      .populate('items.farmerId', 'name shopName')
      .sort(sort)
      .skip(skip)
      .limit(parseInt(limit)),
    Order.countDocuments(query)
  ]);

  res.status(200).json({
    success: true,
    count: orders.length,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / limit)
    },
    data: orders
  });
});

// @desc    Get platform order statistics (Admin)
// @route   GET /api/v1/orders/admin/stats
// @access  Private/Admin
export const getPlatformOrderStats = asyncHandler(async (req, res) => {
  const [
    totalOrders,
    totalRevenue,
    ordersByStatus,
    recentOrders,
    topFarmers
  ] = await Promise.all([
    Order.countDocuments(),
    Order.aggregate([
      { $match: { status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]),
    Order.find()
      .sort('-createdAt')
      .limit(10)
      .populate('buyerId', 'name')
      .select('totalAmount status createdAt'),
    Order.aggregate([
      { $unwind: '$items' },
      { $match: { status: 'delivered' } },
      {
        $group: {
          _id: '$items.farmerId',
          totalOrders: { $sum: 1 },
          totalRevenue: {
            $sum: { $multiply: ['$items.priceAtPurchase', '$items.qty'] }
          }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'farmer'
        }
      },
      { $unwind: '$farmer' },
      {
        $project: {
          'farmer.name': 1,
          'farmer.shopName': 1,
          totalOrders: 1,
          totalRevenue: 1
        }
      }
    ])
  ]);

  res.status(200).json({
    success: true,
    data: {
      totalOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      ordersByStatus,
      recentOrders,
      topFarmers
    }
  });
});

