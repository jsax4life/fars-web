import UserList from "@/components/users/UserList";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <UserList />
      </div>
    </ProtectedRoute>
  );
}
