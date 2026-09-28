import { createSlice } from '@reduxjs/toolkit';

// Active toast notifications — each item is { id, type, message }
const initialState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Add a new toast to the stack. Falls back to Date.now() if no id given.
    addNotification: (state, action) => {
      const notification = {
        id: action.payload.id ?? Date.now(),
        type: action.payload.type,
        message: action.payload.message,
      };
      state.notifications.push(notification);
    },
    // Remove a single toast by its id (used on auto-dismiss or manual close)
    removeNotification: (state, action) => {
      state.notifications = state.notifications.filter(
        n => n.id !== action.payload
      );
    },
    // Clear all toasts at once
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;