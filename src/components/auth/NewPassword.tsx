"use client";

import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUserAuth } from "@/hooks/useUserAuth";

const NewPassword = () => {
  const {resetPassword} = useUserAuth()
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const response = await resetPassword(password, token!);
      if (response) {
        setLoading(false);
        router.replace("/");
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.error("Error resetting password:", error);
    }
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

      <div className="absolute inset-0 z-0 bg-[url('/bg.svg')] bg-cover bg-no-repeat opacity-100"></div>

      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#2E2D2D]/90 to-[#2E2D2D]/50"></div>


      <div className="relative z-20 w-full max-w-md">
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Set New Password</h1>
        <p className="mt-2 text-sm font-light sm:text-base text-gray-200">
          Create a strong new password for your account.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>

            <input
              type="password"
              id="password"
              required
              className="mt-1 w-full px-4 py-2 rounded-md bg-[#424242] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#F36F2E] focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>

          <div>

            <input
              type="password"
              id="confirmPassword"
              required
              className="mt-1 w-full px-4 py-2 rounded-md bg-[#424242] text-white placeholder-gray-400 focus:ring-2 focus:ring-[#F36F2E] focus:outline-none"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter password"
            />
          </div>

          <button
            type="submit"
            className="md:w-[20%] w-full py-2 rounded-md bg-[#F36F2E] text-black font-bold hover:bg-[#F36F2E]/90 focus:ring-2 focus:ring-offset-2 focus:ring-[#F36F2E]"
          >
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewPassword;
