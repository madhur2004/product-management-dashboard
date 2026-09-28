import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { removeNotification } from '../../store/notificationSlice';

// Background gradient per toast type
const toastStyles = {
  success: 'bg-gradient-to-r from-green-500 to-green-600',
  error: 'bg-gradient-to-r from-red-500 to-red-600',
  info: 'bg-gradient-to-r from-blue-500 to-blue-600',
  warning: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
};

// Icon per toast type
const toastIcons = {
  success: '✅',
  error: '❌',
  info: 'ℹ️',
  warning: '⚠️',
};

/**
 * Single toast notification.
 * Auto-dismisses after 3 seconds, or when the user clicks the close button.
 */
export default function Toast({ notification }) {
  const dispatch = useDispatch();
  const { id, type, message } = notification;

  // Auto-remove this toast after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(removeNotification(id));
    }, 3000);

    // Clear timer if component unmounts early (e.g. user closes it)
    return () => clearTimeout(timer);
  }, [id, dispatch]);

  return (
    <div
      className={`${toastStyles[type]} text-white px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slideDown`}
      // alert role so screen readers announce it immediately
      role="alert"
    >
      <span className="text-xl flex-shrink-0">{toastIcons[type]}</span>
      <span className="flex-1 text-sm font-medium">{message}</span>
      <button
        onClick={() => dispatch(removeNotification(id))}
        className="text-white hover:opacity-75 transition-opacity focus:outline-none focus:ring-2 focus:ring-white rounded p-1 flex-shrink-0"
        aria-label="Close notification"
      >
        ✕
      </button>
    </div>
  );
}