"use client";

import { Suspense } from "react";
import NewRate from "@/components/rates/NewRate";

export default function NewRatePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NewRate />
    </Suspense>
  );
}

