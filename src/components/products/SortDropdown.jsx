import { useFilters } from '../../hooks/useFilters';
import { SORT_OPTIONS } from '../../utils/constants';

/**
 * Sort controls — sort field and sort order.
 * Note: The newer ProductFilters toolbar now covers this functionality,
 * so this component may be unused. Kept for backward compatibility.
 */
export default function SortDropdown() {
  const { updateSortBy, updateSortOrder, sortBy, sortOrder } = useFilters();

  return (
    // Two columns on tablet+, single column on mobile
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Sort field — name, price, rating, etc. */}
      <div>
        <label
          htmlFor="sort-by"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          ⬇️ Sort By
        </label>
        <select
          id="sort-by"
          value={sortBy}
          onChange={(e) => updateSortBy(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort order — ascending or descending */}
      <div>
        <label
          htmlFor="sort-order"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          🔄 Order
        </label>
        <select
          id="sort-order"
          value={sortOrder}
          onChange={(e) => updateSortOrder(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all bg-white"
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}