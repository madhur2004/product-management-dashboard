import { useEffect, useState } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

/**
 * Sidebar navigation.
 * Desktop: transparent sidebar fixed below the header.
 * Mobile: full-height drawer with backdrop, opens from a floating button.
 */
export default function Sidebar() {
  const { isLoggedIn, user, signout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close the mobile drawer whenever the route changes
  useEffect(() => {
    setIsOpen(false);
  }, [location.pathname]);

  // While drawer is open: close on Escape + lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Nav groups — items with requiresAuth are hidden for guests
  const navSections = [
    {
      title: 'Catalog',
      items: [
        { label: 'Products', path: '/products', icon: '📦' },
        { label: 'Add Product', path: '/add-product', icon: '➕' },
      ],
    },
    {
      title: 'Account',
      items: [
        {
          label: 'Wishlist',
          path: '/wishlist',
          icon: '❤️',
          requiresAuth: true,
        },
      ],
    },
  ];

  // Active link styling — different bg/text for active vs inactive
  const linkClass = ({ isActive }) =>
    [
      'relative flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium',
      'transition-colors duration-150',
      isActive
        ? 'bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary-light'
        : 'text-gray-700 hover:bg-gray-100/70 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white',
    ].join(' ');

  return (
    <>
      {/* Floating button to open drawer on mobile */}
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 md:hidden bg-primary text-white p-4 rounded-full shadow-lg hover:bg-secondary transition-colors z-40"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
      >
        ☰
      </button>

      {/* Dark overlay behind the drawer — click to close */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 md:hidden z-40"
          onClick={() => setIsOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar / drawer */}
      <aside
        className={[
          'fixed left-0 w-64 flex flex-col z-30',
          // Mobile: solid bg so the drawer is readable
          // Desktop: transparent so it blends with the page
          'bg-white dark:bg-gray-900',
          'md:bg-transparent md:dark:bg-transparent',
          'transform transition-transform duration-300',
          // Mobile: full-height drawer
          'top-0 bottom-0',
          isOpen ? 'translate-x-0' : '-translate-x-full',
          // Desktop: fixed under header, shorter height, always visible
          'md:translate-x-0 md:top-[72px] md:h-[calc(100vh-160px)]',
        ].join(' ')}
        aria-label="Sidebar navigation"
      >
        {/* Mobile-only drawer header with close button */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 rounded-t-2xl">
          <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
            Menu
          </span>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
            aria-label="Close navigation menu"
          >
            ✕
          </button>
        </div>

        {/* Nav sections — scrollable if content grows */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-4">
          {navSections.map((section) => {
            // Skip items that require auth if user is not logged in
            const visibleItems = section.items.filter(
              (item) => !item.requiresAuth || isLoggedIn
            );
            if (visibleItems.length === 0) return null;

            return (
              <div key={section.title}>
                <p className="px-3 mb-1.5 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                  {section.title}
                </p>
                <ul className="space-y-1">
                  {visibleItems.map((item) => (
                    <li key={item.path}>
                      <NavLink
                        to={item.path}
                        // `end` prevents /products from matching /products/add
                        end={item.path === '/products'}
                        className={linkClass}
                      >
                        {({ isActive }) => (
                          <>
                            {/* Left accent bar on the active link */}
                            {isActive && (
                              <span
                                className="absolute left-0 top-1.5 bottom-1.5 w-1 rounded-r-full bg-primary"
                                aria-hidden="true"
                              />
                            )}
                            <span aria-hidden="true">{item.icon}</span>
                            <span>{item.label}</span>
                          </>
                        )}
                      </NavLink>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>

        {/* Bottom area — user info + sign out, or sign in link */}
        <div className="p-2">
          {isLoggedIn ? (
            <div className="space-y-1.5">
              <div className="px-3 py-2">
                <p className="text-[11px] text-gray-500 dark:text-gray-400">
                  Signed in as
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {user?.name || 'User'}
                </p>
              </div>
              <button
                type="button"
                onClick={signout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="block w-full text-center px-3 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-secondary transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}