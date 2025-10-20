// ==========================================
// controllers/user/consumer.controllers.js
// Consumer-specific operations
// ==========================================

import { asyncHandler } from "../../utils/asyncHandler.js";
// Get consumer dashboard stats
export const getConsumerStats = asyncHandler(async (req, res) => {
  const consumerId = req.user._id;
  
  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalSpent
  ] = await Promise.all([
    Order.countDocuments({ buyerId: consumerId }),
    Order.countDocuments({ 
      buyerId: consumerId, 
      status: { $in: ['pending', 'paid', 'preparing', 'out_for_delivery'] } 
    }),
    Order.countDocuments({ 
      buyerId: consumerId, 
      status: 'delivered' 
    }),
    Order.aggregate([
      { $match: { buyerId: consumerId, status: 'delivered' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ])
  ]);
  
  const recentOrders = await Order.find({ buyerId: consumerId })
    .sort('-createdAt')
    .limit(5)
    .select('_id items.title totalAmount status createdAt');
  
  res.status(200).json({
    success: true,
    data: {
      user: req.user,
      stats: {
        orders: {
          total: totalOrders,
          pending: pendingOrders,
          completed: completedOrders
        },
        spending: {
          total: totalSpent[0]?.total || 0
        }
      },
      recentOrders
    }
  });
});