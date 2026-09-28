/**
 * Simple centered loading spinner.
 * `fullScreen` controls whether it fills the viewport or just adds padding.
 */
export default function LoadingSpinner({ fullScreen = true }) {
  return (
    <div
      className={`flex justify-center items-center ${
        fullScreen ? 'min-h-screen' : 'py-16'
      }`}
      // Announce loading state to screen readers
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col items-center gap-4">
        {/* CSS border trick: three sides light, one side dark = spinner effect */}
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
        <p className="text-gray-600 text-sm">Loading...</p>
      </div>
    </div>
  );
}