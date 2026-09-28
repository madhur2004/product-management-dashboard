import { useDispatch, useSelector } from 'react-redux';
import { loginStart, loginSuccess, loginFailure, logout, clearError } from '../store/authSlice';

/**
 * Authentication hook — handles login, signup, logout, and error clearing.
 * Auth is mock/local only: no real backend, credentials are validated
 * and then "logged in" after a short simulated delay.
 */
export const useAuth = () => {
  const dispatch = useDispatch();
  const { isLoggedIn, user, loading, error } = useSelector((state) => state.auth);

  /** Validate credentials and simulate a login request. */
  const login = async (email, password) => {
    dispatch(loginStart());

    // Basic field presence check
    if (!email || !password) {
      dispatch(loginFailure('Email and password required'));
      return false;
    }

    // Very light email format check — just requires an "@"
    if (!email.includes('@')) {
      dispatch(loginFailure('Invalid email format'));
      return false;
    }

    // Minimum password length
    if (password.length < 6) {
      dispatch(loginFailure('Password must be at least 6 characters'));
      return false;
    }

    // Simulate network delay, then mark the user as logged in.
    // Derive a display name from the email prefix.
    setTimeout(() => {
      dispatch(loginSuccess({
        email,
        name: email.split('@')[0],
      }));
    }, 500);

    return true;
  };

  /** Validate signup inputs and simulate account creation. */
  const signup = async (email, password, confirmPassword) => {
    dispatch(loginStart());

    // All three fields are required
    if (!email || !password || !confirmPassword) {
      dispatch(loginFailure('All fields required'));
      return false;
    }

    // Passwords must match
    if (password !== confirmPassword) {
      dispatch(loginFailure('Passwords do not match'));
      return false;
    }

    // Minimum password length
    if (password.length < 6) {
      dispatch(loginFailure('Password must be at least 6 characters'));
      return false;
    }

    // Very light email format check
    if (!email.includes('@')) {
      dispatch(loginFailure('Invalid email format'));
      return false;
    }

    // Simulate network delay, then auto-login the new user
    setTimeout(() => {
      dispatch(loginSuccess({
        email,
        name: email.split('@')[0],
      }));
    }, 500);

    return true;
  };

  /** Clear the current session. */
  const signout = () => {
    dispatch(logout());
  };

  /** Reset any lingering auth error message. */
  const clearAuthError = () => {
    dispatch(clearError());
  };

  return {
    isLoggedIn,
    user,
    loading,
    error,
    login,
    signup,
    signout,
    clearAuthError,
  };
};