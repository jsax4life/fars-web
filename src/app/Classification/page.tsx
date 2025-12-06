import Classification from "@/components/classification/Classification";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <Classification />
      </div>
    </ProtectedRoute>
  );
}
