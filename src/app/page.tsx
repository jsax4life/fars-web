'use client'
import Login from "@/components/auth/Login";
import { useUserAuth } from "@/hooks/useUserAuth";
import { useEffect, useState } from "react";
import UserList from "@/components/users/UserList";

export default function Home() {
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useUserAuth()

  useEffect(() => {
    const timeOut = setTimeout(() => {
      setLoading(false);
    }, 2000); // Simulate a loading delay of 3 seconds
    return () => clearTimeout(timeOut); // Cleanup timeout on unmount
  }, []);

  return (
    <div>
      {loading ? (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#2E2D2D] to-[#2E2D2D]/90">
          <img src="/loader.gif" alt="Loading..." className="h-20 w-20" />
        </div>
      ) : isAuthenticated ? <UserList /> : <Login />}
    </div>
  );
}
