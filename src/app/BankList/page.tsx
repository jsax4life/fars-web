import BankList from "@/components/banks/BankList";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <BankList />
      </div>
    </ProtectedRoute>
  );
}
