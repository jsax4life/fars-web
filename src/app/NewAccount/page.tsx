import { Suspense } from "react";
import NewAccount from "@/components/account/NewAccount";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      }>
        <NewAccount />
      </Suspense>
    </ProtectedRoute>
  );
}
