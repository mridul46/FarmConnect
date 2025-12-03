import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./Context/authContext";
import { Toaster } from "react-hot-toast";
import { ProductProvider } from "./Context/productsContext.jsx";

//  Add this - Force COOP policy in JavaScript
if (document.currentScript?.parentElement === document.head) {
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Cross-Origin-Opener-Policy';
  meta.content = 'same-origin-allow-popups';
  document.head.appendChild(meta);
}

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <App />
         <Toaster/>
        </ProductProvider>
      </AuthProvider>
  </BrowserRouter>
);