"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter from next/navigation
import { useUserAuth } from "@/hooks/useUserAuth";

const ForgotPassword = () => {
  const { forgetPassword } = useUserAuth()
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const router = useRouter(); // Initialize the router

  const handleLogin = (e: any) => {
    e.preventDefault();
    router.push("/"); // Use router.push to navigate
  };

  const handleSubmit = (e: any) => {
    e.preventDefault();
    setLoading(true);
    forgetPassword(email).then((response) => {
      if (response) {
        setLoading(false);
        //send email to otp page
        router.push(`/OTP?email=${encodeURIComponent(email)}`);
      } else {
        setLoading(false);
      }
    })
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white">Forget Password</h1>
        <p className="mt-2 text-sm font-light sm:text-base text-gray-200">
          Lorem ipsum dolor sit amet consectetur. Tellus pulvinar cras sed posuere duis.Velit euismod quis sed ut quis.
        </p>

        <form className="mt-8 space-y-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email Address"
            className="w-full px-4 py-2 rounded-md bg-[#424242] placeholder-gray-400 text-sm text-white outline-none focus:ring-2 focus:ring-[#F36F2E] focus:border-[#F36F2E]"
            required
          />
          <div className="text-left flex flex-row gap-[8px]">
            <div
              className="text-sm font-medium text-[#F3f3f3] hover:underline"> Remember Password?,</div>
            <button
              type="button"
              onClick={handleLogin}
              className="text-sm font-medium text-[#F36F2E] hover:underline"
            >
              Login
            </button>
          </div>
          <button
            type="submit"
            onClick={handleSubmit}
            className="md:w-[20%] w-full py-2 rounded-md bg-[#F36F2E] text-black font-bold hover:bg-[#F36F2E]/90 focus:ring-2 focus:ring-offset-2 focus:ring-[#F36F2E]"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
