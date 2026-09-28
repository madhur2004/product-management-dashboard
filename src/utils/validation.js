/** Basic email format check — requires an "@" and a dot after it. */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/** Valid price must parse to a number greater than 0. */
export const validatePrice = (price) => {
  const num = parseFloat(price);
  return !isNaN(num) && num > 0;
};

/** Valid stock must parse to a whole number that is not negative. */
export const validateStock = (stock) => {
  const num = parseInt(stock, 10);
  return !isNaN(num) && num >= 0;
};

/** Valid URL — uses the native URL constructor; returns false on any parse error. */
export const validateUrl = (url) => {
  if (!url) return false;
  try {
    new URL(url);
    return true;
  } catch (_) {
    return false;
  }
};

/**
 * Validate all fields of the add-product form.
 * Returns an object of { fieldName: errorMessage } for any invalid field.
 * An empty object means the form is valid.
 */
export const validateProductForm = (formData) => {
  const errors = {};

  // Title is required and cannot be whitespace only
  if (!formData.title?.trim()) {
    errors.title = 'Product name is required';
  }

  // Description is required
  if (!formData.description?.trim()) {
    errors.description = 'Description is required';
  }

  // Category must be selected
  if (!formData.category) {
    errors.category = 'Category is required';
  }

  // Price is required and must be a positive number
  if (!formData.price) {
    errors.price = 'Price is required';
  } else if (!validatePrice(formData.price)) {
    errors.price = 'Price must be greater than 0';
  }

  // Stock is required and must be zero or a positive whole number
  if (formData.stock === '' || formData.stock === undefined) {
    errors.stock = 'Stock quantity is required';
  } else if (!validateStock(formData.stock)) {
    errors.stock = 'Stock cannot be negative';
  }

  // Brand is required and cannot be whitespace only
  if (!formData.brand?.trim()) {
    errors.brand = 'Brand is required';
  }

  // Image URL is required and must be a valid URL
  if (!formData.thumbnail?.trim()) {
    errors.thumbnail = 'Image URL is required';
  } else if (!validateUrl(formData.thumbnail)) {
    errors.thumbnail = 'Please enter a valid image URL';
  }

  return errors;
};