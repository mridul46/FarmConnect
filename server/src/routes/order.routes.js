// ==========================================
// routes/order.routes.js
// ==========================================

import { Router } from 'express';
import { verifyJWT } from '../middleware/auth.middleware.js';
import { isAdmin,isConsumer,isFarmer } from '../middleware/role.middleware.js';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  cancelOrder,
  getFarmerOrders,
  getOrderStats,
  getAllOrders,
  getPlatformOrderStats
} from '../controllers/order.controllers.js';

const router = Router();

// All order routes require authentication
router.use(verifyJWT);

// ==========================================
// CONSUMER ROUTES
// ==========================================

// Create new order (consumer only)
router.post('/', isConsumer, createOrder);

// Get my orders (consumer/farmer/admin)
router.get('/', getUserOrders);

// Get single order details
router.get('/:id', getOrderById);

// Cancel order (consumer/admin)
router.post('/:id/cancel', cancelOrder);

// Get order statistics
router.get('/me/stats', getOrderStats);

// ==========================================
// FARMER ROUTES
// ==========================================

// Get farmer orders dashboard
router.get('/farmer/dashboard', isFarmer, getFarmerOrders);

// Update order status (farmer/admin)
router.patch('/:id/status', [isFarmer, isAdmin], updateOrderStatus);

// ==========================================
// ADMIN ROUTES
// ==========================================

const adminOnly =isAdmin

// Get all orders
router.get('/admin/all', adminOnly, getAllOrders);

// Get platform statistics
router.get('/admin/stats', adminOnly, getPlatformOrderStats);

export default router;
