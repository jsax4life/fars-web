"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

const OTP: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const [otp, setOtp] = useState<string>("");
  const router = useRouter();
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, []);

  useEffect(() => {
    if (otp.length === 4) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        console.log("OTP Submitted:", otp);
        router.push("/NewPassword");
      }, 2000);
    }
  }, [otp, router]);

  const handleInputChange = (index: number, value: string) => {
    const numericValue = value.replace(/[^0-9]/g, "").slice(0, 1);
    const otpArray = otp.split("");

    otpArray[index] = numericValue;
    const newOtp = otpArray.join("");
    setOtp(newOtp);

    if (numericValue && index < 3 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      event.key === "Backspace" &&
      (!otp[index] || otp[index] === "") &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
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
        <h1 className="text-3xl sm:text-4xl font-bold text-white">
          Enter the 6-digit sent to olayimika@gmail.com
        </h1>
        <p className="mt-2 text-sm font-light sm:text-base text-[#f3f3f3]">
          Please enter the 4-digit OTP sent to your email address.
        </p>

        <div className="mt-8 space-y-4">
          <div className="flex space-x-2 justify-start">
            {[0, 1, 2, 3].map((index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-12 rounded-md bg-[#424242] placeholder-gray-400 text-lg text-white text-center outline-none focus:ring-2 focus:ring-[#F36F2E] focus:border-[#F36F2E]"
                value={otp[index] || ""}
                onChange={(e) => handleInputChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                ref={(el:any) => (inputRefs.current[index] = el)}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 text-left text-gray-400">
          Didn't receive the Code?{" "}
          <button className="text-[#F36F2E] hover:underline focus:outline-none">
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTP;
