import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "@/hooks/useAuth";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { loading, user } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0F1110] p-4 text-sm text-[#8B9388]">
        Memeriksa sesi login...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return children;
}
