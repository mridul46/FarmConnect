// src/components/Profile.jsx
import React, { useState, useEffect } from "react";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Edit,
  LogOut,
  Save,
  X,
  Camera,
  Shield,
  Award,
  TrendingUp,
  Calendar,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../../Context/authContext";

// Display full address string from user object
const getDisplayAddress = (user) => {
  if (!user) return "-";

  if (typeof user.address === "string" && user.address.trim()) {
    return user.address.trim();
  }

  if (user.address && typeof user.address === "object") {
    const { street, city, state, pincode } = user.address;
    const parts = [street, city, state, pincode].filter(Boolean);
    return parts.length ? parts.join(", ") : "-";
  }

  return "-";
};

export default function Profile() {
  const {
    user: authUser,
    token,
    logout,
    updateProfile,        // consumer
    updateFarmerProfile,  // farmer
    getFarmerProfile,     // farmer /api/v1/farmer/:id
  } = useAuth();

  const [user, setUser] = useState(authUser || {});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const [profileImage, setProfileImage] = useState(
    authUser?.profileImage || authUser?.avatar || ""
  );
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    authUser?.profileImage || authUser?.avatar || ""
  );

  const isFarmer = user?.role === "farmer";

  // Safely get address object from user
  const getAddressObject = (srcUser) => {
    if (typeof srcUser?.address === "object" && srcUser.address !== null) {
      return srcUser.address;
    }
    return {
      street: "",
      city: srcUser?.city || "",
      state: srcUser?.state || "",
      pincode: srcUser?.pincode || "",
      coords: null,
    };
  };

  // ---------- FORM STATE (common + farmer-specific) ----------
  const initialAddressObj = getAddressObject(authUser || {});
  const initialBank = authUser?.bankDetails || {};
  const [formData, setFormData] = useState({
    name: authUser?.name || "",
    email: authUser?.email || "",
    phone: authUser?.phone || "",
    address: initialAddressObj.street || "",
    city: initialAddressObj.city || "",
    state: initialAddressObj.state || "",
    pincode: initialAddressObj.pincode || "",

    // farmer-only
    shopName: authUser?.shopName || "",
    accountNumber: initialBank?.accountNumber || "",
    ifscCode: initialBank?.ifscCode || "",
    accountHolderName: initialBank?.accountHolderName || "",
    upiId: initialBank?.upiId || "",
  });

  // 🔄 Sync from authUser (and for farmer, optionally refetch from /farmer/:id)
  useEffect(() => {
    if (!authUser) return;

    const syncFromUser = (baseUser) => {
      const addrObj = getAddressObject(baseUser);
      const bank = baseUser?.bankDetails || {};

      setUser(baseUser);

      const img = baseUser.profileImage || baseUser.avatar || "";
      setProfileImage(img);
      if (!imageFile) {
        setImagePreview(img);
      }

      setFormData({
        name: baseUser.name || "",
        email: baseUser.email || "",
        phone: baseUser.phone || "",
        address: addrObj.street || "",
        city: addrObj.city || "",
        state: addrObj.state || "",
        pincode: addrObj.pincode || "",

        shopName: baseUser.shopName || "",
        accountNumber: bank.accountNumber || "",
        ifscCode: bank.ifscCode || "",
        accountHolderName: bank.accountHolderName || "",
        upiId: bank.upiId || "",
      });
    };

    // Non-farmer → just use authUser
    if (authUser.role !== "farmer" || !getFarmerProfile) {
      syncFromUser(authUser);
      return;
    }

    // Farmer → try richer profile from backend
    (async () => {
      try {
        const data = await getFarmerProfile(authUser._id);
        const freshUser = data?.user || authUser;
        syncFromUser(freshUser);
      } catch (err) {
        console.warn("getFarmerProfile in Profile failed, using authUser:", err);
        syncFromUser(authUser);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  // Toggle edit mode
  const handleToggleEdit = () => {
    if (isEditing) {
      const addrObj = getAddressObject(user);
      const bank = user?.bankDetails || {};

      setFormData({
        name: user?.name || "",
        email: user?.email || "",
        phone: user?.phone || "",
        address: addrObj.street || "",
        city: addrObj.city || "",
        state: addrObj.state || "",
        pincode: addrObj.pincode || "",

        shopName: user?.shopName || "",
        accountNumber: bank.accountNumber || "",
        ifscCode: bank.ifscCode || "",
        accountHolderName: bank.accountHolderName || "",
        upiId: bank.upiId || "",
      });

      setImagePreview(
        user?.profileImage || user?.avatar || profileImage || ""
      );
      setImageFile(null);
    }
    setIsEditing((prev) => !prev);
  };

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Local image preview
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

// Save profile (consumer or farmer)
const handleEditProfile = async (e) => {
  e.preventDefault();

  if (!user?._id && !authUser?._id) {
    toast.error("User id missing");
    return;
  }
  if (!token) {
    toast.error("Not authenticated. Please login again.");
    return;
  }

  try {
    setLoading(true);

    const addressObject = {
      street: formData.address || "",
      city: formData.city || "",
      state: formData.state || "",
      pincode: formData.pincode || "",
      coords:
        typeof user?.address === "object" && user.address !== null
          ? user.address.coords || null
          : null,
    };

    const fd = new FormData();
    fd.append("name", formData.name || "");
    fd.append("email", formData.email || "");
    fd.append("phone", formData.phone || "");
    fd.append("address", JSON.stringify(addressObject));

    // Farmer-only extra fields
    if (user?.role === "farmer") {
      if (formData.shopName) {
        fd.append("shopName", formData.shopName);
      }

      const bankDetailsPayload = {
        accountNumber: formData.accountNumber || "",
        ifscCode: formData.ifscCode || "",
        accountHolderName: formData.accountHolderName || "",
        upiId: formData.upiId || "",
      };

      const hasAnyBankField = Object.values(bankDetailsPayload).some(
        (v) => v && String(v).trim() !== ""
      );
      if (hasAnyBankField) {
        fd.append("bankDetails", JSON.stringify(bankDetailsPayload));
      }
    }

    if (imageFile) {
      fd.append("profileImage", imageFile); // <== field that multer listens to
    }

    // Choose correct updater
    const updater =
      user?.role === "farmer" && updateFarmerProfile
        ? updateFarmerProfile
        : updateProfile;

    const updatedUser = await updater(fd);

    if (updatedUser) {
      const serverImage =
        updatedUser.profileImage || updatedUser.avatar || profileImage;

      // ✅ merge with previous user to avoid losing address / bankDetails
      setUser((prev) => {
        const prevSafe = prev || {};
        const next = updatedUser || {};

        const mergedAddress =
          next.address !== undefined ? next.address : prevSafe.address;

        const mergedBankDetails = {
          ...(prevSafe.bankDetails || {}),
          ...(next.bankDetails || {}),
        };

        return {
          ...prevSafe,
          ...next,
          address: mergedAddress,
          bankDetails: mergedBankDetails,
        };
      });

      setProfileImage(serverImage);
      setImagePreview(serverImage);

      // also sync form state from merged user
      const mergedForForm = {
        ...(user || {}),
        ...(updatedUser || {}),
        address:
          updatedUser?.address !== undefined
            ? updatedUser.address
            : user?.address,
        bankDetails: {
          ...(user?.bankDetails || {}),
          ...(updatedUser?.bankDetails || {}),
        },
      };

      const addrObj = getAddressObject(mergedForForm);
      const bank = mergedForForm.bankDetails || {};

      setFormData({
        name: mergedForForm.name || "",
        email: mergedForForm.email || "",
        phone: mergedForForm.phone || "",
        address: addrObj.street || "",
        city: addrObj.city || "",
        state: addrObj.state || "",
        pincode: addrObj.pincode || "",
        shopName: mergedForForm.shopName || "",
        accountNumber: bank.accountNumber || "",
        ifscCode: bank.ifscCode || "",
        accountHolderName: bank.accountHolderName || "",
        upiId: bank.upiId || "",
      });
    }

    setIsEditing(false);
    setImageFile(null);
    toast.success("Profile updated successfully");
  } catch (error) {
    console.error("Update profile failed:", error);
    const msg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to update profile";
    toast.error(msg);
  } finally {
    setLoading(false);
  }
};


  const addrObjForDisplay = getAddressObject(user);

  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-6 sm:py-8">
      <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 md:p-8 flex flex-col gap-5 sm:gap-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 sm:gap-3">
            <User className="w-6 h-6 text-emerald-600 shrink-0" />
            <h2 className="text-lg sm:text-xl font-semibold">
              {isEditing ? "Edit Profile" : "My Profile"}
            </h2>
          </div>

          <div className="flex flex-wrap gap-2 justify-start sm:justify-end">
            {isEditing ? (
              <>
                <button
                  onClick={handleEditProfile}
                  disabled={loading}
                  className="inline-flex justify-center items-center gap-1 px-3 py-1.5 text-sm rounded-xl bg-emerald-600 text-white disabled:opacity-60 w-full sm:w-auto"
                >
                  <Save className="w-4 h-4" />
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  onClick={handleToggleEdit}
                  className="inline-flex justify-center items-center gap-1 px-3 py-1.5 text-sm rounded-xl border border-gray-200 w-full sm:w-auto"
                >
                  <X className="w-4 h-4" />
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleToggleEdit}
                className="inline-flex justify-center items-center gap-1 px-3 py-1.5 text-sm rounded-xl border border-emerald-600 text-emerald-600 w-full sm:w-auto"
              >
                <Edit className="w-4 h-4" />
                Edit
              </button>
            )}

            <button
              onClick={logout}
              className="inline-flex justify-center items-center gap-1 px-3 py-1.5 text-sm rounded-xl border border-red-500 text-red-500 w-full sm:w-auto"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-col md:flex-row gap-5 md:gap-8">
          {/* Left: avatar & tags */}
          <div className="flex flex-col items-center gap-3 md:w-1/3">
            <div className="relative">
              <img
                src={
                  imagePreview ||
                  "https://via.placeholder.com/120?text=Profile"
                }
                alt="Profile"
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover border-4 border-emerald-100"
              />
              {isEditing && (
                <label className="absolute bottom-1 right-1 bg-white p-1 rounded-full shadow cursor-pointer">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            <div className="text-center space-y-0.5">
              <p className="font-semibold text-base sm:text-lg wrap-break-word">
                {user?.name}
              </p>
              <p className="text-xs sm:text-[13px] text-gray-500">
                {isFarmer
                  ? "Farmer"
                  : user?.role === "consumer"
                  ? "Consumer"
                  : "User"}
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 text-[11px] sm:text-xs">
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
                <Shield className="w-3 h-3" />
                Verified
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-50 text-yellow-700">
                <Award className="w-3 h-3" />
                Trusted
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                <TrendingUp className="w-3 h-3" />
                Active
              </span>
            </div>
          </div>

          {/* Right: form */}
          <div className="md:w-2/3 w-full">
            <form
              onSubmit={handleEditProfile}
              className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5"
            >
              {/* Name */}
              <div>
                <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                  Name
                </label>
                {isEditing ? (
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                ) : (
                  <p className="text-sm font-medium flex items-center gap-2 wrap-break-word">
                    <User className="w-4 h-4 text-gray-400 shrink-0" />
                    {user?.name || "-"}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                  Email
                </label>
                {isEditing ? (
                  <input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                ) : (
                  <p className="text-sm flex items-center gap-2 break-all">
                    <Mail className="w-4 h-4 text-gray-400 shrink-0" />
                    {user?.email || "-"}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                  Phone
                </label>
                {isEditing ? (
                  <input
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                ) : (
                  <p className="text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400 shrink-0" />
                    {user?.phone || "-"}
                  </p>
                )}
              </div>

              {/* City */}
              <div>
                <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                  City
                </label>
                {isEditing ? (
                  <input
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                ) : (
                  <p className="text-sm wrap-break-word">
                    {user?.city || addrObjForDisplay.city || "-"}
                  </p>
                )}
              </div>

              {/* State */}
              <div>
                <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                  State
                </label>
                {isEditing ? (
                  <input
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                ) : (
                  <p className="text-sm wrap-break-word">
                    {user?.state || addrObjForDisplay.state || "-"}
                  </p>
                )}
              </div>

              {/* Pincode */}
              <div>
                <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                  Pincode
                </label>
                {isEditing ? (
                  <input
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleChange}
                    className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  />
                ) : (
                  <p className="text-sm">
                    {user?.pincode || addrObjForDisplay.pincode || "-"}
                  </p>
                )}
              </div>

              {/* Address – full width */}
              <div className="sm:col-span-2">
                <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                  Address
                </label>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows={2}
                    className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 resize-none"
                    placeholder="House / Street / Landmark"
                  />
                ) : (
                  <p className="text-sm flex items-start gap-2 wrap-break-word">
                    <MapPin className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                    {getDisplayAddress(user)}
                  </p>
                )}
              </div>

              {/* FARMER-ONLY FIELDS */}
              {isFarmer && (
                <>
                  {/* Shop Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                      Shop Name
                    </label>
                    {isEditing ? (
                      <input
                        name="shopName"
                        value={formData.shopName}
                        onChange={handleChange}
                        className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                    ) : (
                      <p className="text-sm">{user?.shopName || "Not set"}</p>
                    )}
                  </div>

                  {/* Bank details label */}
                  <div className="sm:col-span-2 mt-2">
                    <p className="text-xs font-semibold text-gray-600">
                      Bank Details
                    </p>
                  </div>

                  {/* Account Number */}
                  <div>
                    <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                      Account Number
                    </label>
                    {isEditing ? (
                      <input
                        name="accountNumber"
                        value={formData.accountNumber}
                        onChange={handleChange}
                        className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                    ) : (
                      <p className="text-sm">
                        {user?.bankDetails?.accountNumber || "Not set"}
                      </p>
                    )}
                  </div>

                  {/* IFSC Code */}
                  <div>
                    <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                      IFSC Code
                    </label>
                    {isEditing ? (
                      <input
                        name="ifscCode"
                        value={formData.ifscCode}
                        onChange={handleChange}
                        className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200 uppercase"
                      />
                    ) : (
                      <p className="text-sm uppercase">
                        {user?.bankDetails?.ifscCode || "Not set"}
                      </p>
                    )}
                  </div>

                  {/* Account Holder Name */}
                  <div>
                    <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                      Account Holder Name
                    </label>
                    {isEditing ? (
                      <input
                        name="accountHolderName"
                        value={formData.accountHolderName}
                        onChange={handleChange}
                        className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                      />
                    ) : (
                      <p className="text-sm">
                        {user?.bankDetails?.accountHolderName || "Not set"}
                      </p>
                    )}
                  </div>

                  {/* UPI ID */}
                  <div>
                    <label className="block text-[11px] sm:text-xs text-gray-500 mb-1">
                      UPI ID
                    </label>
                    {isEditing ? (
                      <input
                        name="upiId"
                        value={formData.upiId}
                        onChange={handleChange}
                        className="w-full text-sm border rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                        placeholder="example@upi"
                      />
                    ) : (
                      <p className="text-sm">
                        {user?.bankDetails?.upiId || "Not set"}
                      </p>
                    )}
                  </div>
                </>
              )}
            </form>

            {/* extra info row */}
            <div className="mt-4 flex flex-wrap gap-3 text-[11px] sm:text-xs text-gray-500">
              <div className="inline-flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                <span className="whitespace-nowrap">
                  Joined:{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
              <div className="inline-flex items-center gap-1 break-all">
                <FileText className="w-3 h-3" />
                <span>User ID: {user?._id || "N/A"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
