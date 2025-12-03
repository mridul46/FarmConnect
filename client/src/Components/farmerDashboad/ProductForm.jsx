import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { Upload, AlertCircle, CheckCircle, MapPin, Leaf, Droplet, Info, X } from "lucide-react";

/**
 * ProductForm props:
 * - initial (object) - initial values for edit (optional)
 * - onSubmit(formData: object, file: File|null) => Promise
 * - submitLabel (string) - button text
 * - loading (bool)
 */
export default function ProductForm({ initial = {}, onSubmit, submitLabel = "Save", loading = false }) {
  // form state
  const [title, setTitle] = useState(initial.title ?? "");
  const [description, setDescription] = useState(initial.description ?? "");
  const [category, setCategory] = useState(initial.category ?? "Vegetables");
  const [pricePerUnit, setPricePerUnit] = useState(initial.pricePerUnit ?? "");
  const [stock, setStock] = useState(initial.stock ?? initial.stockQuantity ?? 0);
  const [unit, setUnit] = useState(initial.unit ?? "kg");
  const [lat, setLat] = useState(initial.location?.coordinates?.[1] ?? "");
  const [lng, setLng] = useState(initial.location?.coordinates?.[0] ?? "");
  const [visible, setVisible] = useState(initial.visible ?? true);
  const [organic, setOrganic] = useState(initial.organic ?? false);
  const [tagsInput, setTagsInput] = useState((initial.tags || []).join(", "));
  const [minOrder, setMinOrder] = useState(initial.minOrder ?? 1);
  const [deliveryRadius, setDeliveryRadius] = useState(initial.deliveryRadius ?? 10);
  const [farmingMethod, setFarmingMethod] = useState(initial.farmingMethod ?? "");
  const [nutrientsInput, setNutrientsInput] = useState(
    initial.nutrients
      ? Object.entries(initial.nutrients)
          .map(([k, v]) => `${k}:${v}`)
          .join(", ")
      : ""
  );

  // image file preview
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(initial.images?.[0] ?? null);
  const [dragActive, setDragActive] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!file) {
      setPreview(initial.images?.[0] ?? null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file, initial.images]);

  // categories & units - keep synced with backend enum
  const categories = useMemo(
    () => ["Vegetables", "Fruits", "Grains", "Dairy", "Leafy Greens", "Herbs", "Other"],
    []
  );
  const units = useMemo(() => ["kg", "bunch", "piece", "dozen", "liter"], []);
  const farmingMethods = useMemo(() => ["Organic", "Conventional", "Hydroponic", "Mixed"], []);

  const parseNutrientsForBackend = (str) => {
    if (!str) return undefined;
    const obj = {};
    str
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .forEach((pair) => {
        const [k, v] = pair.split(":").map((x) => x && x.trim());
        if (!k) return;
        const n = Number(v);
        obj[k] = Number.isNaN(n) ? v : n;
      });
    return Object.keys(obj).length ? obj : undefined;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!title || title.trim().length < 3) {
      newErrors.title = "Title must be at least 3 characters";
    }

    if (
      String(pricePerUnit).trim() === "" ||
      Number.isNaN(Number(pricePerUnit)) ||
      Number(pricePerUnit) <= 0
    ) {
      newErrors.pricePerUnit = "Enter a valid price (greater than 0)";
    }

    if (String(stock).trim() === "" || Number.isNaN(Number(stock)) || Number(stock) < 0) {
      newErrors.stock = "Enter valid stock quantity";
    }

    if (
      String(lat).trim() === "" ||
      String(lng).trim() === "" ||
      Number.isNaN(Number(lat)) ||
      Number.isNaN(Number(lng))
    ) {
      newErrors.location = "Enter valid latitude and longitude";
    } else {
      if (Number(lat) < -90 || Number(lat) > 90) {
        newErrors.location = "Latitude must be between -90 and 90";
      }

      if (Number(lng) < -180 || Number(lng) > 180) {
        newErrors.location = "Longitude must be between -180 and 180";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPayload = () => {
    if (!validateForm()) {
      throw new Error("Please fix the errors above");
    }

    const tags = tagsInput
      ? tagsInput.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const nutrients = parseNutrientsForBackend(nutrientsInput);

    return {
      title: title.trim(),
      description: description.trim(),
      category,
      pricePerUnit: Number(pricePerUnit),
      stock: Number(stock),
      stockQuantity: Number(stock),
      unit,
      lat: Number(lat),
      lng: Number(lng),
      visible,
      organic,
      tags,
      minOrder: Number(minOrder || 1),
      deliveryRadius: Number(deliveryRadius || 10),
      farmingMethod: farmingMethod ? String(farmingMethod).toLowerCase() : undefined,
      nutrients,
    };
  };

  const handleFileChange = (e) => {
    const f = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setFile(f);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const f =
      e.dataTransfer.files && e.dataTransfer.files[0] ? e.dataTransfer.files[0] : null;
    if (f && f.type.startsWith("image/")) {
      setFile(f);
    } else {
      toast.error("Please drop an image file");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = buildPayload();
      await onSubmit(payload, file);
    } catch (err) {
      console.error("submit product error", err);
      toast.error(err?.message || "Failed to submit product");
    }
  };

  const FormSection = ({ icon: Icon, title, children }) => (
    <div className="space-y-4 pb-6 border-b border-gray-200 last:border-0">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-green-100 rounded-lg shrink-0">
          <Icon size={20} className="text-green-700" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  );

  const FormField = ({ label, error, required, children }) => (
    <div className="w-full">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && (
        <div className="mt-2 flex items-center gap-2 text-red-600 text-sm shrink-0">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto "
    
    >
      <div className="space-y-6">
        {/* Basic Information */}
        <FormSection icon={Upload} title="Product Details">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Product Name" error={errors.title} required>
              <input
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: "" });
                }}
                placeholder="e.g., Fresh Organic Tomatoes"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.title ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
            </FormField>

            <FormField label="Category" required>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <FormField label="Description">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your product... farming methods, taste, benefits, etc."
              rows={4}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
            />
          </FormField>
        </FormSection>

        {/* Pricing & Stock */}
        <FormSection icon={Droplet} title=" Pricing & Inventory">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Price per Unit (₹)" error={errors.pricePerUnit} required>
              <div className="relative">
                <span className="absolute left-4 top-2.5 text-gray-600 font-medium pointer-events-none">
                  ₹
                </span>
                <input
                  value={pricePerUnit}
                  onChange={(e) => {
                    setPricePerUnit(e.target.value);
                    if (errors.pricePerUnit)
                      setErrors({ ...errors, pricePerUnit: "" });
                  }}
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  className={`w-full pl-8 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                    errors.pricePerUnit
                      ? "border-red-500 bg-red-50"
                      : "border-gray-300"
                  }`}
                />
              </div>
            </FormField>

            <FormField label="Unit">
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                {units.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            </FormField>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormField label="Current Stock" error={errors.stock} required>
              <input
                value={stock}
                onChange={(e) => {
                  setStock(e.target.value);
                  if (errors.stock) setErrors({ ...errors, stock: "" });
                }}
                type="number"
                min="0"
                placeholder="0"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.stock ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
            </FormField>

            <FormField label="Minimum Order">
              <input
                value={minOrder}
                onChange={(e) => setMinOrder(e.target.value)}
                type="number"
                min="1"
                placeholder="1"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </FormField>

            <FormField label="Delivery Radius (km)">
              <input
                value={deliveryRadius}
                onChange={(e) => setDeliveryRadius(e.target.value)}
                type="number"
                min="0"
                max="100"
                placeholder="10"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </FormField>
          </div>
        </FormSection>

        {/* Location */}
        <FormSection icon={MapPin} title=" Location">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Latitude" error={errors.location} required>
              <input
                value={lat}
                onChange={(e) => {
                  setLat(e.target.value);
                  if (errors.location) setErrors({ ...errors, location: "" });
                }}
                placeholder="e.g., 26.9124"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.location ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
            </FormField>

            <FormField label="Longitude" required>
              <input
                value={lng}
                onChange={(e) => {
                  setLng(e.target.value);
                  if (errors.location) setErrors({ ...errors, location: "" });
                }}
                placeholder="e.g., 91.7870"
                className={`w-full px-4 py-2.5 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition ${
                  errors.location ? "border-red-500 bg-red-50" : "border-gray-300"
                }`}
              />
            </FormField>
          </div>
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-2">
            <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-xs text-blue-700">
              Latitude: -90 to 90 | Longitude: -180 to 180
            </p>
          </div>
        </FormSection>

        {/* Farming & Nutrients */}
        <FormSection icon={Leaf} title=" Farming Information">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormField label="Farming Method">
              <select
                value={farmingMethod}
                onChange={(e) => setFarmingMethod(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="">Select method</option>
                {farmingMethods.map((m) => (
                  <option key={m} value={m.toLowerCase()}>
                    {m}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField label="Tags (comma separated)">
              <input
                value={tagsInput}
                onChange={(e) => setTagsInput(e.target.value)}
                placeholder="e.g., fresh, local, seasonal"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </FormField>
          </div>

          <FormField label="Nutrients (e.g., Calories:95,Protein:2.8,Fiber:1.2)">
            <input
              value={nutrientsInput}
              onChange={(e) => setNutrientsInput(e.target.value)}
              placeholder="Enter nutrient data as key:value pairs separated by commas"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </FormField>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition shrink-0">
              <input
                type="checkbox"
                checked={organic}
                onChange={(e) => setOrganic(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 shrink-0"
              />
              <span className="text-sm font-medium text-gray-700">
                 Certified Organic
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg transition shrink-0">
              <input
                type="checkbox"
                checked={visible}
                onChange={(e) => setVisible(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 shrink-0"
              />
              <span className="text-sm font-medium text-gray-700">
                Visible to Buyers
              </span>
            </label>
          </div>
        </FormSection>

        {/* Image Upload */}
        <FormSection icon={Upload} title=" Product Image">
          <div className="space-y-4">
            {/* Drag & Drop Area */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-8 text-center transition ${
                dragActive
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
              }`}
            >
              <Upload size={32} className="mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-medium text-gray-900 mb-1">
                Drag and drop your image here
              </p>
              <p className="text-xs text-gray-600 mb-3">or</p>
              <label className="inline-block">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <span className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 cursor-pointer transition inline-block">
                  Browse Files
                </span>
              </label>
              <p className="text-xs text-gray-600 mt-3">PNG, JPG, GIF up to 10MB</p>
            </div>

            {/* Preview */}
            {preview && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Preview</p>
                <div className="relative w-full max-w-xs mx-auto">
                  <img
                    src={preview}
                    alt="preview"
                    className="w-full h-48 object-cover rounded-lg border border-gray-200 shadow-md"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFile(null);
                      setPreview(null);
                    }}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition shrink-0"
                  >
                    <X size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </FormSection>

        {/* Form Actions */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition shrink-0"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg text-sm font-medium hover:from-green-700 hover:to-green-800 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shrink-0"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Saving...
              </>
            ) : (
              <>
                <CheckCircle size={16} />
                {submitLabel}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
