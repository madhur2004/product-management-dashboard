import Header from '../components/common/Header';
import Sidebar from '../components/common/Sidebar';
import Footer from '../components/common/Footer';
import ToastContainer from '../components/ui/ToastContainer';

/**
 * Main layout shell used on all pages.
 * Contains: sticky header, sidebar (fixed), content area, footer, and toasts.
 */
export default function MainLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Top navigation bar */}
      <Header />

      {/* Body row: sidebar + main content side by side */}
      <div className="flex flex-1">
        <Sidebar />

        {/* Main content — left margin on desktop makes room for the fixed sidebar */}
        <main className="flex-1 md:ml-64 pt-4">
          {/* Centered container caps width on large screens */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>

      {/* Site footer */}
      <Footer />

      {/* Fixed container that renders toast notifications */}
      <ToastContainer />
    </div>
  );
}