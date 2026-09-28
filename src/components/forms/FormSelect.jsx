/**
 * Reusable select dropdown with label and error state.
 * Options can be strings or `{ value, label }` objects.
 */
export default function FormSelect({
  label,
  id,
  name,
  value,
  onChange,
  error,
  options,
  required = false,
  disabled = false,
  ...rest
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-700">
          {label}
          {/* Red asterisk marks required fields */}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        // Red styling on error, otherwise gray → primary on focus
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all bg-white ${
          error
            ? 'border-red-500 bg-red-50'
            : 'border-gray-300 focus:border-primary'
        } disabled:bg-gray-100 disabled:cursor-not-allowed`}
        {...rest}
      >
        {/* Placeholder option — forces user to pick a real value */}
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-sm text-red-600 animate-slideDown">{error}</p>
      )}
    </div>
  );
}