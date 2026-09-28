import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Wraps protected routes — redirects to login if user is not authenticated.
 * While auth state is loading, shows a simple loader to avoid a flash redirect.
 */
export default function ProtectedRoute({ children }) {
  const { isLoggedIn, loading } = useAuth();

  // Wait for auth check to finish before deciding
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  // Not logged in → send to login page (replace so back button doesn't loop)
  if (!isLoggedIn) {
    return <Navigate to="/auth/login" replace />;
  }

  // Authenticated → render the protected page
  return children;
}