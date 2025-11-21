import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./Context/authContext";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { Toaster } from "react-hot-toast";

// 🔥 Add this - Force COOP policy in JavaScript
if (document.currentScript?.parentElement === document.head) {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Cross-Origin-Opener-Policy';
  meta.content = 'same-origin-allow-popups';
  document.head.appendChild(meta);
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <App />
        <Toaster/>
      </AuthProvider>
    </GoogleOAuthProvider>
  </BrowserRouter>
);