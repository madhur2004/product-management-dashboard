import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setCurrentPage,
  addLocalProduct,
  clearError,
} from '../store/productSlice';

/**
 * Hook for product listing, pagination, and adding products.
 * Wraps Redux dispatch calls in stable callbacks so consumers
 * can safely use them in dependency arrays.
 */
export const useProducts = () => {
  const dispatch = useDispatch();
  const { products, loading, error, pagination, selectedProduct } = useSelector(
    (state) => state.products
  );

  /** Fetch a page of products from the API. `skip` + `limit` drive pagination. */
  const fetchProducts = useCallback(
    async (skip = 0, limit = 10) => {
      dispatch(fetchProductsStart());
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/products?skip=${skip}&limit=${limit}`
        );
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();

        // Derive the current page from skip/limit for the pagination state
        dispatch(
          fetchProductsSuccess({
            products: data.products || [],
            currentPage: Math.floor(skip / limit) + 1,
            pageSize: limit,
            total: data.total || 0,
          })
        );
      } catch (err) {
        dispatch(
          fetchProductsFailure('Failed to fetch products. Please try again.')
        );
      }
    },
    [dispatch]
  );

  /** Change the current page — guarded so we never go below 1 or to the same page. */
  const goToPage = useCallback(
    (pageNumber) => {
      if (pageNumber >= 1 && pageNumber !== pagination.currentPage) {
        dispatch(setCurrentPage(pageNumber));
      }
    },
    [dispatch, pagination.currentPage]
  );

  /** Add a product locally (session-only — DummyJSON does not persist additions). */
  const addProduct = useCallback(
    (product) => {
      // Compute a new id by taking the highest existing id + 1
      const newId =
        products.length > 0
          ? Math.max(...products.map((p) => p.id || 0)) + 1
          : 1;

      const newProduct = {
        ...product,
        id: newId,
        rating: 0,
        stock: parseInt(product.stock, 10) || 0,
        // Fallback thumbnail so cards always have something to render
        thumbnail:
          product.thumbnail || 'https://via.placeholder.com/200',
        images: [
          product.thumbnail || 'https://via.placeholder.com/200',
        ],
      };
      dispatch(addLocalProduct(newProduct));
    },
    [dispatch, products]
  );

  /** Clear any previous error message shown to the user. */
  const clearProductError = useCallback(() => dispatch(clearError()), [dispatch]);

  return {
    products,
    loading,
    error,
    pagination,
    selectedProduct,
    fetchProducts,
    goToPage,
    addProduct,
    clearProductError,
  };
};