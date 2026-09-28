import { memo } from 'react';
import { useProducts } from '../../hooks/useProducts';
import Button from '../ui/Button';

/**
 * Pagination controls for the product listing.
 * Shows a sliding window of page numbers with ellipses when totalPages is large.
 * Uses memo to avoid re-rendering when the parent re-renders without changes.
 */
function Pagination() {
  const { pagination, goToPage } = useProducts();
  const { currentPage, totalPages } = pagination;

  // Hide pagination entirely if there's only one page
  if (totalPages <= 1) return null;

  /**
   * Build the list of page numbers to show.
   * Uses a sliding window of 5 pages with "..." for skipped ranges.
   */
  const getPageNumbers = () => {
    const pages = [];
    const maxPagesToShow = 5;

    // Few pages — just show them all
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    }
    // Near the start — first 5 pages + last page
    else if (currentPage <= 3) {
      for (let i = 1; i <= maxPagesToShow; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    // Near the end — first page + last 5 pages
    else if (currentPage >= totalPages - 2) {
      pages.push(1);
      pages.push('...');
      for (let i = totalPages - maxPagesToShow + 1; i <= totalPages; i++) {
        pages.push(i);
      }
    }
    // In the middle — first + ... + current-1, current, current+1 + ... + last
    else {
      pages.push(1);
      pages.push('...');
      for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
      pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  };

  return (
    <div className="flex justify-center items-center gap-2 mt-8 flex-wrap">
      {/* Previous — disabled on first page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage - 1)}
        disabled={currentPage === 1}
      >
        ← Previous
      </Button>

      {/* Page number buttons + ellipses */}
      {getPageNumbers().map((page, i) => (
        <button
          key={i}
          onClick={() => typeof page === 'number' && goToPage(page)}
          disabled={page === '...'}
          className={`px-3 py-2 rounded-lg font-semibold transition-all duration-300 min-w-[40px] ${
            page === currentPage
              ? 'bg-primary text-white shadow-md'
              : page === '...'
              ? 'cursor-default text-gray-500'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-primary'
          }`}
          aria-current={page === currentPage ? 'page' : undefined}
          aria-label={
            typeof page === 'number' ? `Go to page ${page}` : 'More pages'
          }
        >
          {page}
        </button>
      ))}

      {/* Next — disabled on last page */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => goToPage(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next →
      </Button>
    </div>
  );
}

export default memo(Pagination);