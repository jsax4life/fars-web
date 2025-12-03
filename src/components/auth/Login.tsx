"use client";
import { toast } from 'sonner';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useUserAuth } from "@/hooks/useUserAuth";

const Login = () => {
  const { login } = useUserAuth()
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const router = useRouter();

  const handleForgotPassword = (e: any) => {
    e.preventDefault();
    router.push("/ForgotPassword");
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (loading) return; // prevent double submission
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    // Password non-empty check
    if (password.trim().length < 8) {
      toast.error("Password must be at least 8 characters.");
      return;
    }
    setLoading(true);
    // Call the login function from useUserAuth
    login(email, password)
      .then((response) => {
        if (response === "success") {
          // Optionally persist email for convenience (not tokens)
          if (remember) localStorage.setItem("fars_last_email", email);
          router.push("/UserList");
        }
      })
      .finally(() => setLoading(false));
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
          Sign in to your account to access the dashboard and manage your clients.
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
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full px-4 py-2 pr-10 rounded-md bg-[#424242] placeholder-gray-400 text-sm text-white outline-none focus:ring-2 focus:ring-[#F36F2E] focus:border-[#F36F2E]"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-label="Password"
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              onClick={() => setShowPassword((s) => !s)}
              className="absolute inset-y-0 right-0 px-3 text-gray-300 hover:text-white"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>

          <label className="flex items-center gap-2 text-xs text-gray-300">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) => setRemember(e.target.checked)}
              className="h-4 w-4"
            />
            Remember email on this device
          </label>

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
            disabled={loading}
            className="w-full py-2 rounded-md bg-[#F36F2E] text-black font-bold hover:bg-[#F36F2E]/90 focus:ring-2 focus:ring-offset-2 focus:ring-[#F36F2E] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
