import { useState, useEffect } from 'react';

/**
 * Persist a piece of state to localStorage.
 * Behaves like useState but survives page refreshes.
 */
export const useLocalStorage = (key, initialValue) => {
  // Initial read — runs only once (lazy initializer)
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored JSON; fall back to the provided default
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // Malformed JSON or blocked storage — use default
      console.error('Error reading from localStorage:', error);
      return initialValue;
    }
  });

  // Update both React state and localStorage together
  const setValue = (value) => {
    try {
      // Support functional updates like useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error('Error writing to localStorage:', error);
    }
  };

  return [storedValue, setValue];
};