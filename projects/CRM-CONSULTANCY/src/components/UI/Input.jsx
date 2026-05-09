export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
          error
            ? 'border-red-500 focus:ring-red-500 text-red-900 placeholder-red-300'
            : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
