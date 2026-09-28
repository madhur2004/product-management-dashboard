import ProductCard from './ProductCard';
import EmptyState from '../states/EmptyState';
import ErrorState from '../states/ErrorState';

/**
 * Responsive product grid that handles four states:
 * error, loading (skeleton), empty, and populated.
 */
export default function ProductGrid({ products, loading, error, onRetry }) {
  // Error state takes priority — show retry action
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  // Loading state — show 8 placeholder cards matching the real grid layout
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8)
          .fill(0)
          .map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* Skeleton mirrors the real card's structure */}
              <div className="h-48 bg-gray-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-3 bg-gray-200 rounded w-1/3 animate-pulse" />
                <div className="h-4 bg-gray-200 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
                <div className="h-6 bg-gray-200 rounded w-1/2 animate-pulse" />
                <div className="h-10 bg-gray-200 rounded mt-4 animate-pulse" />
              </div>
            </div>
          ))}
      </div>
    );
  }

  // Empty state — no products match the current filters or search
  if (!products || products.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No Products Found"
        message="Try adjusting your search or filters"
        actionLabel="Clear Filters & Reload"
        actionPath="/products"
      />
    );
  }

  // Success — render the grid of product cards
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}