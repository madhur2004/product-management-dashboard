import { lazy, Suspense } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './store';
import MainLayout from './layouts/MainLayout';
import Header from './components/common/Header';
import ProtectedRoute from './components/common/ProtectedRoute';
import Auth from './pages/Auth';
import NotFound from './pages/NotFound';
import LoadingSpinner from './components/states/LoadingSpinner';
import { useTheme } from './hooks/useTheme';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import './index.css';

// Lazy-loaded pages — split into separate bundles so the initial load is smaller.
// Only Auth and NotFound are imported eagerly since they're needed early.
const ProductListing = lazy(() => import('./pages/ProductListing'));
const ProductDetailsPage = lazy(() => import('./pages/ProductDetailsPage'));
const AddProductPage = lazy(() => import('./pages/AddProductPage'));
const WishlistPage = lazy(() => import('./pages/WishlistPage'));

/** Small bridge component so keyboard shortcuts hook can live inside the Router. */
function KeyboardShortcutsBridge() {
  useKeyboardShortcuts();
  return null;
}

/**
 * Renders the route tree with theme wrapper, fade animation on route change,
 * and Suspense for lazy-loaded pages.
 */
function ThemedRoutes() {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  return (
    // `dark` class drives Tailwind's dark: variants across the app
    <div className={isDarkMode ? 'dark' : ''}>
      <KeyboardShortcutsBridge />

      {/* key={location.pathname} re-mounts the wrapper on route change → fade animation re-runs */}
      <div key={location.pathname} className="animate-fadeIn">
        {/* Fallback shown while a lazy-loaded page chunk is downloading */}
        <Suspense fallback={<LoadingSpinner />}>
          <Routes location={location}>
            {/* ── Auth routes (share the same Auth component) ── */}
            <Route
              path="/auth/login"
              element={
                <>
                  <Header />
                  <Auth />
                </>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <>
                  <Header />
                  <Auth />
                </>
              }
            />

            {/* ── Main routes (wrapped in MainLayout: header + sidebar + footer) ── */}
            <Route
              path="/products"
              element={
                <MainLayout>
                  <ProductListing />
                </MainLayout>
              }
            />
            <Route
              path="/products/:id"
              element={
                <MainLayout>
                  <ProductDetailsPage />
                </MainLayout>
              }
            />

            {/* Protected routes — redirect to login if the user is not authenticated */}
            <Route
              path="/add-product"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <AddProductPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            <Route
              path="/wishlist"
              element={
                <ProtectedRoute>
                  <MainLayout>
                    <WishlistPage />
                  </MainLayout>
                </ProtectedRoute>
              }
            />

            {/* Redirect root to the products listing */}
            <Route path="/" element={<Navigate to="/products" replace />} />

            {/* Catch-all 404 — kept inside MainLayout so the user still has navigation */}
            <Route
              path="*"
              element={
                <MainLayout>
                  <NotFound />
                </MainLayout>
              }
            />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

/** Root component — wires up Redux store and the router. */
export default function App() {
  return (
    <Provider store={store}>
      <Router>
        <ThemedRoutes />
      </Router>
    </Provider>
  );
}