export default function Input({ label, type = 'text', value, onChange, placeholder, error, className = '', required = false }) {
  return (
    <div className={`form-group ${className}`}>
      {label && (
        <label className="form-label">
          {label}
          {required && <span style={{ color: 'var(--red)' }}> *</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`form-input ${error ? 'error' : ''}`}
        style={error ? { borderColor: 'var(--red)' } : {}}
      />
      {error && <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '6px' }}>{error}</p>}
    </div>
  );
}
