import { useState, useEffect } from 'react';

/**
 * Returns a debounced copy of `value` that only updates after
 * the given delay has passed without any new changes.
 * Useful for search inputs to avoid firing on every keystroke.
 */
export const useDebounce = (value, delay = 500) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Schedule an update after the delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // If value changes before the delay finishes, cancel the timer
    // and start over — that's what makes it "debounced"
    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
};