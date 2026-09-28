/** Filter products by a text query — matches title, description, or brand (case-insensitive). */
export const filterProducts = (products, query) => {
  // No query → return everything unchanged
  if (!query) return products;

  const lowerQuery = query.toLowerCase();
  return products.filter(product =>
    product.title?.toLowerCase().includes(lowerQuery) ||
    product.description?.toLowerCase().includes(lowerQuery) ||
    product.brand?.toLowerCase().includes(lowerQuery)
  );
};

/** Sort products by the given field and direction. Returns a new array (does not mutate). */
export const sortProducts = (products, sortBy, sortOrder) => {
  // Copy the array first so we don't modify the caller's data
  const sorted = [...products];

  sorted.sort((a, b) => {
    let compareValue = 0;

    switch (sortBy) {
      case 'price':
        compareValue = a.price - b.price;
        break;
      case 'rating':
        // Higher rating first when the direction is default
        compareValue = b.rating - a.rating;
        break;
      case 'name':
      default:
        // Alphabetical comparison for names
        compareValue = a.title.localeCompare(b.title);
        break;
    }

    // Flip the sign for descending order
    return sortOrder === 'asc' ? compareValue : -compareValue;
  });

  return sorted;
};

/** Filter products by category. "All" (or empty) means no filtering. */
export const filterByCategory = (products, category) => {
  if (!category || category === 'All') return products;
  return products.filter(product => product.category === category);
};

/** Extract a sorted list of unique categories from an array of products (prefixed with "All"). */
export const getCategories = (products) => {
  const categories = new Set(products.map(p => p.category));
  return ['All', ...Array.from(categories).sort()];
};

/** Format a number as a USD currency string (e.g. 19.99 → "$19.99"). */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

/** Shorten long text to a max length and append "..." if trimmed. */
export const truncateText = (text, length = 100) => {
  if (!text || text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/** Convert a numeric rating into a 5-star emoji string (capped at 5 stars). */
export const getRatingStars = (rating) => {
  const stars = Math.round(rating);
  return '⭐'.repeat(Math.min(stars, 5));
};