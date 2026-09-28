import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import productReducer from './productSlice';
import wishlistReducer from './wishlistSlice';
import filterReducer from './filterSlice';
import notificationReducer from './notificationSlice';
import themeReducer from './themeSlice';

// Central Redux store — combines all slices into one state tree.
// Each key here corresponds to a slice of `state`, e.g. state.auth, state.products.
const store = configureStore({
  reducer: {
    auth: authReducer,             // login state + user info
    products: productReducer,      // product list, pagination, locally added products
    wishlist: wishlistReducer,     // saved products
    filters: filterReducer,        // search, category, sort, layout view
    notifications: notificationReducer, // toast messages
    theme: themeReducer,           // dark mode
  },
});

export default store;