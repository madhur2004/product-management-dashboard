import { useEffect, useRef } from 'react';

/**
 * Reusable text input with label, error state, and shake animation on error.
 * Accepts any extra props via `...rest` (e.g. min, max, step, autoComplete).
 */
export default function FormInput({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  ...rest
}) {
  const inputRef = useRef(null);

  // Re-trigger the shake animation every time the error message changes
  useEffect(() => {
    if (error && inputRef.current) {
      const el = inputRef.current;
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
      <input
        ref={inputRef}
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        // Red border/bg when errored, otherwise gray → primary on focus
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 ${
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