export default function Button({ children, onClick, variant = 'primary', className = '', type = 'button', disabled = false }) {
  const classes = ['btn', `btn-${variant}`, className].join(' ');
  
  return (
    <button type={type} onClick={onClick} disabled={disabled} className={classes}>
      {children}
    </button>
  );
}
