import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Returns true if the given element is a form field where the user
 * is likely typing — so we shouldn't hijack keyboard shortcuts there.
 */
const isEditableElement = (el) => {
  if (!el) return false;
  const tag = el.tagName;
  return (
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    el.isContentEditable
  );
};

/**
 * Global keyboard shortcuts:
 *   Ctrl/Cmd + K  → focus the search input
 *   Escape        → navigate back to /products (when not in a form field)
 */
export const useKeyboardShortcuts = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleKeydown = (e) => {
      // Ctrl/Cmd + K → focus search input
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('search');
        if (searchInput) {
          searchInput.focus();
          // Bring the input into view in case it's off-screen
          searchInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
        return;
      }

      // Escape → go to products list, but skip if:
      //  - user is typing in a form field (let them cancel inputs normally)
      //  - user is already on the products page (nothing to do)
      if (e.key === 'Escape') {
        if (isEditableElement(e.target)) return;
        if (location.pathname === '/products') return;
        navigate('/products');
      }
    };

    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [navigate, location.pathname]);
};