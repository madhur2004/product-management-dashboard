import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

/**
 * 404 page — shown when the user hits a route that doesn't exist.
 * Full-screen centered message with a button back to the products list.
 */
export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex flex-col items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
        <p className="text-2xl text-gray-600 mb-8">Page Not Found</p>
        {/* Only real action — send the user back to the main listing */}
        <Link to="/products">
          <Button variant="primary" size="lg">
            Back to Products
          </Button>
        </Link>
      </div>
    </div>
  );
}