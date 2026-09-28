import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import { toggleDarkMode, setDarkMode } from '../store/themeSlice';

/**
 * Theme hook — reads dark mode state from Redux and applies it to
 * the `<html>` element so Tailwind's `dark:` variants work.
 */
export const useTheme = () => {
  const dispatch = useDispatch();
  const isDarkMode = useSelector((state) => state.theme.isDarkMode);

  // Add/remove the `dark` class on <html> whenever dark mode changes.
  // This is what drives every Tailwind `dark:` style in the app.
  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Flip between light and dark
  const toggle = useCallback(() => dispatch(toggleDarkMode()), [dispatch]);

  // Explicitly set a specific mode (light / dark)
  const setMode = useCallback(
    (isDark) => dispatch(setDarkMode(isDark)),
    [dispatch]
  );

  return { isDarkMode, toggle, setMode };
};