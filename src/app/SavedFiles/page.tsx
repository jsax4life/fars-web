import SavedFiles from "@/components/files/SavedFiles";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <SavedFiles />
      </div>
    </ProtectedRoute>
  );
}
