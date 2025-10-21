import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // unique index (no need for duplicate manual index)
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },

    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },

    role: {
      type: String,
      enum: ['farmer', 'consumer', 'admin'],
      default: 'consumer',
      index: true,
    },

    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      match: [/^[0-9+\-\s()]{10,20}$/, 'Please provide a valid phone number'],
    },

    shopName: {
      type: String,
      trim: true,
      required: function () {
        return this.role === 'farmer';
      },
      minlength: [2, 'Shop name must be at least 2 characters'],
      maxlength: [100, 'Shop name cannot exceed 100 characters'],
    },

    avatar: {
      type: String,
      default: null,
      validate: {
        validator: v => v === null || /^https?:\/\/.+/.test(v),
        message: 'Avatar must be a valid URL',
      },
    },

    address: {
      street: { type: String, trim: true },
      city: { type: String, trim: true, required: [true, 'City is required'] },
      state: { type: String, trim: true, required: [true, 'State is required'] },
      pincode: {
        type: String,
        trim: true,
        required: [true, 'Pincode is required'],
        match: [/^[0-9]{5,10}$/, 'Please provide a valid pincode'],
      },
      coords: {
        type: {
          type: String,
          enum: ['Point'],
          default: 'Point',
        },
        coordinates: {
          type: [Number], // [longitude, latitude]
          required: [true, 'Coordinates are required'],
          validate: {
            validator: v =>
              v.length === 2 &&
              v[0] >= -180 &&
              v[0] <= 180 &&
              v[1] >= -90 &&
              v[1] <= 90,
            message: 'Invalid coordinates format [longitude, latitude]',
          },
        },
      },
    },

    bankDetails: {
      accountNumber: { type: String, trim: true,},
      ifscCode: { type: String, trim: true, uppercase: true, },
      accountHolderName: { type: String, trim: true,  },
      upiId: {
        type: String,
        trim: true,
        validate: {
          validator: v => !v || /^[\w.-]+@[\w.-]+$/.test(v),
          message: 'Invalid UPI ID format',
        },
      },
    },

    verified: {
      type: Boolean,
      default: false,
      index: true,
    },

    rating: {
      average: { type: Number, default: 0, min: 0, max: 5 },
      count: { type: Number, default: 0, min: 0 },
    },

    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

//
// INDEXES
//
userSchema.index({ 'address.coords': '2dsphere' }); // for geo queries
userSchema.index({ role: 1, verified: 1 }); // compound
userSchema.index({ name: 'text', shopName: 'text', email: 'text' }); // text search

//
// VIRTUALS
//
userSchema.virtual('products', {
  ref: 'Product',
  localField: '_id',
  foreignField: 'farmerId',
});

userSchema.virtual('address.coords.lat').get(function () {
  return this.address?.coords?.coordinates?.[1];
});
userSchema.virtual('address.coords.lng').get(function () {
  return this.address?.coords?.coordinates?.[0];
});

userSchema.virtual('address.coords.lat').set(function (lat) {
  if (!this.address) this.address = {};
  if (!this.address.coords) this.address.coords = { type: 'Point', coordinates: [0, 0] };
  this.address.coords.coordinates[1] = lat;
});
userSchema.virtual('address.coords.lng').set(function (lng) {
  if (!this.address) this.address = {};
  if (!this.address.coords) this.address.coords = { type: 'Point', coordinates: [0, 0] };
  this.address.coords.coordinates[0] = lng;
});

//
// MIDDLEWARE
//
userSchema.pre('save', async function (next) {
  if (!this.isModified('passwordHash')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.passwordHash = await bcrypt.hash(this.passwordHash, salt);
    next();
  } catch (err) {
    next(err);
  }
});

userSchema.pre('save', function (next) {
  if (this.role === 'farmer' && !this.shopName) {
    return next(new Error('Shop name is required for farmers'));
  }
  next();
});

userSchema.pre('save', function (next) {
  if (this.address?.coords?.lat !== undefined && this.address?.coords?.lng !== undefined) {
    const { lat, lng } = this.address.coords;
    this.address.coords = {
      type: 'Point',
      coordinates: [lng, lat],
    };
  }
  next();
});

//
// INSTANCE METHODS
//
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.passwordHash);
};

userSchema.methods.generateAuthToken = function () {
  return jwt.sign(
    { userId: this._id, role: this.role, email: this.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '15m' }
  );
};

userSchema.methods.generateRefreshToken = function () {
  const refreshToken = jwt.sign(
    { userId: this._id },
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d' }
  );
  this.refreshToken = refreshToken;
  return refreshToken;
};

userSchema.methods.isFarmer = function () {
  return this.role === 'farmer';
};
userSchema.methods.isConsumer = function () {
  return this.role === 'consumer';
};
userSchema.methods.isAdmin = function () {
  return this.role === 'admin';
};

userSchema.methods.getSafeProfile = function () {
  const profile = this.toObject();
  delete profile.passwordHash;
  delete profile.refreshToken;
  delete profile.bankDetails;
  delete profile.__v;
  return profile;
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.passwordHash;
  delete obj.refreshToken;
  delete obj.__v;
  if (!obj.bankDetails || Object.keys(obj.bankDetails).length === 0) delete obj.bankDetails;
  return obj;
};

//
// STATIC METHODS
//
userSchema.statics.findByEmail = function (email) {
  return this.findOne({ email: email.toLowerCase() });
};

userSchema.statics.findVerifiedFarmers = function () {
  return this.find({ role: 'farmer', verified: true });
};

userSchema.statics.findNearby = function (longitude, latitude, maxDistance = 10000) {
  return this.find({
    'address.coords': {
      $near: {
        $geometry: { type: 'Point', coordinates: [longitude, latitude] },
        $maxDistance: maxDistance,
      },
    },
  });
};

userSchema.statics.getStatistics = async function () {
  const [total, farmers, consumers, admins, verified] = await Promise.all([
    this.countDocuments(),
    this.countDocuments({ role: 'farmer' }),
    this.countDocuments({ role: 'consumer' }),
    this.countDocuments({ role: 'admin' }),
    this.countDocuments({ verified: true }),
  ]);

  return { total, byRole: { farmers, consumers, admins }, verified };
};

//
// EXPORT
//
export const User = mongoose.model('User', userSchema);
