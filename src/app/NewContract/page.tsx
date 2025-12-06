import NewContract from "@/components/clients/NewContract";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <NewContract />
      </div>
    </ProtectedRoute>
  );
}
