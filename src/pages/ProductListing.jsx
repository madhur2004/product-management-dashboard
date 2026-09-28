import { useEffect, useMemo, useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useAuth } from '../hooks/useAuth';
import ProductFilters from '../components/products/ProductFilters';
import LayoutToggle from '../components/products/LayoutToggle';
import ProductGrid from '../components/products/ProductGrid';
import ProductTable from '../components/products/ProductTable';
import Pagination from '../components/products/Pagination';
import Button from '../components/ui/Button';
import { filterProducts, sortProducts } from '../utils/helpers';

const API_URL = 'https://dummyjson.com';

/**
 * Product listing page — combines filters, layout toggle, grid/table view,
 * and pagination. Category filtering is done server-side; search and sort
 * are applied locally on top of the fetched results.
 */
export default function ProductListing() {
  const {
    fetchProducts,
    products,
    loading,
    error,
    pagination,
    goToPage,
    clearProductError,
  } = useProducts();
  const { isLoggedIn } = useAuth();

  // Local filter state (kept out of Redux since it's only used on this page)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [layoutView, setLayoutView] = useState('card');

  // Categories fetched from the API (used by the filter dropdown)
  const [apiCategories, setApiCategories] = useState(['All']);

  // When a category is selected, its products are fetched separately
  const [categoryProducts, setCategoryProducts] = useState(null);
  const [categoryLoading, setCategoryLoading] = useState(false);

  // Fetch the default (unfiltered) product page whenever the page number changes
  useEffect(() => {
    const skip = (pagination.currentPage - 1) * pagination.pageSize;
    fetchProducts(skip, pagination.pageSize);
  }, [pagination.currentPage, pagination.pageSize, fetchProducts]);

  // Fetch the category list once on mount
  useEffect(() => {
    let cancelled = false;
    fetch(`${API_URL}/products/categories`)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        // API can return either strings or objects — normalize to slugs
        const list = (Array.isArray(data) ? data : [])
          .map((c) => (typeof c === 'string' ? c : c.slug))
          .filter(Boolean);
        setApiCategories(['All', ...list.sort()]);
      })
      .catch(() => {
        // Silent fail — dropdown just shows "All"
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // When a specific category is selected, fetch its products from the API
  useEffect(() => {
    if (!selectedCategory || selectedCategory === 'All') {
      setCategoryProducts(null);
      return;
    }

    let cancelled = false;
    setCategoryLoading(true);

    fetch(
      `${API_URL}/products/category/${encodeURIComponent(selectedCategory)}`
    )
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        setCategoryProducts(data.products || []);
        setCategoryLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setCategoryProducts([]);
        setCategoryLoading(false);
      });

    // Cancel the pending fetch if the category changes or component unmounts
    return () => {
      cancelled = true;
    };
  }, [selectedCategory]);

  // Whenever a filter changes, jump back to page 1
  useEffect(() => {
    if (pagination.currentPage !== 1) {
      goToPage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory, sortBy, sortOrder]);

  // Choose the data source: category results if filtered, else paginated list
  const sourceProducts =
    selectedCategory === 'All' ? products : categoryProducts ?? [];

  // Apply search + sort on top of the source (category is already filtered)
  const filteredProducts = useMemo(() => {
    let result = [...sourceProducts];
    result = filterProducts(result, searchQuery);
    result = sortProducts(result, sortBy, sortOrder);
    return result;
  }, [sourceProducts, searchQuery, sortBy, sortOrder]);

  // Retry handler — re-fetches the current page after clearing any error
  const handleRetry = useCallback(() => {
    clearProductError();
    const skip = (pagination.currentPage - 1) * pagination.pageSize;
    fetchProducts(skip, pagination.pageSize);
  }, [
    clearProductError,
    pagination.currentPage,
    pagination.pageSize,
    fetchProducts,
  ]);

  // Loading is true when either the main fetch or the category fetch is pending
  const isLoading = loading || categoryLoading;

  return (
    <div className="space-y-6 pb-8">
      {/* Page header with title and Add Product CTA */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
          🛍️ Products
        </h1>

        {isLoggedIn ? (
          <Link to="/add-product">
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              ➕ Add Product
            </Button>
          </Link>
        ) : (
          <Link to="/auth/login">
            <Button variant="secondary" size="lg" className="w-full sm:w-auto">
              Sign In to Add
            </Button>
          </Link>
        )}
      </div>

      {/* Search + category + sort toolbar */}
      <ProductFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        sortOrder={sortOrder}
        onOrderChange={setSortOrder}
        resultCount={filteredProducts.length}
        categories={apiCategories}
      />

      {/* Grid / Table layout switch — right aligned */}
      <div className="flex justify-end">
        <LayoutToggle value={layoutView} onChange={setLayoutView} />
      </div>

      {/* Product display — grid or table based on layout choice */}
      <div className="animate-fadeIn">
        {layoutView === 'card' ? (
          <ProductGrid
            products={filteredProducts}
            loading={isLoading}
            error={error}
            onRetry={handleRetry}
          />
        ) : (
          <>
            {/* Table on desktop, cards on mobile (table doesn't fit small screens) */}
            <div className="hidden md:block">
              <ProductTable
                products={filteredProducts}
                loading={isLoading}
                error={error}
                onRetry={handleRetry}
              />
            </div>
            <div className="md:hidden">
              <ProductGrid
                products={filteredProducts}
                loading={isLoading}
                error={error}
                onRetry={handleRetry}
              />
            </div>
          </>
        )}
      </div>

      {/* Pagination only applies to the "All" view since category fetches are not paginated */}
      {!isLoading &&
        !error &&
        selectedCategory === 'All' &&
        products.length > 0 && <Pagination />}
    </div>
  );
}