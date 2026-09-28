import { createSlice } from '@reduxjs/toolkit';

// Default filter state — applied on initial load and after reset
const initialState = {
  searchQuery: '',
  selectedCategory: null,
  sortBy: 'name', // name, price, rating
  sortOrder: 'asc', // asc, desc
  layoutView: 'card', // card, table
};

const filterSlice = createSlice({
  name: 'filters',
  initialState,
  reducers: {
    // Update the search text (usually debounced from the search input)
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    // Set the active category (null means "All")
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    // Choose which field to sort by
    setSortBy: (state, action) => {
      state.sortBy = action.payload;
    },
    // Choose sort direction (ascending / descending)
    setSortOrder: (state, action) => {
      state.sortOrder = action.payload;
    },
    // Switch between card grid and table view
    setLayoutView: (state, action) => {
      state.layoutView = action.payload;
    },
    // Reset everything except the layout preference
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategory = null;
      state.sortBy = 'name';
      state.sortOrder = 'asc';
    },
  },
});

export const {
  setSearchQuery,
  setSelectedCategory,
  setSortBy,
  setSortOrder,
  setLayoutView,
  resetFilters,
} = filterSlice.actions;

export default filterSlice.reducer;