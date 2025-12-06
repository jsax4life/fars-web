import RateDetails from "@/components/rates/RateDetails";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function Page() {
  return (
    <ProtectedRoute>
      <RateDetails />
    </ProtectedRoute>
  );
}



