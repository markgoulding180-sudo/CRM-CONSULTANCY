export default function Input({ label, type = 'text', value, onChange, placeholder, error, className = '', required = false }) {
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label className="block text-slate-400 text-sm mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full px-4 py-2.5 rounded-lg bg-slate-800 border text-white placeholder-slate-500 outline-none transition-colors ${
          error ? 'border-red-500' : 'border-slate-700 focus:border-blue-500'
        }`}
      />
      {error && <p className="text-red-400 text-sm mt-1.5">{error}</p>}
    </div>
  );
}
