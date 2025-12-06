"use client";
import AccountDetails from "@/components/account/AccountDetails";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <div>
        <AccountDetails />
      </div>
    </ProtectedRoute>
  );
}



