import jwt from 'jsonwebtoken';
import { User } from '../models/User.model.js';

export const verifyJWT = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check if Authorization header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer ')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized: Token missing',
      });
    }

    // 2️⃣ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded || !decoded.userId) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token payload',
      });
    }

    // 3️⃣ Fetch user from DB
    const user = await User.findById(decoded.userId).select('-passwordHash -refreshToken');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach user to request object
    req.user = user;
    next();

  } catch (err) {
    console.error('JWT Verification Error:', err.message);
    return res.status(401).json({
      success: false,
      message:
        err.name === 'TokenExpiredError'
          ? 'Token expired, please refresh your token'
          : 'Invalid or expired token',
    });
  }
};
