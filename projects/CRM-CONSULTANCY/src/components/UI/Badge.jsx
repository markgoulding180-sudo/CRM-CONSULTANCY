export default function Badge({ children, variant = 'blue', className = '' }) {
  const colors = {
    blue: 'bg-blue-600/20 text-blue-400 border-blue-600/30',
    green: 'bg-emerald-600/20 text-emerald-400 border-emerald-600/30',
    amber: 'bg-amber-600/20 text-amber-400 border-amber-600/30',
    red: 'bg-red-600/20 text-red-400 border-red-600/30',
    slate: 'bg-slate-600/20 text-slate-400 border-slate-600/30',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${colors[variant] || colors.blue} ${className}`}>
      {children}
    </span>
  );
}
