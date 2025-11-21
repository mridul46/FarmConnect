import React, { createContext, useContext, useState } from "react";
import axios from "axios";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

axios.defaults.baseURL = backendUrl;
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [role, setRole] = useState(localStorage.getItem("role") || "");
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );

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
  // LOGIN (EMAIL + PASSWORD)
  // POST /api/v1/auth/login
  // ----------------------------------------------------
  const loginWithEmail = async (email, password) => {
    try {
      const res = await axios.post("api/v1/auth/login", { email, password });

      const { accessToken, refreshToken, user } = res.data.data;
      localStorage.setItem("token", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
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
      const res = await axios.post("api/v1/auth/register/consumer", formData);
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
      const res = await axios.post("api/v1/auth/register/farmer", formData);
      const { accessToken, refreshToken, user } = res.data.data;
      saveSession(accessToken, user, refreshToken);
      return res.data.data;
    } catch (err) {
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
        "api/v1/auth/logout",
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
