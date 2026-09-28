/**
 * Placeholder loading skeleton.
 * `type` selects the layout: 'card', 'table', or 'details'.
 * `count` controls how many card/table rows are rendered.
 */
export default function Skeleton({ count = 1, type = 'card' }) {
  // Card layout — tall image block + a few text lines + two button placeholders
  if (type === 'card') {
    return (
      <div className="space-y-4">
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-4 shadow-md">
            <div className="h-40 bg-gray-200 rounded-lg mb-4 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 animate-pulse" />
            <div className="flex gap-2">
              <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse" />
              <div className="h-8 bg-gray-200 rounded flex-1 animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Table layout — a header row plus `count` placeholder rows
  if (type === 'table') {
    return (
      <div className="space-y-4">
        {/* Header row */}
        <div className="flex gap-4 p-4 bg-white rounded-lg">
          {Array(5).fill(0).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
          ))}
        </div>

        {/* Data rows */}
        {Array(count).fill(0).map((_, i) => (
          <div key={i} className="flex gap-4 p-4 bg-white rounded-lg">
            {Array(5).fill(0).map((_, j) => (
              <div key={j} className="h-4 bg-gray-200 rounded flex-1 animate-pulse" />
            ))}
          </div>
        ))}
      </div>
    );
  }

  // Details layout — large image block + title + body lines + price box
  if (type === 'details') {
    return (
      <div className="bg-white rounded-lg p-6 shadow-md">
        <div className="h-64 bg-gray-200 rounded-lg mb-6 animate-pulse" />
        <div className="h-8 bg-gray-200 rounded mb-4 w-3/4 animate-pulse" />
        <div className="space-y-3 mb-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        <div className="h-10 bg-gray-200 rounded w-1/4 animate-pulse" />
      </div>
    );
  }

  // Unknown type — render nothing
  return null;
}