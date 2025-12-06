import ClientList from "@/components/clients/ClientList";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <ClientList />
      </div>
    </ProtectedRoute>
  );
}
