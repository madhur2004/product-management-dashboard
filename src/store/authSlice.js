import { createSlice } from '@reduxjs/toolkit';

// Restore auth state from localStorage on app load so the user stays logged in across refreshes
const initialState = {
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true' || false,
  user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Called when login/signup starts — show loading, clear previous errors
    loginStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    // Called when credentials are valid — save user and persist to localStorage
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.user = action.payload;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(action.payload));
    },
    // Called when validation or auth fails — store the error message
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Clear the session and remove persisted auth data
    logout: (state) => {
      state.isLoggedIn = false;
      state.user = null;
      state.error = null;
      localStorage.removeItem('isLoggedIn');
      localStorage.removeItem('user');
    },
    // Clear only the error message (used when the user starts typing again)
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { loginStart, loginSuccess, loginFailure, logout, clearError } = authSlice.actions;
export default authSlice.reducer;