import React from "react";
import { Navigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

interface ProtectedAuthRouteProps {
  children: React.ReactNode;
}

const ProtectedAuthRoute: React.FC<ProtectedAuthRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="mb-4 inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If user is already authenticated, redirect to dashboard
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // If not authenticated, show the auth page
  return <>{children}</>;
};

export default ProtectedAuthRoute;
