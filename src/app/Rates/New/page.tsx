"use client";

import { Suspense } from "react";
import NewRate from "@/components/rates/NewRate";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function NewRatePage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<div>Loading...</div>}>
        <NewRate />
      </Suspense>
    </ProtectedRoute>
  );
}

