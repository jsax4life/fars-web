import ClassificationPattern from "@/components/classificationPattern/ClassificationPattern";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ClassificationPatternPage() {
  return (
    <ProtectedRoute>
      <ClassificationPattern />
    </ProtectedRoute>
  );
}

