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
        <label className="block text-sm font-medium text-blue-200 mb-1.5">
          {label}
          {required && <span className="text-rose-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-xl focus:outline-none focus:ring-2 transition-all duration-300 ${
          error
            ? 'border border-rose-500 focus:ring-rose-500/50 text-rose-200 placeholder-rose-400/50 bg-rose-950/30'
            : 'border border-blue-900/50 focus:ring-blue-500/50 focus:border-blue-500/50 text-white placeholder-slate-500 bg-slate-800/50 hover:bg-slate-800'
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-rose-400">{error}</p>
      )}
    </div>
  );
}
