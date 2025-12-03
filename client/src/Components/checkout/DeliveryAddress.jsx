import { MapPin, Edit2, Check } from "lucide-react";
import React, { useState, useEffect } from "react";


 
export default function DeliveryAddress({
  address = {},
  onSave,
  onAddNew,
  loading = false,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [isNew, setIsNew] = useState(false);

  const [form, setForm] = useState({
    label: "Home",
    name: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    isPrimary: true,
  });

  // Sync local form when address prop changes (for edit existing)
  useEffect(() => {
    if (address && Object.keys(address).length) {
      setForm((prev) => ({
        ...prev,
        ...address,
      }));
      setIsNew(false);
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleEditClick = () => {
    if (!address || !Object.keys(address).length) {
      // if no address, treat as new
      handleAddNewClick();
      return;
    }
    setIsEditing(true);
    setIsNew(false);
  };

  const handleAddNewClick = () => {
    setForm({
      label: "Home",
      name: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
      phone: "",
      isPrimary: true,
    });
    setIsEditing(true);
    setIsNew(true);
    onAddNew && onAddNew(); // parent can track "add new" mode if needed
  };

  const handleSave = () => {
    if (!form.name || !form.line1 || !form.city || !form.state || !form.pincode) {
      // you can swap this with toast in your app
      alert("Please fill all required address fields.");
      return;
    }
    onSave && onSave(form);
    setIsEditing(false);
    setIsNew(false);
  };

  const displayAddress = address && Object.keys(address).length ? address : form;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center">
            <MapPin size={20} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Delivery Address
            </h2>
            <p className="text-sm text-gray-500">
              Where should we deliver?
            </p>
          </div>
        </div>

        {!isEditing && (
          <button
            type="button"
            onClick={handleEditClick}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Edit2 size={18} className="text-gray-600" />
          </button>
        )}
      </div>

      <div className="p-6">
        {/* VIEW MODE */}
        {!isEditing && displayAddress && displayAddress.name ? (
          <div className="flex items-start gap-4 p-4 bg-linear-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
              <Check size={16} className="text-white" />
            </div>

            <div>
              {displayAddress.isPrimary && (
                <span className="inline-block px-3 py-1 bg-green-600 text-white text-xs rounded-full mb-2">
                  Primary
                </span>
              )}

              <p className="font-semibold text-gray-900">
                {displayAddress.label || "Home"}
              </p>

              <p className="text-sm text-gray-600 leading-relaxed">
                {displayAddress.name} <br />
                {displayAddress.line1}
                {displayAddress.line2 && (
                  <>
                    <br />
                    {displayAddress.line2}
                  </>
                )}
                <br />
                {displayAddress.city}, {displayAddress.state}{" "}
                {displayAddress.pincode}
                <br />
                Phone: {displayAddress.phone}
              </p>
            </div>
          </div>
        ) : !isEditing ? (
          // No address yet
          <div className="p-4 rounded-xl border-2 border-dashed border-gray-200 text-sm text-gray-500">
            No delivery address added yet. Please add one below.
          </div>
        ) : null}

        {/* EDIT / ADD FORM */}
        {isEditing && (
          <div className="mt-4 space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Label
                </label>
                <input
                  name="label"
                  value={form.label}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Home / Work / Other"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Full Name
                </label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="John Doe"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Address Line 1
              </label>
              <input
                name="line1"
                value={form.line1}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="123, MG Road"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Address Line 2 (Optional)
              </label>
              <input
                name="line2"
                value={form.line2}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="Near Koramangala"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  City
                </label>
                <input
                  name="city"
                  value={form.city}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Bangalore"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  State
                </label>
                <input
                  name="state"
                  value={form.state}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Karnataka"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  Pincode
                </label>
                <input
                  name="pincode"
                  value={form.pincode}
                  onChange={handleChange}
                  className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="560034"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
                placeholder="+91 98765 43210"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  if (isNew) setIsNew(false);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-600 border border-gray-200 rounded-xl hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:opacity-60"
                disabled={loading}
              >
                {loading ? "Saving..." : "Save Address"}
              </button>
            </div>
          </div>
        )}

        {/* Add new button (only when not editing) */}
        {!isEditing && (
          <button
            type="button"
            onClick={handleAddNewClick}
            className="mt-4 w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 font-medium hover:border-green-500 hover:text-green-600 transition-colors"
          >
            + Add New Address
          </button>
        )}
      </div>
    </div>
  );
}
