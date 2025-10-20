
import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken';

// ==========================================
// @desc    Register new user
// @route   POST /api/v1/auth/register
// @access  Public
// ==========================================
export const register = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    phone,
    shopName,
    address
  } = req.body;

  // Validate required fields
  if (!name || !email || !password || !phone || !address) {
    return res.status(400).json({
      success: false,
      message: 'Please provide all required fields'
    });
  }

  // Check if user exists
  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'Email already registered'
    });
  }

  // FIXED: Handle coordinate format
  let formattedAddress = address;
  if (address?.coords) {
    // Convert lat/lng to GeoJSON if needed
    if (address.coords.lat !== undefined && address.coords.lng !== undefined) {
      formattedAddress = {
        ...address,
        coords: {
          type: 'Point',
          coordinates: [address.coords.lng, address.coords.lat]
        }
      };
    }
  }

  // Validate farmer-specific fields
  if (role === 'farmer' && !shopName) {
    return res.status(400).json({
      success: false,
      message: 'Shop name is required for farmers'
    });
  }

  // Create user
  const user = new User({
    name,
    email,
    passwordHash: password,  // Will be hashed by pre-save hook
    role: role || 'consumer',
    phone,
    shopName: role === 'farmer' ? shopName : undefined,
    address: formattedAddress
  });

  await user.save();

  // Generate tokens
  const accessToken = user.generateAuthToken();
  const refreshToken = await user.generateRefreshToken();
  await user.save();  // Save refresh token to DB

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: {
      user: user.getSafeProfile(),
      accessToken,
      refreshToken
    }
  });
});

// ==========================================
// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
// ==========================================
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password'
    });
  }

  // FIXED: Explicitly select passwordHash for comparison
  const user = await User.findOne({ email: email.toLowerCase() })
    .select('+passwordHash');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Check if user is verified (optional - enable if you need email verification)
  // if (!user.verified) {
  //   return res.status(401).json({
  //     success: false,
  //     message: 'Please verify your email before logging in'
  //   });
  // }

  // Compare password
  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password'
    });
  }

  // Generate tokens
  const accessToken = user.generateAuthToken();
  const refreshToken = await user.generateRefreshToken();
  await user.save();  // Save refresh token to DB

  res.status(200).json({
    success: true,
    message: 'Login successful',
    data: {
      user: user.getSafeProfile(),
      accessToken,
      refreshToken
    }
  });
});

// ==========================================
// @desc    Refresh access token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
// ==========================================
export const refreshToken = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({
      success: false,
      message: 'Refresh token is required'
    });
  }

  try {
    // Verify refresh token
    const decoded = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET
    );

    // Find user and verify refresh token matches
    const user = await User.findById(decoded.userId).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({
        success: false,
        message: 'Invalid refresh token'
      });
    }

    // Generate new access token
    const newAccessToken = user.generateAuthToken();

    res.status(200).json({
      success: true,
      data: {
        accessToken: newAccessToken
      }
    });
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired refresh token'
    });
  }
});

// ==========================================
// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
// ==========================================
export const logout = asyncHandler(async (req, res) => {
  // Check if user is attached to request (from auth middleware)
  if (!req.user || !req.user._id) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized: No user found in request',
    });
  }

  // Clear refresh token from DB
  const user = await User.findById(req.user._id);
  console.log('req.user from verifyJWT:', req.user);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found',
    });
  }

  user.refreshToken = null;
  await user.save();

  // Optionally clear cookies if you store tokens in cookies
  res.clearCookie('accessToken');
  res.clearCookie('refreshToken');

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
});
// ==========================================
// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
// ==========================================
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email'
    });
  }

  const user = await User.findByEmail(email);

  if (!user) {
    // Don't reveal if user exists or not (security best practice)
    return res.status(200).json({
      success: true,
      message: 'If an account exists with this email, a password reset link will be sent'
    });
  }

  // Generate reset token (valid for 1 hour)
  const resetToken = jwt.sign(
    { userId: user._id, purpose: 'password-reset' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );

  // TODO: Send email with reset link
  // await sendPasswordResetEmail(user.email, resetToken);
  
  // For development, return token in response (REMOVE IN PRODUCTION)
  res.status(200).json({
    success: true,
    message: 'Password reset link sent to email',
    ...(process.env.NODE_ENV === 'development' && { resetToken })  // Only in dev
  });
});

// ==========================================
// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
// ==========================================
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({
      success: false,
      message: 'Please provide token and new password'
    });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters'
    });
  }

  try {
    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== 'password-reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    // Find user and update password
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.passwordHash = newPassword;
    user.refreshToken = null;  // Invalidate all refresh tokens
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Password reset successful. Please login with your new password'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired reset token'
    });
  }
});

// ==========================================
// @desc    Verify email
// @route   GET /api/v1/auth/verify-email/:token
// @access  Public
// ==========================================
export const verifyEmail = asyncHandler(async (req, res) => {
  const { token } = req.params;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded.purpose !== 'email-verification') {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.verified) {
      return res.status(400).json({
        success: false,
        message: 'Email already verified'
      });
    }

    user.verified = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Email verified successfully'
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: 'Invalid or expired verification token'
    });
  }
});

// ==========================================
// @desc    Resend verification email
// @route   POST /api/v1/auth/resend-verification
// @access  Public
// ==========================================
export const resendVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email'
    });
  }

  const user = await User.findByEmail(email);

  if (!user) {
    return res.status(200).json({
      success: true,
      message: 'If an account exists, verification email will be sent'
    });
  }

  if (user.verified) {
    return res.status(400).json({
      success: false,
      message: 'Email already verified'
    });
  }

  // Generate verification token
  const verificationToken = jwt.sign(
    { userId: user._id, purpose: 'email-verification' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  );

  // TODO: Send verification email
  // await sendVerificationEmail(user.email, verificationToken);

  res.status(200).json({
    success: true,
    message: 'Verification email sent',
    ...(process.env.NODE_ENV === 'development' && { verificationToken })
  });
});

// ==========================================
// @desc    Get current authenticated user
// @route   GET /api/v1/auth/me
// @access  Private
// ==========================================
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  res.status(200).json({
    success: true,
    data: user
  });
});
