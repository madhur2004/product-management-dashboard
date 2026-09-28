// App-wide constants. Values fall back to safe defaults when env vars are missing.

export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Product Hub';
export const API_URL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';

// Route paths used across the app — central place to avoid typos
export const ROUTES = {
  HOME: '/',
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  PRODUCTS: '/products',
  PRODUCT_DETAILS: '/products/:id',
  WISHLIST: '/wishlist',
};

// Sort field options shown in the sort dropdown
export const SORT_OPTIONS = [
  { label: 'Name (A-Z)', value: 'name' },
  { label: 'Price (Low to High)', value: 'price' },
  { label: 'Rating (High to Low)', value: 'rating' },
];

// Sort direction values
export const SORT_ORDER = {
  ASC: 'asc',
  DESC: 'desc',
};

// Layout toggle options
export const LAYOUT_VIEWS = {
  CARD: 'card',
  TABLE: 'table',
};

// Toast notification types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
};

// Fallback category list used in the Add Product form.
// The listing page fetches categories from the API instead.
export const CATEGORIES = [
  'All',
  'smartphones',
  'laptops',
  'fragrances',
  'skincare',
  'groceries',
  'home-decoration',
  'furniture',
  'tops',
  'womens-dresses',
  'womens-shoes',
  'mens-shirts',
  'mens-shoes',
  'mens-watches',
  'womens-watches',
  'womens-bags',
  'womens-jewellery',
  'sunglasses',
  'automotive',
  'motorcycle',
  'lighting',
];

// Default number of products per page
export const PAGE_SIZE = 10;