import UploadFiles from "@/components/files/UploadFiles";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Home() {
  return (
    <ProtectedRoute>
      <div>
        <UploadFiles />
      </div>
    </ProtectedRoute>
  );
}
