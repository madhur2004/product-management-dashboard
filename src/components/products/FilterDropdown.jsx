import { useFilters } from '../../hooks/useFilters';
import { CATEGORIES } from '../../utils/constants';

/**
 * Category dropdown for the product listing.
 * Note: This component may be unused now — the newer ProductFilters
 * component handles search + category + sort in a single toolbar.
 */
export default function FilterDropdown() {
  const { updateCategory, selectedCategory } = useFilters();

  return (
    <div className="w-full">
      <label
        htmlFor="category-filter"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
         Category
      </label>
      <select
        id="category-filter"
        value={selectedCategory || 'All'}
        onChange={(e) =>
          // "All" maps to null internally so filters can treat it as no filter
          updateCategory(e.target.value === 'All' ? null : e.target.value)
        }
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white capitalize"
      >
        {CATEGORIES.map((category) => (
          <option key={category} value={category}>
            {category === 'All' ? 'All Categories' : category}
          </option>
        ))}
      </select>
    </div>
  );
}