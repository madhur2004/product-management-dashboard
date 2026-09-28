import ProductDetails from '../components/products/ProductDetails';

/**
 * Page wrapper for the product details route.
 * All logic lives in the ProductDetails component.
 */
export default function ProductDetailsPage() {
  return (
    <div className="space-y-8">
      <ProductDetails />
    </div>
  );
}