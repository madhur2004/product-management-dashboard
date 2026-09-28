import { memo, useRef } from 'react';

/**
 * Reusable button with 4 variants (primary, secondary, danger, outline),
 * 3 sizes (sm, md, lg), and a click ripple effect.
 * Wrapped in memo to skip re-renders when props don't change.
 */
const Button = memo(function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  ...props
}) {
  // Used to append the ripple element at the exact click position
  const buttonRef = useRef(null);

  // Shared styles across all variants
  const baseStyles =
    'font-semibold rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden';

  // Color + hover styles per variant
  const variantStyles = {
    primary:
      'bg-blue-500 text-white hover:bg-blue-600 focus:ring-blue-500 active:scale-95',
    secondary:
      'bg-purple-500 text-white hover:bg-purple-600 focus:ring-purple-500 active:scale-95',
    danger:
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500 active:scale-95',
    outline:
      'border-2 border-blue-500 text-blue-500 hover:bg-blue-50 focus:ring-blue-500 active:scale-95',
  };

  // Padding + text size per size option
  const sizeStyles = {
    sm: 'px-3 py-1 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  // Adds a circular ripple animation at the click position, then calls onClick
  const handleClick = (e) => {
    if (disabled) return;

    const button = buttonRef.current;
    if (button) {
      const rect = button.getBoundingClientRect();
      const rippleSize = Math.max(rect.width, rect.height);
      // Click coordinates relative to the button
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Create ripple span and inject it into the button
      const ripple = document.createElement('span');
      ripple.className = 'absolute pointer-events-none';
      ripple.style.width = `${rippleSize}px`;
      ripple.style.height = `${rippleSize}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.borderRadius = '50%';
      ripple.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      ripple.style.animation = 'ripple 0.6s ease-out';

      button.appendChild(ripple);
      // Remove the ripple after the animation completes
      setTimeout(() => ripple.remove(), 600);
    }

    onClick?.(e);
  };

  return (
    <button
      ref={buttonRef}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});

export default Button;