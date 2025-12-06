import NewUser from "@/components/users/NewUser";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <div>
        <NewUser />
      </div>
    </ProtectedRoute>
  );
}


