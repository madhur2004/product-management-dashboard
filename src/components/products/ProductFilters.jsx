import { Search, X } from 'lucide-react';

/**
 * Compact filter toolbar for product listings.
 * Contains search input, category filter, sort-by, order, result count,
 * and a "Clear all filters" action.
 *
 * All state is controlled by the parent — this component only fires callbacks.
 */
export default function ProductFilters({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  sortOrder,
  onOrderChange,
  resultCount,
  categories = ['All'], // derived from parent, defaults to just "All"
}) {
  // Track whether any filter differs from the defaults
  const hasActiveFilters =
    searchQuery ||
    (selectedCategory && selectedCategory !== 'All') ||
    sortBy !== 'name' ||
    sortOrder !== 'asc';

  // Reset every filter back to its default value
  const handleClearAll = () => {
    onSearchChange('');
    onCategoryChange('All');
    onSortChange('name');
    onOrderChange('asc');
  };

  // Shared class for all three select dropdowns (consistent look)
  const selectClass =
    'w-full h-10 pl-3 pr-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors appearance-none cursor-pointer';

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm p-4">
      {/* Top row: search (flex-1) + three selects (inline on desktop) */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        {/* Search input with icon and clear button */}
        <div className="relative flex-1 min-w-0">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search products by name, brand, or description..."
            aria-label="Search products"
            className="w-full h-10 pl-9 pr-9 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
          />
          {/* Clear button only appears when there's text */}
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              aria-label="Clear search"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-md text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* 3-column grid on mobile, inline row on desktop */}
        <div className="grid grid-cols-3 lg:flex lg:items-center gap-2">
          {/* Category filter */}
          <div className="relative lg:w-44">
            <label htmlFor="filter-category" className="sr-only">
              Category
            </label>
            <select
              id="filter-category"
              value={selectedCategory || 'All'}
              onChange={(e) => onCategoryChange(e.target.value)}
              className={selectClass}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
            {/* Custom dropdown arrow since native one is hidden via appearance-none */}
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              aria-hidden="true"
            >
              ▾
            </span>
          </div>

          {/* Sort-by field */}
          <div className="relative lg:w-40">
            <label htmlFor="filter-sort" className="sr-only">
              Sort by
            </label>
            <select
              id="filter-sort"
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              className={selectClass}
            >
              <option value="name">Name</option>
              <option value="price">Price</option>
              <option value="rating">Rating</option>
              <option value="stock">Stock</option>
            </select>
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              aria-hidden="true"
            >
              ▾
            </span>
          </div>

          {/* Order field (asc / desc) */}
          <div className="relative lg:w-36">
            <label htmlFor="filter-order" className="sr-only">
              Order
            </label>
            <select
              id="filter-order"
              value={sortOrder}
              onChange={(e) => onOrderChange(e.target.value)}
              className={selectClass}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
            <span
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"
              aria-hidden="true"
            >
              ▾
            </span>
          </div>
        </div>
      </div>

      {/* Bottom row: result count + clear-all */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {typeof resultCount === 'number' ? (
            <>
              <span className="font-semibold text-gray-900 dark:text-gray-100 tabular-nums">
                {resultCount}
              </span>{' '}
              {resultCount === 1 ? 'product' : 'products'}
              {/* "(filtered)" tag appears only when filters are active */}
              {hasActiveFilters && (
                <span className="text-gray-400 dark:text-gray-500">
                  {' '}
                  (filtered)
                </span>
              )}
            </>
          ) : (
            'Loading...'
          )}
        </p>

        {/* Only show clear button when needed */}
        {hasActiveFilters && (
          <button
            type="button"
            onClick={handleClearAll}
            className="text-xs font-medium text-primary hover:text-secondary transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    </div>
  );
}