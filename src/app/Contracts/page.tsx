import Contracts from "@/components/account/Contracts";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <Contracts />
      </div>
    </ProtectedRoute>
  );
}
