import Button from '../ui/Button';

/**
 * Reusable error-state block with a message and optional retry button.
 * If `onRetry` is not passed, only the message is shown.
 */
export default function ErrorState({
  message = 'Something went wrong',
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="text-6xl mb-4">⚠️</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Error</h2>
      <p className="text-gray-600 text-center mb-6">{message}</p>
      {/* Retry button only rendered when a handler is provided */}
      {onRetry && (
        <Button variant="primary" size="md" onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
}