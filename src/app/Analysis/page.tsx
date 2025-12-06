import Analysis from "@/components/analysis/Analysis";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <Analysis />
      </div>
    </ProtectedRoute>
  );
}
