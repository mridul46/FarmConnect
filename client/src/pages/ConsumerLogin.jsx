import React, { useState } from "react";
import { useAuth } from "../Context/authContext";

import { useNavigate } from "react-router-dom";

export default function ConsumerLogin() {
  const { loginWithEmail} = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const handleEmailLogin = async (e) => {
    e.preventDefault();

    try {
      const user = await loginWithEmail(email, pass);
      navigate("/consumer/dashboard");
    } catch (err) {}
  };


  return (
    <div className="h-screen flex items-center justify-center bg-blue-50">
      <div className="bg-white p-8 shadow-lg rounded-xl w-96">
        <h1 className="text-2xl font-bold mb-4 text-center">Consumer Login</h1>

        <p className="text-center text-gray-500 my-3">or</p>

        <form onSubmit={handleEmailLogin} className="space-y-4">
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

          <button className="w-full bg-blue-600 text-white py-3 rounded-xl hover:bg-blue-700">
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

