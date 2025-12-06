import RoleList from "@/components/users/RoleList";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <RoleList />
      </div>
    </ProtectedRoute>
  );
}
