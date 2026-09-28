import { useSelector } from 'react-redux';
import Toast from './Toast';

/**
 * Renders all active toast notifications in a fixed container.
 * Positioned top-right, respects mobile width, stacked with spacing.
 */
export default function ToastContainer() {
  // Pull the list of active notifications from Redux
  const notifications = useSelector((state) => state.notifications.notifications);

  return (
    <div
      className="fixed top-24 right-4 z-50 space-y-3 max-w-md w-[calc(100%-2rem)] sm:w-auto"
      // Screen-reader announcements for new toasts (non-blocking)
      aria-live="polite"
      aria-atomic="true"
    >
      {notifications.map((notification) => (
        <Toast key={notification.id} notification={notification} />
      ))}
    </div>
  );
}