import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useMemo } from 'react';
import {
  addNotification,
  removeNotification,
  clearNotifications,
} from '../store/notificationSlice';

/**
 * Hook for triggering toast notifications.
 * Exposes generic `notify` plus typed shortcuts (success/error/info/warning).
 * Notifications auto-remove after the given duration.
 */
export const useNotification = () => {
  const dispatch = useDispatch();
  const notifications = useSelector(
    (state) => state.notifications.notifications
  );

  // Base helper — adds a notification and schedules its removal
  const notify = useCallback(
    (message, type = 'info', duration = 3000) => {
      // Use timestamp as a simple unique id
      const id = Date.now();
      dispatch(addNotification({ id, message, type }));
      // Auto-dismiss after `duration` ms
      setTimeout(() => dispatch(removeNotification(id)), duration);
    },
    [dispatch]
  );

  // Typed shortcuts — thin wrappers around notify
  const success = useCallback(
    (message, duration = 3000) => notify(message, 'success', duration),
    [notify]
  );
  const error = useCallback(
    (message, duration = 3000) => notify(message, 'error', duration),
    [notify]
  );
  const info = useCallback(
    (message, duration = 3000) => notify(message, 'info', duration),
    [notify]
  );
  const warning = useCallback(
    (message, duration = 3000) => notify(message, 'warning', duration),
    [notify]
  );

  // Remove all notifications at once
  const clear = useCallback(() => dispatch(clearNotifications()), [dispatch]);

  // Memoize the returned object so consumers don't re-render unnecessarily
  return useMemo(
    () => ({
      notifications,
      notify,
      success,
      error,
      info,
      warning,
      clear,
    }),
    [notifications, notify, success, error, info, warning, clear]
  );
};