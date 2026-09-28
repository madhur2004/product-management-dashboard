import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../hooks/useWishlist';
import { useNotification } from '../hooks/useNotification';
import ProductCard from '../components/products/ProductCard';
import ProductTable from '../components/products/ProductTable';
import ProductFilters from '../components/products/ProductFilters';
import LayoutToggle from '../components/products/LayoutToggle';
import Button from '../components/ui/Button';
import EmptyState from '../components/states/EmptyState';
import {
  filterProducts,
  sortProducts,
  filterByCategory,
} from '../utils/helpers';

/**
 * Wishlist page — shows all saved products with the same
 * search, filter, sort, and layout options as the main listing.
 */
export default function WishlistPage() {
  const { items, removeFromWish } = useWishlist();
  const { success } = useNotification();

  // Local filter state — kept on the page since it's only used here
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [layoutView, setLayoutView] = useState('card');

  // Build the category dropdown from wishlist items only —
  // ensures every option has at least one matching product
  const availableCategories = useMemo(() => {
    const set = new Set(
      items
        .map((p) => (p.category ? String(p.category).trim() : ''))
        .filter(Boolean)
    );
    const sorted = Array.from(set).sort((a, b) =>
      a.localeCompare(b, undefined, { sensitivity: 'base' })
    );
    return ['All', ...sorted];
  }, [items]);

  // Apply category filter, search filter, and sort in that order
  const filteredItems = useMemo(() => {
    let result = [...items];
    result = filterByCategory(result, selectedCategory);
    result = filterProducts(result, searchQuery);
    result = sortProducts(result, sortBy, sortOrder);
    return result;
  }, [items, searchQuery, selectedCategory, sortBy, sortOrder]);

  // Remove from wishlist + show a confirmation toast
  const handleRemoveFromWishlist = (product) => {
    removeFromWish(product.id);
    success(`"${product.title}" removed from wishlist`);
  };

  // Shared card grid renderer — reused for card view and mobile fallback
  const renderCards = (list) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {list.map((product) => (
        <div key={product.id} className="relative">
          <ProductCard product={product} />
          {/* Quick-remove button in the top-right corner of each card */}
          <button
            onClick={() => handleRemoveFromWishlist(product)}
            className="absolute -top-2 -right-2 z-10 bg-red-500 text-white w-8 h-8 rounded-full hover:bg-red-600 transition-all shadow-lg flex items-center justify-center text-sm font-bold hover:scale-110"
            aria-label={`Remove ${product.title} from wishlist`}
            title="Remove from wishlist"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="space-y-6 pb-8">
      {/* Header with title and Continue Shopping CTA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
          ❤️ My Wishlist
        </h1>
        {items.length > 0 && (
          <Link to="/products">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
        )}
      </div>

      {/* Empty wishlist state — shown when nothing has been saved yet */}
      {items.length === 0 ? (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12 animate-scaleUp">
          <EmptyState
            icon="📭"
            title="Your wishlist is empty"
            message="Start adding products to your wishlist by clicking the heart icon on any product!"
            actionLabel="Browse Products"
            actionPath="/products"
          />
        </div>
      ) : (
        <>
          {/* Search + category + sort toolbar (categories limited to saved items) */}
          <ProductFilters
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            sortBy={sortBy}
            onSortChange={setSortBy}
            sortOrder={sortOrder}
            onOrderChange={setSortOrder}
            resultCount={filteredItems.length}
            categories={availableCategories}
          />

          {/* Grid / Table layout switch */}
          <div className="flex justify-end">
            <LayoutToggle value={layoutView} onChange={setLayoutView} />
          </div>

          {/* Grid or Table — with an empty state for filtered results with no matches */}
          {filteredItems.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-12">
              <EmptyState
                icon="🔍"
                title="No items found"
                message="Try adjusting your search or filters."
              />
            </div>
          ) : (
            <div className="animate-fadeIn">
              {layoutView === 'card' ? (
                renderCards(filteredItems)
              ) : (
                <>
                  {/* Table on desktop */}
                  <div className="hidden md:block">
                    <ProductTable
                      products={filteredItems}
                      loading={false}
                      error={null}
                    />
                  </div>
                  {/* Card fallback on mobile — table is too cramped on small screens */}
                  <div className="md:hidden">
                    {renderCards(filteredItems)}
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}