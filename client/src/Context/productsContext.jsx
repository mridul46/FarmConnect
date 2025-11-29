// src/context/ProductContext.jsx
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState
} from "react";
import axios from "axios";
import { useAuth } from "./authContext"; 

const ProductContext = createContext(null);

// keys
const CART_KEY = "farmconnect_cart_v1";
const ADDED_IDS_KEY = "farmconnect_addedIds_v1";

// axios instance with base URL from env (same pattern as your auth context)
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL  + "/api/v1";
const api = axios.create({
  baseURL: BACKEND_URL,
  withCredentials: true // keep cookies behavior same as AuthContext
});

export const ProductProvider = ({ children }) => {
  // get token/user from AuthContext (do NOT read localStorage directly)
  const { token } = useAuth();

  // attach token to axios instance whenever it changes
  useEffect(() => {
    if (token) {
      api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common.Authorization;
    }
  }, [token]);

  // PRODUCTS
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(false);
  const [productsError, setProductsError] = useState(null);

  // CART (items: { _id, qty, product? })
  const [cartItems, setCartItems] = useState(() => {
    try {
      const raw = localStorage.getItem(CART_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });
  const [addedProductIds, setAddedProductIds] = useState(() => {
    try {
      const raw = localStorage.getItem(ADDED_IDS_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // ORDERS (user)
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  // NOTIFICATIONS (in-memory)
  const [notifications, setNotifications] = useState([]);

  // persist cart and added ids
  useEffect(() => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cartItems));
    } catch (e) {
      console.error("Failed to persist cart", e);
    }
  }, [cartItems]);

  useEffect(() => {
    try {
      localStorage.setItem(ADDED_IDS_KEY, JSON.stringify(addedProductIds));
    } catch (e) {
      console.error("Failed to persist added ids", e);
    }
  }, [addedProductIds]);

  // -------------------------
  // Products API
  // -------------------------
const fetchProducts = useCallback(
  async (queryString = "") => {
    setProductsLoading(true);
    setProductsError(null);

    try {
      const url = queryString ? `/products?${queryString}` : `/products`;
      const res = await api.get(url);

      // controller returns { success, count, data } where data is array
      let data = Array.isArray(res.data?.data) ? res.data.data : res.data;

      // NORMALIZE each product to ensure rating is a primitive for UI
      data = (data || []).map((p) => {
        // possible shapes:
        // p.rating === number OR p.rating === { average, count } OR p.rating === { avg, total }
        let ratingAverage = null;
        let ratingCount = null;

        if (p != null) {
          if (typeof p.rating === "number") {
            ratingAverage = p.rating;
            ratingCount = p.reviews ?? null;
          } else if (p.rating && typeof p.rating === "object") {
            ratingAverage = p.rating.average ?? p.rating.avg ?? p.rating.mean ?? null;
            ratingCount = p.rating.count ?? p.rating.total ?? p.reviews ?? null;
          } else {
            // fallback to existing fields
            ratingAverage = p.displayRating ?? p.rating ?? null;
            ratingCount = p.reviews ?? p.ratingCount ?? null;
          }
        }

        return {
          ...p,
          ratingAverage: ratingAverage != null ? ratingAverage : null,
          ratingCount: ratingCount != null ? ratingCount : 0
        };
      });

      setAllProducts(data);
      return data;
    } catch (err) {
      setProductsError(err?.response?.data?.message || err.message);
      setAllProducts([]);
      throw err;
    } finally {
      setProductsLoading(false);
    }
  },
  []
);


const fetchProductById = useCallback(async (id) => {
  if (!id) return null;
  try {
    const res = await api.get(`/products/${encodeURIComponent(id)}`);
    const p = res.data?.data || null;
    if (!p) return null;

    // Normalize rating object -> primitives
    let ratingAverage = null;
    let ratingCount = null;

    if (typeof p.rating === "number") {
      ratingAverage = p.rating;
      ratingCount = p.reviews ?? null;
    } else if (p.rating && typeof p.rating === "object") {
      ratingAverage = p.rating.average ?? p.rating.avg ?? p.rating.mean ?? null;
      ratingCount = p.rating.count ?? p.rating.total ?? p.reviews ?? null;
    } else {
      ratingAverage = p.displayRating ?? p.rating ?? null;
      ratingCount = p.reviews ?? p.ratingCount ?? null;
    }

    return {
      ...p,
      ratingAverage: ratingAverage != null ? ratingAverage : null,
      ratingCount: ratingCount != null ? ratingCount : 0
    };
  } catch (err) {
    console.error("fetchProductById error:", err?.response?.data || err.message);
    throw err;
  }
}, []);


  const fetchNearbyProducts = useCallback(async ({ lat, lng, radius = 10, category } = {}) => {
    if (lat == null || lng == null) throw new Error("lat and lng required");
    const params = new URLSearchParams();
    params.set("lat", String(lat));
    params.set("lng", String(lng));
    params.set("radius", String(radius));
    if (category) params.set("category", category);
    try {
      const res = await api.get(`/products/nearby?${params.toString()}`);
      return res.data?.data || [];
    } catch (err) {
      console.error("fetchNearbyProducts error:", err?.response?.data || err.message);
      throw err;
    }
  }, []);

  // initial load
  useEffect(() => {
    fetchProducts().catch(() => {});
  }, [fetchProducts]);

  // -------------------------
  // Cart helpers
  // -------------------------
  const addToCart = useCallback(
    async (productOrId, quantity = 1) => {
      const id = typeof productOrId === "string" ? productOrId : productOrId?._id || productOrId?.id;
      if (!id) return false;

      // try to find metadata from allProducts or fetch single
      let productMeta = allProducts.find((p) => String(p._id) === String(id)) || null;
      if (!productMeta && typeof productOrId === "object") productMeta = productOrId;

      // If still no meta, try fetching
      if (!productMeta) {
        try {
          productMeta = await fetchProductById(id);
        } catch {
          productMeta = null;
        }
      }

      setCartItems((prev) => {
        const idx = prev.findIndex((i) => String(i._id) === String(id));
        if (idx >= 0) {
          const next = [...prev];
          next[idx] = { ...next[idx], qty: (next[idx].qty || 0) + quantity, product: next[idx].product || productMeta };
          return next;
        }
        return [...prev, { _id: id, qty: quantity, product: productMeta }];
      });

      setAddedProductIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
      return true;
    },
    [allProducts, fetchProductById]
  );

  const removeFromCart = useCallback((productId) => {
    setCartItems((prev) => prev.filter((i) => String(i._id) !== String(productId)));
    setAddedProductIds((prev) => prev.filter((id) => String(id) !== String(productId)));
  }, []);

  const updateCartQuantity = useCallback((productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prev) => prev.map((i) => (String(i._id) === String(productId) ? { ...i, qty } : i)));
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    setCartItems([]);
    setAddedProductIds([]);
  }, []);

  // -------------------------
  // Orders
  // -------------------------
  const createOrder = useCallback(async ({ items, deliveryAddress, paymentProvider = "razorpay", notes } = {}) => {
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error("Order must include items");
    }
    const res = await api.post(`/orders`, { items, deliveryAddress, paymentProvider, notes });
    return res.data?.data || res.data;
  }, []);

  const getUserOrders = useCallback(async (queryString = "") => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const url = queryString ? `/orders?${queryString}` : `/orders`;
      const res = await api.get(url);
      const data = res.data?.data || [];
      setOrders(Array.isArray(data) ? data : []);
      return data;
    } catch (err) {
      setOrdersError(err?.response?.data?.message || err.message || String(err));
      setOrders([]);
      throw err;
    } finally {
      setOrdersLoading(false);
    }
  }, []);

  const getOrderById = useCallback(async (orderId) => {
    const res = await api.get(`/orders/${encodeURIComponent(orderId)}`);
    return res.data?.data || res.data;
  }, []);

  const updateOrderStatus = useCallback(async (orderId, status) => {
    const res = await api.patch(`/orders/${encodeURIComponent(orderId)}/status`, { status });
    return res.data?.data || res.data;
  }, []);

  const cancelOrder = useCallback(async (orderId, reason = "") => {
    const res = await api.post(`/orders/${encodeURIComponent(orderId)}/cancel`, { reason });
    return res.data?.data || res.data;
  }, []);

  const getFarmerOrders = useCallback(async (queryString = "") => {
    const url = queryString ? `/orders/farmer/dashboard?${queryString}` : `/orders/farmer/dashboard`;
    const res = await api.get(url);
    return res.data?.data || res.data;
  }, []);

  const getOrderStats = useCallback(async () => {
    const res = await api.get(`/orders/me/stats`);
    return res.data?.data || res.data;
  }, []);

  const getAllOrders = useCallback(async (queryString = "") => {
    const url = queryString ? `/orders/admin/all?${queryString}` : `/orders/admin/all`;
    const res = await api.get(url);
    return res.data?.data || res.data;
  }, []);

  const getPlatformOrderStats = useCallback(async () => {
    const res = await api.get(`/orders/admin/stats`);
    return res.data?.data || res.data;
  }, []);

  // -------------------------
  // Notifications
  // -------------------------
  const addNotification = useCallback((message, type = "success", duration = 3000) => {
    const id = Date.now() + Math.random();
    setNotifications((prev) => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), duration);
    }
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // -------------------------
  // Derived values
  // -------------------------
  const cartCount = useMemo(() => addedProductIds.length, [addedProductIds]);
  const totalItems = useMemo(() => cartItems.reduce((s, i) => s + (i.qty || 0), 0), [cartItems]);
  const cartSummary = useMemo(() => {
    const subtotal = cartItems.reduce((s, i) => s + ((i.product?.pricePerUnit ?? i.pricePerUnit ?? 0) * (i.qty || 0)), 0);
    const delivery = subtotal > 0 ? 50 : 0;
    const discount = Math.floor(subtotal * 0.05);
    const total = subtotal + delivery - discount;
    return { subtotal, delivery, discount, total };
  }, [cartItems]);

  // refresh helpers
  const refreshProducts = useCallback(() => fetchProducts(), [fetchProducts]);
  const refreshOrders = useCallback((q) => getUserOrders(q), [getUserOrders]);

  // context value
  const value = {
    // products
    allProducts,
    productsLoading,
    productsError,
    fetchProducts,
    fetchProductById,
    fetchNearbyProducts,
    refreshProducts,
    getProductById: (id) => allProducts.find((p) => String(p._id) === String(id)) || null,

    // cart
    cartItems,
    addedProductIds,
    cartCount,
    totalItems,
    cartSummary,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,

    // orders
    orders,
    ordersLoading,
    ordersError,
    refreshOrders,
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getFarmerOrders,
    getOrderStats,
    getAllOrders,
    getPlatformOrderStats,

    // notifications
    notifications,
    addNotification,
    removeNotification
  };

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
};

// Hook
export const useProductContext = () => {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProductContext must be used within ProductProvider");
  return ctx;
};

export default ProductContext;
