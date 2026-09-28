import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useWishlist } from '../../hooks/useWishlist';
import Button from '../ui/Button';
import { formatPrice, getRatingStars } from '../../utils/helpers';
import Skeleton from '../states/Skeleton';

/**
 * Product details page — shows a single product with image gallery,
 * price, rating, stock, and wishlist action.
 *
 * Session-added products are read from Redux first; if not found there,
 * we fall back to the DummyJSON API (since POST does not persist).
 */
export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const { isInWishlist, addToWish, removeFromWish } = useWishlist();

  // Products added during this session (DummyJSON POST is not persisted)
  const localProducts = useSelector((state) => state.products.localProducts);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);

    const numericId = Number(id);

    // STEP 1: Check locally added products first
    const localMatch = localProducts?.find((p) => p.id === numericId);

    if (localMatch) {
      setProduct(localMatch);
      setSelectedImage(
        localMatch.thumbnail || localMatch.images?.[0] || null
      );
      setLoading(false);
      return; // skip API call
    }

    // STEP 2: Not a local product — fetch from DummyJSON
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/products/${numericId}`
      );
      if (!response.ok) {
        throw new Error('Product not found');
      }
      const data = await response.json();
      setProduct(data);
      setSelectedImage(data.thumbnail || data.images?.[0] || null);
    } catch (err) {
      setError(err.message || 'Failed to load product');
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }, [id, localProducts]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const handleRetry = () => {
    fetchProduct();
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWish(product.id);
    } else {
      addToWish(product);
    }
  };

  // While fetching — show skeleton
  if (loading) {
    return <Skeleton count={1} type="details" />;
  }

  // API error — show retry
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Error Loading Product
        </h2>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex gap-4">
          <Button variant="primary" onClick={handleRetry}>
            Try Again
          </Button>
          <Button variant="outline" onClick={() => navigate('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  // No product and no error — shouldn't normally happen
  if (!product) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="text-6xl mb-4">📭</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Product Not Found
        </h2>
        <Button variant="primary" onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </div>
    );
  }

  const inWishlist = isInWishlist(product.id);
  const rating = product.rating || 0;

  // Calculate original price and savings for discount display
  const hasDiscount =
    product.discountPercentage && product.discountPercentage > 0;
  const originalPrice = hasDiscount
    ? product.price / (1 - product.discountPercentage / 100)
    : null;
  const savings = hasDiscount ? originalPrice - product.price : 0;

  return (
    <div className="space-y-8 pb-8">
      {/* Back link */}
      <button
        onClick={() => navigate('/products')}
        className="flex items-center gap-2 text-primary hover:text-secondary transition-colors font-semibold"
      >
        ← Back to Products
      </button>

      {/* Two-column layout: image + details */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT — image gallery */}
          <div className="space-y-4">
            {/* Main image with discount badge + wishlist toggle */}
            <div className="relative bg-gray-100 rounded-lg overflow-hidden group">
              <img
                src={selectedImage || 'https://via.placeholder.com/500'}
                alt={product.title}
                className="w-full h-96 md:h-[500px] object-cover image-zoom"
                loading="lazy"
                decoding="async"
                // Fallback if image fails to load
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/500';
                }}
              />

              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                  -{Math.round(product.discountPercentage)}%
                </div>
              )}

              <button
                onClick={handleWishlistToggle}
                className={`absolute top-4 right-4 p-4 rounded-full backdrop-blur-sm transition-all duration-300 text-2xl ${
                  inWishlist
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-white bg-opacity-80 hover:bg-opacity-100'
                }`}
                aria-label={
                  inWishlist ? 'Remove from wishlist' : 'Add to wishlist'
                }
              >
                {inWishlist ? '❤️' : '🤍'}
              </button>
            </div>

            {/* Thumbnail strip — click to change main image */}
            {product.images && product.images.length > 0 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(img)}
                    className={`rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img
                        ? 'border-primary ring-2 ring-primary ring-offset-1'
                        : 'border-gray-300 hover:border-primary'
                    }`}
                    aria-label={`View image ${index + 1} of ${product.title}`}
                    aria-pressed={selectedImage === img}
                  >
                    <img
                      src={img}
                      alt={`${product.title} view ${index + 1}`}
                      className="w-full h-24 object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.src =
                          'https://via.placeholder.com/200';
                      }}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — product details */}
          <div className="space-y-6">
            {/* Category badge + brand */}
            <div>
              <span className="inline-block bg-blue-100 text-primary px-3 py-1 rounded-full text-sm font-semibold mb-3 capitalize">
                {product.category}
              </span>
              {product.brand && (
                <p className="text-gray-600 text-sm">
                  <strong>Brand:</strong> {product.brand}
                </p>
              )}
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              {product.title}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="text-2xl">{getRatingStars(rating)}</div>
              <div>
                <p className="font-bold text-lg">{rating.toFixed(1)} / 5</p>
                <p className="text-sm text-gray-600">(Customer Rating)</p>
              </div>
            </div>

            {/* Price block — shows discount strike-through if applicable */}
            <div className="bg-gray-50 p-6 rounded-lg space-y-2">
              <p className="text-gray-600 text-sm">Price</p>
              <div className="flex items-center gap-4 flex-wrap">
                <p className="text-4xl font-bold text-primary">
                  {formatPrice(product.price)}
                </p>
                {hasDiscount && (
                  <p className="text-xl text-gray-500 line-through">
                    {formatPrice(originalPrice)}
                  </p>
                )}
              </div>
              {hasDiscount && (
                <p className="text-green-600 font-semibold">
                  Save {formatPrice(savings)}
                </p>
              )}
            </div>

            {/* Stock status */}
            <div className="flex items-center gap-3 text-lg font-semibold">
              <span
                className={
                  product.stock > 0 ? 'text-green-600' : 'text-red-600'
                }
              >
                {product.stock > 0 ? '✅ In Stock' : '❌ Out of Stock'}
              </span>
              {product.stock > 0 && (
                <span className="text-gray-600 text-base">
                  ({product.stock} available)
                </span>
              )}
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Extra info — SKU + category */}
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="text-gray-600 text-sm font-semibold">SKU</p>
                <p className="text-gray-900 font-bold">
                  {product.sku || 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-gray-600 text-sm font-semibold">Category</p>
                <p className="text-gray-900 font-bold capitalize">
                  {product.category}
                </p>
              </div>
            </div>

            {/* Primary actions */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                variant="primary"
                size="lg"
                className="flex-1"
                disabled={product.stock === 0}
              >
                🛒 Add to Cart
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={handleWishlistToggle}
              >
                {inWishlist ? '❤️ Wishlisted' : '🤍 Wishlist'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Placeholder for a future related-products section */}
      <div className="bg-white rounded-lg shadow-lg p-6 md:p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Related Products
        </h2>
        <p className="text-gray-600">Coming soon...</p>
      </div>
    </div>
  );
}