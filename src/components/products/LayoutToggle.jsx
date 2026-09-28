/* Inline SVG icons — no external library needed */

const GridIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const ListIcon = ({ size = 14 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="8" y1="6" x2="21" y2="6" />
    <line x1="8" y1="12" x2="21" y2="12" />
    <line x1="8" y1="18" x2="21" y2="18" />
    <line x1="3" y1="6" x2="3.01" y2="6" />
    <line x1="3" y1="12" x2="3.01" y2="12" />
    <line x1="3" y1="18" x2="3.01" y2="18" />
  </svg>
);

/**
 * Toggle between card grid and table layout.
 * Controlled component — parent owns the `value` and receives `onChange`.
 */
export default function LayoutToggle({ value = 'card', onChange }) {
  // Shared button styles — active gets a raised white/dark bg
  const btnClass = (active) =>
    [
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-colors',
      active
        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200',
    ].join(' ');

  return (
    <div
      className="inline-flex items-center gap-1 p-1 rounded-lg bg-gray-100 dark:bg-gray-800"
      role="group"
      aria-label="Layout view toggle"
    >
      <button
        type="button"
        onClick={() => onChange?.('card')}
        className={btnClass(value === 'card')}
        aria-label="Card view"
        aria-pressed={value === 'card'}
      >
        <GridIcon size={14} />
        <span>Grid</span>
      </button>
      <button
        type="button"
        onClick={() => onChange?.('table')}
        // Table view hidden on mobile — cards are more usable on small screens
        className={`${btnClass(value === 'table')} hidden md:inline-flex`}
        aria-label="Table view"
        aria-pressed={value === 'table'}
      >
        <ListIcon size={14} />
        <span>Table</span>
      </button>
    </div>
  );
}