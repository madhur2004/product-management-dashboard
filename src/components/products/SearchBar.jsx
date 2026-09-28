import { useState, useEffect } from 'react';
import { useFilters } from '../../hooks/useFilters';
import { useDebounce } from '../../hooks/useDebounce';

/**
 * Standalone search bar with debounced input.
 * Note: The newer ProductFilters component now handles search + filters
 * in a single toolbar, so this may be unused. Kept for backward compatibility.
 */
export default function SearchBar() {
  const { updateSearchQuery, searchQuery } = useFilters();

  // Local input state — lets the user type without triggering a filter on every keystroke
  const [input, setInput] = useState(searchQuery);

  // Debounced copy of the input — only updates after 300ms of no typing
  const debouncedValue = useDebounce(input, 300);

  // If searchQuery is changed externally (reset filters, URL change, etc.),
  // sync it back into the local input
  useEffect(() => {
    setInput(searchQuery);
  }, [searchQuery]);

  // Push the debounced value to the filters store so listings update
  useEffect(() => {
    updateSearchQuery(debouncedValue);
  }, [debouncedValue, updateSearchQuery]);

  return (
    <div className="w-full">
      <label
        htmlFor="search"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        🔍 Search Products
      </label>
      <input
        id="search"
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Search by name, brand, or description..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
        // Avoid browser autocomplete overlay interfering with the search UX
        autoComplete="off"
      />
    </div>
  );
}