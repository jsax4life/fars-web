import Account from "@/components/banks/Account";
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
