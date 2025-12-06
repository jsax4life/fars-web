import Dashboard from "@/components/dashboard/Dashboard";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <Dashboard />
      </div>
    </ProtectedRoute>
  );
}
