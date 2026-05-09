const variants = {
  primary: 'bg-blue-600 hover:bg-blue-700 text-white',
  secondary: 'bg-slate-600 hover:bg-slate-700 text-white',
  danger: 'bg-red-600 hover:bg-red-700 text-white',
};

export default function Button({
  children,
  variant = 'primary',
  onClick,
  className = '',
  type = 'button',
  disabled = false,
  ...props
}) {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variantClasses = variants[variant] || variants.primary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
