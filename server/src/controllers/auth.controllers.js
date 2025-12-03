import { User } from "../models/User.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";



// -----------------------------------------------------
// GENERIC REGISTER (OPTIONAL ENDPOINT)
// -----------------------------------------------------
export const register = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (role === "farmer") return registerFarmer(req, res);
  return registerConsumer(req, res);
});

// -----------------------------------------------------
// REGISTER CONSUMER
// @route POST /api/v1/auth/register/consumer
// -----------------------------------------------------
export const registerConsumer = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;

  if (!name || !email || !password || !phone) {
    return res.status(400).json({
      success: false,
      message: "Name, email, password & phone are required",
    });
  }

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  let formattedAddress = address || {
    street: "",
    city: "",
    state: "",
    pincode: "",
    coords: {
      type: "Point",
      coordinates: [0, 0],
    },
  };

  if (address?.coords) {
    formattedAddress.coords = {
      type: "Point",
      coordinates: [
        Number(address.coords.lng),   // longitude
        Number(address.coords.lat)    // latitude
      ],
    };
  }

  const user = new User({
    name,
    email,
    passwordHash: password,
    phone,
    role: "consumer",
    address: formattedAddress,
  });

  await user.save();

  
  const accessToken = user.generateAuthToken();
  const refreshToken = await user.generateRefreshToken();
  await user.save();

  res.status(201).json({
    success: true,
    message: "Consumer registered successfully",
    data: {
      user: user.getSafeProfile(),
      accessToken,
      refreshToken,
    },
  });
});

// -----------------------------------------------------
// REGISTER FARMER
// @route POST /api/v1/auth/register/farmer
// -----------------------------------------------------

export const registerFarmer = asyncHandler(async (req, res) => {
  const { name, email, password, phone, shopName, address } = req.body;

  if (!name || !email || !password || !phone || !shopName) {
    return res.status(400).json({
      success: false,
      message: "Farmer missing required fields",
    });
  }

  const existingUser = await User.findByEmail(email);
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "Email already registered",
    });
  }

  let formattedAddress = address;

  if (!address?.coords) {
    return res.status(400).json({
      success: false,
      message: "GPS coordinates required for farmers",
    });
  }

   if (address?.coords) {
    formattedAddress.coords = {
      type: "Point",
      coordinates: [
        Number(address.coords.lng),   // longitude
        Number(address.coords.lat)    // latitude
      ],
    };
  }

  const user = new User({
    name,
    email,
    passwordHash: password,
    role: "farmer",
    phone,
    shopName,
    address: formattedAddress,
  });

  await user.save();

  const accessToken = user.generateAuthToken();
  const refreshToken = await user.generateRefreshToken();
  await user.save();

  res.status(201).json({
    success: true,
    message: "Farmer registered successfully",
    data: {
      user: user.getSafeProfile(),
      accessToken,
      refreshToken,
    },
  });
});

// -----------------------------------------------------
// LOGIN (EMAIL + PASSWORD)
// -----------------------------------------------------
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password)
    return res.status(400).json({
      success: false,
      message: "Email and password required",
    });

  const user = await User.findOne({ email: email.toLowerCase() }).select("+passwordHash");
  if (!user)
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });

  const match = await user.comparePassword(password);
  if (!match)
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });

  const accessToken = user.generateAuthToken();
  const refreshToken = await user.generateRefreshToken();
  await user.save();

  res.json({
    success: true,
    message: "Login successful",
    data: {
      user: user.getSafeProfile(),
      accessToken,
      refreshToken,
    },
  });
});

// -----------------------------------------------------
// LOGOUT
// -----------------------------------------------------
export const logout = asyncHandler(async (req, res) => {
  if (!req.user)
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });

  const user = await User.findById(req.user._id);
  user.refreshToken = null;
  await user.save();

  res.json({
    success: true,
    message: "Logged out",
  });
});

