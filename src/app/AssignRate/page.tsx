import { Suspense } from "react";
import AssignRate from "@/components/accounts/AssignRate";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <Suspense fallback={
        <div className="flex min-h-screen items-center justify-center">
          <p className="text-gray-500">Loading...</p>
        </div>
      }>
        <AssignRate />
      </Suspense>
    </ProtectedRoute>
  );
}

