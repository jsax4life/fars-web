import AccountDetails from "@/components/account/AccountDetails";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <AccountDetails />
      </div>
    </ProtectedRoute>
  );
}
