import { createSlice } from '@reduxjs/toolkit';

// Restore the theme preference from localStorage so it survives refresh
const initialState = {
  isDarkMode: localStorage.getItem('darkMode') === 'true' || false,
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    // Flip between light and dark mode, and persist the new value
    toggleDarkMode: (state) => {
      state.isDarkMode = !state.isDarkMode;
      localStorage.setItem('darkMode', String(state.isDarkMode));
    },
    // Explicitly set the mode (used if we ever need to force a specific theme)
    setDarkMode: (state, action) => {
      state.isDarkMode = Boolean(action.payload);
      localStorage.setItem('darkMode', String(state.isDarkMode));
    },
  },
});

export const { toggleDarkMode, setDarkMode } = themeSlice.actions;
export default themeSlice.reducer;