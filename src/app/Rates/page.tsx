import RatesList from "@/components/rates/RatesList";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <RatesList />
    </ProtectedRoute>
  );
}



