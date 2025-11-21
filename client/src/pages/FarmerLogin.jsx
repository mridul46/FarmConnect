import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../Context/authContext";
import { useNavigate } from "react-router-dom";

export default function FarmerLogin() {
  const { loginWithEmail } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const user = await loginWithEmail(email, pass);

      if (user.role !== "farmer") {
        alert("This account is not registered as a Farmer!");
        return;
      }

      navigate("/farmer/dashboard");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-green-50">
      <div className="bg-white p-8 shadow-lg rounded-xl w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Farmer Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            className="w-full border p-3 rounded"
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full border p-3 rounded"
            onChange={(e) => setPass(e.target.value)}
          />

          <button className="w-full py-3 rounded-xl bg-green-600 text-white hover:bg-green-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
