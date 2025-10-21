// ==========================================
// middlewares/role.middleware.js
// Role-based authorization middleware
// ==========================================

export const isFarmer = (req, res, next) => {
  if (req.user.role !== "farmer") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Farmer role required."
    });
  }
  next();
};

export const isConsumer = (req, res, next) => {
  if (req.user.role !== "consumer") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Consumer role required."
    });
  }
  next();
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin role required."
    });
  }
  next();
};
