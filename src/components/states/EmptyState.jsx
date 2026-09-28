import { Link } from 'react-router-dom';
import Button from '../ui/Button';

/**
 * Reusable empty-state block — shows an icon, title, message,
 * and an optional action button that navigates to a path.
 */
export default function EmptyState({
  icon = '📭',
  title = 'No Items Found',
  message = 'Try adjusting your search or filters',
  actionLabel = 'Go Back',
  actionPath = '/products',
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4">{icon}</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
      <p className="text-gray-600 text-center mb-6">{message}</p>
      {/* Action button is only rendered if a path is provided */}
      {actionPath && (
        <Link to={actionPath}>
          <Button variant="primary" size="md">
            {actionLabel}
          </Button>
        </Link>
      )}
    </div>
  );
}