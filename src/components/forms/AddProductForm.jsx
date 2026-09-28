import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '../../hooks/useProducts';
import { useNotification } from '../../hooks/useNotification';
import FormInput from './FormInput';
import FormTextarea from './FormTextarea';
import FormSelect from './FormSelect';
import Button from '../ui/Button';
import { CATEGORIES } from '../../utils/constants';
import { validateProductForm, validateUrl } from '../../utils/validation';

// Empty state used to reset the form
const initialFormData = {
  title: '',
  description: '',
  category: '',
  price: '',
  stock: '',
  brand: '',
  thumbnail: '',
};

/** Reusable section heading with icon + title + subtitle. */
function SectionHeader({ icon, title, subtitle }) {
  return (
    <div className="flex items-start gap-3 mb-5">
      <div className="flex-shrink-0 w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-lg">
        <span aria-hidden="true">{icon}</span>
      </div>
      <div className="min-w-0">
        <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
          {title}
        </h2>
        {subtitle && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}

/** Live preview card that mirrors what the user is typing. */
function LivePreview({ data }) {
  const [imgFailed, setImgFailed] = useState(false);

  // Fallback text when a field is still empty
  const title = data.title?.trim() || 'Product name';
  const brand = data.brand?.trim() || 'Brand';
  const category = data.category?.trim() || 'Category';

  // Only show the image if the URL is valid and hasn't failed to load
  const hasImage =
    data.thumbnail && validateUrl(data.thumbnail) && !imgFailed;

  const numericPrice = parseFloat(data.price);
  const displayPrice =
    Number.isFinite(numericPrice) && numericPrice > 0
      ? `$${numericPrice.toFixed(2)}`
      : '—';

  // Stock badge changes color based on quantity
  const numericStock = parseInt(data.stock, 10);
  let stockLabel = 'Stock —';
  let stockClass =
    'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-300';
  if (Number.isFinite(numericStock)) {
    if (numericStock === 0) {
      stockLabel = 'Out of Stock';
      stockClass =
        'bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400';
    } else if (numericStock < 10) {
      stockLabel = `Only ${numericStock} left`;
      stockClass =
        'bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400';
    } else {
      stockLabel = `In Stock (${numericStock})`;
      stockClass =
        'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400';
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden shadow-sm">
      <div className="px-5 pt-5 pb-3">
        <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
          Live preview
        </p>
      </div>

      {/* Image area — fixed height so card doesn't jump when image loads */}
      <div className="h-64 bg-gray-50 dark:bg-gray-900 border-y border-gray-200 dark:border-gray-700 flex items-center justify-center overflow-hidden">
        {hasImage ? (
          <img
            src={data.thumbnail}
            alt="Product preview"
            className="w-full h-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-gray-400 dark:text-gray-600">
            <span className="text-3xl" aria-hidden="true">
              🖼️
            </span>
            <span className="text-xs">No image</span>
          </div>
        )}
      </div>

      {/* Preview info — mirrors a product card */}
      <div className="p-5 space-y-3">
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 capitalize">
            {category}
          </span>
          <span className="inline-block px-2 py-0.5 rounded-md text-[11px] font-medium bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300">
            {brand}
          </span>
        </div>

        <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100 line-clamp-2 leading-snug">
          {title}
        </h3>

        {data.description?.trim() && (
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {data.description}
          </p>
        )}

        <div className="flex items-center justify-between gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
          <span className="text-lg font-bold text-gray-900 dark:text-white tabular-nums">
            {displayPrice}
          </span>
          <span
            className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-medium ${stockClass}`}
          >
            {stockLabel}
          </span>
        </div>
      </div>
    </div>
  );
}

/**
 * Add-product form.
 * Validates locally, POSTs to DummyJSON, then stores the product
 * in Redux (session-only — DummyJSON does not persist additions).
 */
export default function AddProductForm() {
  const navigate = useNavigate();
  const { addProduct } = useProducts();
  const { success, error: notifyError } = useNotification();

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Update field value and clear its error as soon as user types
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    // Client-side validation before hitting the API
    const newErrors = validateProductForm(formData);
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      notifyError('Please fix the errors below');
      return;
    }

    setLoading(true);

    try {
      // Build the request body from trimmed form values
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock, 10),
        brand: formData.brand.trim(),
        thumbnail: formData.thumbnail.trim(),
      };

      const res = await fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const created = await res.json();

      // DummyJSON returns its own id + normalized fields.
      // We keep the user's exact values where it matters for display.
      const productToAdd = {
        ...created,
        title: payload.title,
        description: payload.description,
        category: payload.category,
        brand: payload.brand,
        price: payload.price,
        stock: payload.stock,
        thumbnail: payload.thumbnail,
        images: [payload.thumbnail],
        rating: created.rating ?? 0,
        discountPercentage: created.discountPercentage ?? 0,
      };

      // Add to Redux so the listing shows it immediately
      addProduct(productToAdd);
      success('Product added successfully! Redirecting...');

      // Short delay so the toast is visible before navigating
      setTimeout(() => {
        navigate('/products');
      }, 1200);
    } catch (err) {
      notifyError(
        err?.message
          ? `Failed to add product: ${err.message}`
          : 'Failed to add product. Please try again.'
      );
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (loading) return;
    navigate('/products');
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* Two-column layout on large screens; stacks on mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_360px] gap-6 lg:gap-8">
        {/* LEFT — form sections */}
        <div className="space-y-6 min-w-0">
          {/* Section 1: Basic Information */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <SectionHeader
              icon="📝"
              title="Basic Information"
              subtitle="Name, brand and category of the product"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Product Name"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
                placeholder="e.g. Acer Aspire 7"
                required
                disabled={loading}
              />

              <FormInput
                label="Brand"
                id="brand"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                error={errors.brand}
                placeholder="e.g. Apple, Samsung"
                required
                disabled={loading}
              />

              {/* Category spans full width */}
              <div className="md:col-span-2">
                <FormSelect
                  label="Category"
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  error={errors.category}
                  options={CATEGORIES.filter((c) => c !== 'All')}
                  required
                  disabled={loading}
                />
              </div>

              <div className="md:col-span-2">
                <FormTextarea
                  label="Description"
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  error={errors.description}
                  placeholder="Describe the product, its key features, and what makes it stand out..."
                  rows={5}
                  required
                  disabled={loading}
                />
              </div>
            </div>
          </section>

          {/* Section 2: Pricing & Inventory */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <SectionHeader
              icon="💰"
              title="Pricing & Inventory"
              subtitle="Set the selling price and available stock"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <FormInput
                label="Price (USD)"
                id="price"
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                error={errors.price}
                placeholder="0.00"
                step="0.01"
                min="0"
                required
                disabled={loading}
              />

              <FormInput
                label="Stock Quantity"
                id="stock"
                name="stock"
                type="number"
                value={formData.stock}
                onChange={handleChange}
                error={errors.stock}
                placeholder="0"
                min="0"
                required
                disabled={loading}
              />
            </div>
          </section>

          {/* Section 3: Product Image */}
          <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-6 shadow-sm">
            <SectionHeader
              icon="🖼️"
              title="Product Image"
              subtitle="Paste a direct link to the product image"
            />

            <FormInput
              label="Image URL"
              id="thumbnail"
              name="thumbnail"
              value={formData.thumbnail}
              onChange={handleChange}
              error={errors.thumbnail}
              placeholder="https://example.com/image.jpg"
              required
              disabled={loading}
            />
          </section>

          {/* Cancel + Submit — stack on mobile, right-aligned on desktop */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              size="lg"
              onClick={handleCancel}
              disabled={loading}
              className="sm:w-32"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="sm:w-48 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  {/* Spinner shown while POST is in flight */}
                  <span className="inline-block w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <span aria-hidden="true">✓</span>
                  <span>Add Product</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* RIGHT — sticky live preview (desktop only) */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <LivePreview data={formData} />
          <p className="mt-3 text-xs text-center text-gray-400 dark:text-gray-500">
            Updates as you type
          </p>
        </aside>
      </div>
    </form>
  );
}