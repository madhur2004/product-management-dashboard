import { memo } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../hooks/useWishlist';
import Button from '../ui/Button';
import { formatPrice, getRatingStars } from '../../utils/helpers';

/**
 * Product card used on the listing page and wishlist page.
 * Shows image, title, rating, price, stock, and a wishlist toggle.
 * Wrapped in memo so it only re-renders when its own props change.
 */
function ProductCard({ product }) {
  const { isInWishlist, addToWish, removeFromWish } = useWishlist();
  const inWishlist = isInWishlist(product.id);

  // Toggle: if already saved, remove; otherwise, add to wishlist
  const handleWishlistToggle = () => {
    if (inWishlist) {
      removeFromWish(product.id);
    } else {
      addToWish(product);
    }
  };

  // Calculate original price before discount for the strikethrough display
  const hasDiscount =
    product.discountPercentage && product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discountPercentage / 100)
    : null;

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl overflow-hidden flex flex-col h-full hover:scale-[1.03] transition-all duration-300">
      {/* Image area — fixed height so all cards line up evenly */}
      <div className="relative h-48 bg-gray-100 overflow-hidden group">
        <img
          // Fallback chain: thumbnail → first image → placeholder
          src={
            product.thumbnail ||
            product.images?.[0] ||
            'https://via.placeholder.com/200'
          }
          alt={product.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />

        {/* Wishlist toggle — filled red when saved */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2 right-2 p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
            inWishlist
              ? 'bg-red-500 text-white shadow-lg animate-heartBeat'
              : 'bg-white bg-opacity-80 text-gray-700 hover:bg-opacity-100'
          }`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          {inWishlist ? '❤️' : '🤍'}
        </button>

        {/* Discount badge — only shown if there's a discount */}
        {hasDiscount && (
          <div className="absolute top-2 left-2 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
            -{Math.round(product.discountPercentage)}%
          </div>
        )}
      </div>

      {/* Card body — flex column so the CTA sticks to the bottom */}
      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-gray-500 uppercase tracking-wider mb-2">
          {product.category}
        </span>

        <h3 className="font-bold text-gray-800 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Star rating + numeric value */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-yellow-500 text-sm">
            {getRatingStars(product.rating || 0)}
          </span>
          <span className="text-sm text-gray-600">
            ({(product.rating || 0).toFixed(1)})
          </span>
        </div>

        {/* Price + original price (strikethrough) when discounted */}
        <div className="mb-3">
          <p className="text-2xl font-bold text-primary">
            {formatPrice(product.price)}
          </p>
          {hasDiscount && (
            <p className="text-sm text-gray-500 line-through">
              {formatPrice(originalPrice)}
            </p>
          )}
        </div>

        {/* Stock status — green if available, red if out of stock */}
        <div className="mb-4">
          <span
            className={`text-sm font-semibold ${
              product.stock > 0 ? 'text-green-600' : 'text-red-600'
            }`}
          >
            {product.stock > 0
              ? `${product.stock} in stock`
              : 'Out of stock'}
          </span>
        </div>

        {/* mt-auto pushes this button to the bottom regardless of title length */}
        <Link to={`/products/${product.id}`} className="mt-auto">
          <Button variant="primary" size="md" className="w-full">
            View Details
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default memo(ProductCard);