const variants = {
  lead: 'from-blue-600/30 to-blue-700/30 text-blue-200 border-blue-500/30',
  prospect: 'from-amber-600/30 to-amber-700/30 text-amber-200 border-amber-500/30',
  customer: 'from-emerald-600/30 to-emerald-700/30 text-emerald-200 border-emerald-500/30',
  high: 'from-rose-600/30 to-rose-700/30 text-rose-200 border-rose-500/30',
  medium: 'from-amber-600/30 to-amber-700/30 text-amber-200 border-amber-500/30',
  low: 'from-slate-600/30 to-slate-700/30 text-slate-200 border-slate-500/30',
  draft: 'from-slate-600/30 to-slate-700/30 text-slate-200 border-slate-500/30',
  sent: 'from-blue-600/30 to-blue-700/30 text-blue-200 border-blue-500/30',
  paid: 'from-emerald-600/30 to-emerald-700/30 text-emerald-200 border-emerald-500/30',
  overdue: 'from-rose-600/30 to-rose-700/30 text-rose-200 border-rose-500/30',
};

export default function Badge({ children, variant = 'lead', className = '' }) {
  const baseClasses = 'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-gradient-to-r';
  const variantClasses = variants[variant] || variants.lead;

  return (
    <span className={`${baseClasses} ${variantClasses} ${className}`}>
      {children}
    </span>
  );
}
