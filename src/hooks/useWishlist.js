import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { addToWishlist, removeFromWishlist } from '../store/wishlistSlice';

/**
 * Wishlist hook — read saved items and add/remove products.
 * Exposes a stable `isInWishlist` check for use inside cards and lists.
 */
export const useWishlist = () => {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.wishlist.items);

  // Add a product to the wishlist
  const addToWish = useCallback(
    (product) => dispatch(addToWishlist(product)),
    [dispatch]
  );

  // Remove a product by id
  const removeFromWish = useCallback(
    (productId) => dispatch(removeFromWishlist(productId)),
    [dispatch]
  );

  // Check whether a specific product id is already in the wishlist.
  // Depends on `items` so it re-computes when the list changes.
  const isInWishlist = useCallback(
    (productId) => items.some((item) => item.id === productId),
    [items]
  );

  return {
    items,
    addToWish,
    removeFromWish,
    isInWishlist,
  };
};