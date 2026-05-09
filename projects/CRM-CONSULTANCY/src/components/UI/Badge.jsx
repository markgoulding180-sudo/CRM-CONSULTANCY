const variants = {
  lead: 'bg-blue-100 text-blue-800',
  prospect: 'bg-amber-100 text-amber-800',
  customer: 'bg-green-100 text-green-800',
  high: 'bg-red-100 text-red-800',
  low: 'bg-gray-100 text-gray-800',
};

export default function Badge({ children, variant = 'lead', className = '' }) {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantClasses = variants[variant] || variants.lead;

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
}
