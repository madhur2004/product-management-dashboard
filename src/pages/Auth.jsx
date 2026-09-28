import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/ui/Button';

/**
 * Combined login / signup page.
 * The same component handles both routes and switches UI based on the URL path.
 */
export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, isLoggedIn, error, loading, clearAuthError } = useAuth();

  // Decide whether we're on login or signup based on the current route
  const isLogin = location.pathname === '/auth/login';

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Local copy of the error so we can clear it as the user types
  const [localError, setLocalError] = useState(null);

  // If already logged in, redirect away from the auth page
  useEffect(() => {
    if (isLoggedIn) {
      navigate('/products');
    }
  }, [isLoggedIn, navigate]);

  // Mirror any Redux auth error into local state for display
  useEffect(() => {
    if (error) {
      setLocalError(error);
    }
  }, [error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear any visible error as soon as the user starts typing again
    if (localError) setLocalError(null);
    clearAuthError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Route to the correct action based on the current page
    if (isLogin) {
      await login(formData.email, formData.password);
    } else {
      await signup(formData.email, formData.password, formData.confirmPassword);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-xl p-8 animate-fadeIn">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          {isLogin ? '🔐 Sign In' : '✨ Sign Up'}
        </h1>

        {/* Error banner — shown when validation or auth fails */}
        {(localError || error) && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 animate-slideDown">
            {localError || error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="you@example.com"
              required
            />
          </div>

          {/* Password field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Min 6 characters"
              required
            />
          </div>

          {/* Confirm password — only shown on the signup view */}
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                placeholder="Confirm your password"
                required
              />
            </div>
          )}

          {/* Submit — disabled while auth request is in flight */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Sign Up')}
          </Button>
        </form>

        {/* Bottom link — swaps between login and signup */}
        <p className="text-center mt-6 text-gray-600">
          {isLogin ? "Don't have account? " : 'Already have account? '}
          <a 
            href={isLogin ? '/auth/signup' : '/auth/login'}
            className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </a>
        </p>
      </div>
    </div>
  );
}