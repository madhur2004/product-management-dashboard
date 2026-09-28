import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useCallback, useMemo } from 'react';
import {
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setSortOrder,
  setLayoutView,
  resetFilters,
} from '../store/filterSlice';

/**
 * Hook to read and update product filters from Redux.
 * Exposes the filter values plus stable setter functions and a reset.
 */
export const useFilters = () => {
  const dispatch = useDispatch();

  // shallowEqual avoids re-renders when nothing inside filters changed
  const filters = useSelector((state) => state.filters, shallowEqual);

  // Stable callbacks — safe to use in dependency arrays without re-triggering effects
  const updateSearchQuery = useCallback(
    (query) => dispatch(setSearchQuery(query)),
    [dispatch]
  );
  const updateCategory = useCallback(
    (category) => dispatch(setSelectedCategory(category)),
    [dispatch]
  );
  const updateSortBy = useCallback(
    (sortBy) => dispatch(setSortBy(sortBy)),
    [dispatch]
  );
  const updateSortOrder = useCallback(
    (order) => dispatch(setSortOrder(order)),
    [dispatch]
  );
  const updateLayoutView = useCallback(
    (view) => dispatch(setLayoutView(view)),
    [dispatch]
  );
  const reset = useCallback(() => dispatch(resetFilters()), [dispatch]);

  // Memoize the returned object so consumers don't re-render unnecessarily
  return useMemo(
    () => ({
      ...filters,
      updateSearchQuery,
      updateCategory,
      updateSortBy,
      updateSortOrder,
      updateLayoutView,
      reset,
    }),
    [
      filters,
      updateSearchQuery,
      updateCategory,
      updateSortBy,
      updateSortOrder,
      updateLayoutView,
      reset,
    ]
  );
};