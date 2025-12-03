import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL?.replace(/\/+$/, "") || "";
axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [loadingProfile, setLoadingProfile] = useState(false);

  // ----------------------------------------------------
  // SAVE SESSION
  // ----------------------------------------------------
  const saveSession = (accessToken, userData, refreshToken = null) => {
    const userRole = userData.role;

    setToken(accessToken);
    setRole(userRole);
    setUser(userData);

    localStorage.setItem("token", accessToken);
    localStorage.setItem("role", userRole);
    localStorage.setItem("user", JSON.stringify(userData));

    if (refreshToken) {
      localStorage.setItem("refreshToken", refreshToken);
    }
  };

  // ----------------------------------------------------
  // ROUTE: GET ME
  // GET /api/v1/consumer/profile
  // ----------------------------------------------------
  const fetchProfile = async () => {
    if (!token) return;

    try {
      setLoadingProfile(true);

      const res = await axios.get("/api/v1/consumer/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profile = res.data.data;
      setUser(profile);
      setRole(profile.role);

      localStorage.setItem("user", JSON.stringify(profile));
      localStorage.setItem("role", profile.role);

      return profile;
    } catch (err) {
      console.error("Profile fetch failed:", err.response?.data?.message);

      if (err.response?.status === 401) {
        await logout();
      }
      return null;
    } finally {
      setLoadingProfile(false);
    }
  };

  // ----------------------------------------------------
  // AUTO FETCH USER ON PAGE REFRESH
  // ----------------------------------------------------
  useEffect(() => {
    if (token && !user) {
      fetchProfile();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  // ----------------------------------------------------
  // LOGIN (EMAIL + PASSWORD)
  // POST /api/v1/auth/login
  // ----------------------------------------------------
  const loginWithEmail = async (email, password) => {
    try {
      const res = await axios.post("/api/v1/auth/login", { email, password });

      const { accessToken, refreshToken, user } = res.data.data;
      saveSession(accessToken, user, refreshToken);
      return user;
    } catch (err) {
      throw err;
    }
  };

  // ----------------------------------------------------
  // REGISTER CONSUMER
  // POST /api/v1/auth/register/consumer
  // ----------------------------------------------------
  const registerConsumer = async (formData) => {
    try {
      const res = await axios.post("/api/v1/auth/register/consumer", formData);
      const { accessToken, refreshToken, user } = res.data.data;

      saveSession(accessToken, user, refreshToken);
      return res.data.data;
    } catch (err) {
      throw err;
    }
  };

  // ----------------------------------------------------
  // REGISTER FARMER
  // POST /api/v1/auth/register/farmer
  // ----------------------------------------------------
  const registerFarmer = async (formData) => {
    try {
      const res = await axios.post("/api/v1/auth/register/farmer", formData);
      const { accessToken, refreshToken, user } = res.data.data;
      saveSession(accessToken, user, refreshToken);
      return res.data.data;
    } catch (err) {
      throw err;
    }
  };
// ----------------------------------------------------
// UPDATE PROFILE
// PUT /api/v1/consumer/profile
// ----------------------------------------------------
const updateProfile = async (payload) => {
  if (!token) {
    throw new Error("Not authenticated");
  }

  // Detect if we're sending FormData (file + fields) or plain JSON
  const isFormData =
    typeof FormData !== "undefined" && payload instanceof FormData;

  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        // ❗ Don't set Content-Type for FormData – let axios/browser add boundary
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
      },
      withCredentials: true,
    };

    const res = await axios.put("/api/v1/consumer/profile", payload, config);

    const updatedUser = res.data?.data;
    if (!updatedUser) {
      return null;
    }

    // keep token, just update user
    saveSession(token, updatedUser);
    return updatedUser;
  } catch (err) {
    console.error(
      "Profile update failed:",
      err.response?.data || err.message
    );

    if (err.response?.status === 401) {
      await logout();
    }
    throw err;
  }
};

const updateFarmerProfile = async (payload) => {
  if (!token) throw new Error("Not authenticated");

  const isFormData =
    typeof FormData !== "undefined" && payload instanceof FormData;

  const url =
    user?.role === "farmer"
      ? "/api/v1/farmer/profile"
      : "/api/v1/consumer/profile";

  const res = await axios.put(url, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
    withCredentials: true,
  });

  const updatedUser = res.data?.data;
  if (!updatedUser) return null;

  saveSession(token, updatedUser);
  return updatedUser;
};

const getFarmerProfile = async (farmerId) => {
  if (!token) {
    throw new Error("Not authenticated");
  }

  // prefer explicit id, else current logged-in user id
  const id = farmerId || user?._id || user?.id;
  if (!id) {
    throw new Error("Farmer id missing");
  }

  try {
    const res = await axios.get(`/api/v1/farmer/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      withCredentials: true,
    });

    const data = res.data?.data; // { user, products, stats }

    // If backend returned a fresh user object, sync it into auth state
    if (data?.user) {
      saveSession(token, data.user);
    }

    return data; // caller gets { user, products, stats }
  } catch (err) {
    console.error(
      "getFarmerProfile failed:",
      err?.response?.data || err.message
    );

    if (err?.response?.status === 401) {
      await logout();
    }
    throw err;
  }
};

  // ----------------------------------------------------
  // LOGOUT
  // POST /api/v1/auth/logout
  // ----------------------------------------------------
  const logout = async () => {
    try {
      await axios.post(
        "/api/v1/auth/logout",
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (err) {
      console.log("Server logout error ignored:", err.message);
    }

    setToken("");
    setRole("");
    setUser(null);

    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        loginWithEmail,
        registerConsumer,
        registerFarmer,
        logout,
        saveSession,
        fetchProfile,
        loadingProfile,
        updateProfile,
        updateFarmerProfile,
        getFarmerProfile,

      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
