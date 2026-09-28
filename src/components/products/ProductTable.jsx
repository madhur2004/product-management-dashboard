import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import Button from '../ui/Button';
import EmptyState from '../states/EmptyState';
import ErrorState from '../states/ErrorState';
import { formatPrice, getRatingStars } from '../../utils/helpers';

/**
 * Table view of products — alternative to the card grid.
 * Also handles error, loading (skeleton rows), and empty states.
 * Wrapped in memo to skip re-renders when props don't change.
 */
function ProductTable({ products, loading, error, onRetry }) {
  const { isInWishlist, addToWish, removeFromWish } = useWishlist();

  // Error state takes priority
  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  // Loading state — show 5 placeholder rows with 6 pulsing cells each
  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {Array(5).fill(0).map((_, i) => (
          <div key={i} className="border-b last:border-b-0 p-4 flex gap-4">
            {Array(6).fill(0).map((_, j) => (
              <div
                key={j}
                className="h-4 bg-gray-200 rounded flex-1 animate-pulse"
              />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Empty state — no matching products
  if (!products || products.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md">
        <EmptyState
          icon="📭"
          title="No Products Found"
          message="Try adjusting your search or filters"
          actionLabel="Browse Products"
          actionPath="/products"
        />
      </div>
    );
  }

  // Populated table — min-width ensures columns don't squish; parent scrolls on mobile
  return (
    <div className="bg-white rounded-lg shadow-md overflow-x-auto">
      <table className="w-full text-sm min-w-[760px]">
        <thead className="bg-gray-100 border-b-2 border-gray-200">
          <tr>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Product
            </th>
            <th className="px-4 py-3 text-left font-semibold text-gray-700">
              Category
            </th>
            <th className="px-4 py-3 text-right font-semibold text-gray-700">
              Price
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">
              Rating
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">
              Stock
            </th>
            <th className="px-4 py-3 text-center font-semibold text-gray-700">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => {
            const inWishlist = isInWishlist(product.id);
            const rating = product.rating || 0;

            return (
              <tr
                key={product.id}
                className="border-b last:border-b-0 hover:bg-gray-50 transition-colors animate-rowIn"
                // Staggered row animation for a subtle cascade effect
                style={{ animationDelay: `${index * 40}ms` }}
              >
                {/* Product — thumbnail + title + brand */}
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        product.thumbnail || 'https://via.placeholder.com/50'
                      }
                      alt={product.title}
                      className="w-12 h-12 object-cover rounded flex-shrink-0"
                      loading="lazy"
                    />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 truncate max-w-xs">
                        {product.title}
                      </p>
                      {product.brand && (
                        <p className="text-xs text-gray-500 truncate max-w-xs">
                          {product.brand}
                        </p>
                      )}
                    </div>
                  </div>
                </td>

                {/* Category — right-aligned labels use capitalize for readability */}
                <td className="px-4 py-3 text-gray-700 capitalize">
                  {product.category}
                </td>

                {/* Price — right-aligned numbers are easier to scan */}
                <td className="px-4 py-3 text-right font-bold text-primary whitespace-nowrap">
                  {formatPrice(product.price)}
                </td>

                {/* Rating — stars + numeric value */}
                <td className="px-4 py-3 text-center whitespace-nowrap">
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-xs">{getRatingStars(rating)}</span>
                    <span className="text-xs text-gray-600">
                      ({rating.toFixed(1)})
                    </span>
                  </div>
                </td>

                {/* Stock — green badge when available, red when out */}
                <td className="px-4 py-3 text-center">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      product.stock > 0
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock > 0
                      ? `In Stock (${product.stock})`
                      : 'Out'}
                  </span>
                </td>

                {/* Actions — view details + wishlist toggle */}
                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <Link to={`/products/${product.id}`}>
                      <Button variant="primary" size="sm">
                        View
                      </Button>
                    </Link>
                    <button
                      onClick={() => {
                        if (inWishlist) removeFromWish(product.id);
                        else addToWish(product);
                      }}
                      className={`px-2 py-1 rounded-lg text-sm transition-colors ${
                        inWishlist
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      aria-label={
                        inWishlist
                          ? 'Remove from wishlist'
                          : 'Add to wishlist'
                      }
                    >
                      {inWishlist ? '❤️' : '🤍'}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default memo(ProductTable);