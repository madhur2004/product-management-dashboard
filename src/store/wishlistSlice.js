import { createSlice } from '@reduxjs/toolkit';

// Restore the wishlist from localStorage so it survives page refreshes
const initialState = {
  items: localStorage.getItem('wishlist')
    ? JSON.parse(localStorage.getItem('wishlist'))
    : [],
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    // Add a product to the wishlist — but skip if it's already there
    addToWishlist: (state, action) => {
      const product = action.payload;
      const exists = state.items.find(item => item.id === product.id);

      if (!exists) {
        state.items.push(product);
        localStorage.setItem('wishlist', JSON.stringify(state.items));
      }
    },
    // Remove a single product by id, then persist the updated list
    removeFromWishlist: (state, action) => {
      state.items = state.items.filter(item => item.id !== action.payload);
      localStorage.setItem('wishlist', JSON.stringify(state.items));
    },
    // Clear everything and remove the stored key as well
    clearWishlist: (state) => {
      state.items = [];
      localStorage.removeItem('wishlist');
    },
  },
});

export const { addToWishlist, removeFromWishlist, clearWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;