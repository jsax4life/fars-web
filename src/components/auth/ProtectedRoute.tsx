'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUserAuth } from '@/hooks/useUserAuth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute component that ensures only authenticated users can access the wrapped content.
 * If the user is not authenticated, they will be redirected to the login page.
 */
export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useUserAuth();
  const router = useRouter();

  useEffect(() => {
    // Wait for auth state to load before checking
    if (!isLoading && !isAuthenticated) {
      // Clear any stale data
      localStorage.removeItem('user');
      localStorage.removeItem('authTokenFaRs');
      
      // Redirect to login page
      router.push('/');
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="absolute inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-[#2E2D2D] to-[#2E2D2D]/90">
        <img src="/loader.gif" alt="Loading..." className="h-20 w-20" />
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // User is authenticated, render the protected content
  return <>{children}</>;
}

