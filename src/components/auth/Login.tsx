"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleForgotPassword = (e: any) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/ForgotPassword");
    }, 3000);
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setTimeout(() => {
      setLoading(false);
      router.push("/AccountTable");
    }, 3000);
    console.log("Login submitted with:", { email, password });
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8">
      {/* Logo at top left */}
      <div className="absolute top-6 left-6 z-20">
        <img src="/logo.svg" alt="Company Logo" className="h-20 w-auto" />
      </div>

      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#2E2D2D] to-[#2E2D2D]/90">
          <img src="/loader.gif" alt="Loading..." className="h-20 w-20" />
        </div>
      )}

      {/* Updated background with SVG pattern */}
      <div className="absolute inset-0 z-0 bg-[url('/bg.svg')] bg-cover bg-no-repeat opacity-100"></div>

      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#2E2D2D]/90 to-[#2E2D2D]/50"></div>


      <div className="relative z-20 w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Login</h1>
        <p className="mt-2 text-sm sm:text-base font-light text-[#f3f3f3]">
          t amet consectetur. tellus pulvinar con sed posuere duis. Velit euismod quis quid ut quis.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 rounded-md bg-[#424242] placeholder-gray-400 text-sm text-white outline-none focus:ring-2 focus:ring-[#F36F2E] focus:border-[#F36F2E]"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-2 rounded-md bg-[#424242] placeholder-gray-400 text-sm text-white outline-none focus:ring-2 focus:ring-[#F36F2E] focus:border-[#F36F2E]"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="text-left">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-sm font-medium text-[#F36F2E] hover:underline"
            >
              Forgot password?
            </button>
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            className="w-full py-2 rounded-md bg-[#F36F2E] text-black font-bold hover:bg-[#F36F2E]/90 focus:ring-2 focus:ring-offset-2 focus:ring-[#F36F2E]"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;