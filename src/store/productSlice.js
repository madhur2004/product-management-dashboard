import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  products: [],              // products currently shown on the listing
  localProducts: [],         // products added during this session (DummyJSON does not persist)
  selectedProduct: null,     // single product for the details page
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    pageSize: 10,
    total: 0,
    totalPages: 0,
  },
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    // Called before fetching products — show loading, reset any previous error
    fetchProductsStart: (state) => {
      state.loading = true;
      state.error = null;
    },

    // Called after a successful fetch — merge local products on page 1
    fetchProductsSuccess: (state, action) => {
      state.loading = false;

      const fetched = action.payload.products || [];
      const { currentPage, pageSize, total } = action.payload;

      const isPage1 = currentPage === 1;
      const hasLocal = state.localProducts.length > 0;

      // On page 1, keep session-added products at the top.
      // On other pages, just show what the server returned.
      if (isPage1 && hasLocal) {
        const fetchedIds = new Set(fetched.map((p) => p.id));
        // Skip local products that the server also returned (avoid duplicates)
        const extras = state.localProducts.filter(
          (p) => !fetchedIds.has(p.id)
        );
        state.products = [...extras, ...fetched];

        const mergedTotal = total + extras.length;
        state.pagination = {
          currentPage,
          pageSize,
          total: mergedTotal,
          totalPages: Math.ceil(mergedTotal / pageSize),
        };
      } else {
        state.products = fetched;
        state.pagination = {
          currentPage,
          pageSize,
          total,
          totalPages: Math.ceil(total / pageSize),
        };
      }
    },

    // Called when the fetch fails — store the error message for the UI
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Change the current page (pagination controls trigger this)
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },

    // Store a single product for the details page
    setSelectedProduct: (state, action) => {
      state.selectedProduct = action.payload;
    },

    // Clear the selected product when leaving the details page
    clearSelectedProduct: (state) => {
      state.selectedProduct = null;
    },

    // Add a product locally — shown at the top of the listing for this session
    addLocalProduct: (state, action) => {
      const product = action.payload;
      if (!product) return;

      state.localProducts = [product, ...state.localProducts]; // session copy
      state.products = [product, ...state.products];            // instant display
      state.pagination.total += 1;
      state.pagination.totalPages = Math.ceil(
        state.pagination.total / state.pagination.pageSize
      );
    },

    // Clear any fetch error (used by the Retry action)
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  fetchProductsStart,
  fetchProductsSuccess,
  fetchProductsFailure,
  setCurrentPage,
  setSelectedProduct,
  clearSelectedProduct,
  addLocalProduct,
  clearError,
} = productSlice.actions;

export default productSlice.reducer;