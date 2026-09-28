import { useEffect, useRef } from 'react';

/**
 * Reusable textarea with label, error state, and shake animation on error.
 * Accepts any extra props via `...rest` (e.g. maxLength, autoComplete).
 */
export default function FormTextarea({
  label,
  id,
  name,
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  rows = 4,
  ...rest
}) {
  const textareaRef = useRef(null);

  // Re-trigger shake animation every time the error message changes
  useEffect(() => {
    if (error && textareaRef.current) {
      const el = textareaRef.current;
      el.classList.remove('animate-shake');
      void el.offsetWidth; // force reflow so the class re-applies
      el.classList.add('animate-shake');
    }
  }, [error]);

  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {/* Red asterisk marks required fields */}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        rows={rows}
        // resize-none keeps the layout stable; red styling on error
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 resize-none ${
          error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 focus:border-primary'
        } disabled:bg-gray-100 disabled:cursor-not-allowed`}
        {...rest}
      />
      {error && (
        <p className="text-sm text-red-600 animate-slideDown">{error}</p>
      )}
    </div>
  );
}