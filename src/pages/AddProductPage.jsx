import { useNavigate } from 'react-router-dom';
import AddProductForm from '../components/forms/AddProductForm';

/**
 * Page wrapper for the Add Product form.
 * Provides a page header with a back button and a card container for the form.
 */
export default function AddProductPage() {
  const navigate = useNavigate();

  return (
    <div className="space-y-8 pb-8">
      {/* Header row: back arrow + page title */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate('/products')}
          className="text-primary hover:text-secondary transition-colors text-2xl leading-none"
          aria-label="Go back to products"
        >
          ←
        </button>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
          ➕ Add New Product
        </h1>
      </div>

      {/* Card wrapper around the form — no width cap so the form uses full space */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-8 animate-scaleUp">
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Fill in the details below to add a new product to the catalog.
        </p>
        <AddProductForm />
      </div>
    </div>
  );
}