import Account from "@/components/clients/Account";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <Account />
      </div>
    </ProtectedRoute>
  );
}
