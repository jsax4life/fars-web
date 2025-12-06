import ReversalKeyword from "@/components/reversalKeyword/ReversalKeyword";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ReversalKeywordPage() {
  return (
    <ProtectedRoute>
      <ReversalKeyword />
    </ProtectedRoute>
  );
}

