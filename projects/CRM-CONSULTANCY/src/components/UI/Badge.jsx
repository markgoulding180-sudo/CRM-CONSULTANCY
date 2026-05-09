export default function Badge({ children, variant = 'blue', className = '' }) {
  const classes = ['badge', `badge-${variant}`, className].join(' ');
  
  return (
    <span className={classes}>
      {children}
    </span>
  );
}
