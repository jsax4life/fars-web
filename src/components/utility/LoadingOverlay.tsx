"use client";
import { useApi } from "@/hooks/useApi";

const LoadingOverlay = () => {
  const { isFetching } = useApi();
  if (!isFetching) return null;
  return (
    <div className="fixed inset-0 z-[9999] pointer-events-none">
      <div className="absolute inset-0 bg-black/10" />
      <div className="absolute top-4 right-4 p-2 rounded bg-white shadow text-sm text-gray-700 flex items-center gap-2">
        <img src="/loader.gif" alt="Loading..." className="h-6 w-6" />
        <span>Loading...</span>
      </div>
    </div>
  );
};

export default LoadingOverlay;



