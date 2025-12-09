"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setStatus("Checking...");

    try {
      const res = await fetch("https://BackendBadminton.pythonanywhere.com/api/auth/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus(data.error || "❌ Login failed");
        return;
      }

      // Save token
      localStorage.setItem("admin_token", data.token);

      // Show success before redirect
      setStatus("✅ Login successful!");

      // Redirect to admin dashboard
      setTimeout(() => {
        router.push("/admin-login/dashboard");
      }, 800);
      
    } catch (error) {
      setStatus("❌ Network error: " + error.message);
    }
  }

  return (
    <div className="h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-sm font-semibold">Username</label>
            <input
              type="text"
              className="w-full mt-1 p-2 border rounded"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="text-sm font-semibold">Password</label>
            <input
              type="password"
              className="w-full mt-1 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
          >
            Login
          </button>

          {status && (
            <p className="text-center text-sm mt-2">
              {status.startsWith("❌") ? (
                <span className="text-red-600">{status}</span>
              ) : (
                <span className="text-green-600">{status}</span>
              )}
            </p>
          )}
        </form>
      </div>
    </div>
  );
}
