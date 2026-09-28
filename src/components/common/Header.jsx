import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useWishlist } from '../../hooks/useWishlist';
import { useTheme } from '../../hooks/useTheme';
import Button from '../ui/Button';

/* Inline SVG icons — no external icon library needed.
   All icons use `currentColor` so they inherit text color. */

const PackageIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M16.5 9.4 7.55 4.24" />
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);

// Filled prop controls whether heart is solid (in wishlist) or outline
const HeartIcon = ({ size = 16, filled = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
);

const UserIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LogOutIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

const SunIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
  </svg>
);

const MoonIcon = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const MenuIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="3" y1="12" x2="21" y2="12" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <line x1="3" y1="18" x2="21" y2="18" />
  </svg>
);

const XIcon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/* Sticky header with logo, desktop nav, mobile drawer, wishlist badge,
   user info, and dark-mode toggle. */

export default function Header() {
  const { isDarkMode, toggle } = useTheme();
  const { isLoggedIn, user, signout } = useAuth();
  const { items } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => setIsMobileMenuOpen((v) => !v);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const wishlistCount = items.length;

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo — always links to home */}
          <Link
            to="/"
            className="flex items-center gap-2 text-lg font-bold text-primary hover:text-secondary transition-colors"
          >
            <PackageIcon size={22} />
            <span>Product Hub</span>
          </Link>

          {/* Desktop navigation — hidden on mobile */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/products"
              className="px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors"
            >
              Products
            </Link>

            {/* Wishlist + user info — only shown when logged in */}
            {isLoggedIn && (
              <>
                <Link
                  to="/wishlist"
                  className="relative px-3 py-2 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-primary transition-colors flex items-center gap-2"
                  aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} items` : ''}`}
                >
                  <HeartIcon size={16} filled={wishlistCount > 0} />
                  <span>Wishlist</span>
                  {/* Count badge — caps at "99+" to avoid layout break */}
                  {wishlistCount > 0 && (
                    <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold tabular-nums">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </Link>

                <div className="flex items-center gap-2 pl-3 ml-2 border-l border-gray-200 dark:border-gray-700">
                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <UserIcon size={16} />
                    <span className="max-w-[140px] truncate">
                      {user?.name || 'User'}
                    </span>
                  </div>
                  <Button onClick={signout} variant="outline" size="sm">
                    <span className="flex items-center gap-1.5">
                      <LogOutIcon size={14} />
                      <span>Sign Out</span>
                    </span>
                  </Button>
                </div>
              </>
            )}

            {/* Auth buttons — shown when logged out */}
            {!isLoggedIn && (
              <div className="flex items-center gap-2 pl-3 ml-2 border-l border-gray-200 dark:border-gray-700">
                <Link to="/auth/login">
                  <Button variant="primary" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/signup">
                  <Button variant="outline" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}

            {/* Dark / light mode toggle */}
            <button
              type="button"
              onClick={toggle}
              className="ml-2 p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDarkMode ? 'Light mode' : 'Dark mode'}
            >
              {isDarkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>
          </nav>

          {/* Mobile: theme toggle + hamburger menu */}
          <div className="md:hidden flex items-center gap-1">
            <button
              type="button"
              onClick={toggle}
              className="p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDarkMode ? <SunIcon size={18} /> : <MoonIcon size={18} />}
            </button>
            <button
              type="button"
              onClick={toggleMobileMenu}
              className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <XIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown nav — opens below header on small screens */}
        {isMobileMenuOpen && (
          <nav className="md:hidden pb-4 border-t border-gray-100 dark:border-gray-800 pt-3 animate-slideDown space-y-1">
            <Link
              to="/products"
              onClick={closeMobileMenu}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <PackageIcon size={16} />
              <span>Products</span>
            </Link>

            {isLoggedIn && (
              <>
                <Link
                  to="/wishlist"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <HeartIcon size={16} filled={wishlistCount > 0} />
                  <span>Wishlist</span>
                  {wishlistCount > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-bold tabular-nums">
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </Link>

                <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-600 dark:text-gray-400">
                  <UserIcon size={16} />
                  <span className="truncate">{user?.name || 'User'}</span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    signout();
                    closeMobileMenu();
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                >
                  <LogOutIcon size={16} />
                  <span>Sign Out</span>
                </button>
              </>
            )}

            {!isLoggedIn && (
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link to="/auth/login" onClick={closeMobileMenu}>
                  <Button variant="primary" size="md" className="w-full">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth/signup" onClick={closeMobileMenu}>
                  <Button variant="outline" size="md" className="w-full">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  );
}