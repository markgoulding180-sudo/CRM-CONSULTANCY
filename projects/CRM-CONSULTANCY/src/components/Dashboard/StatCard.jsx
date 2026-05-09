import Card from '../UI/Card';

export default function StatCard({ icon: Icon, title, value, change, changeType = 'neutral' }) {
  const changeColorClass = {
    positive: 'text-emerald-400',
    negative: 'text-rose-400',
    neutral: 'text-slate-400'
  }[changeType];

  return (
    <Card className="flex items-center gap-4">
      <div 
        className="p-3 rounded-xl flex-shrink-0"
        style={{
          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(37, 99, 235, 0.2) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
        }}
      >
        <Icon className="w-6 h-6 text-blue-300" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-blue-200/70 truncate">{title}</p>
        <p className="text-2xl font-bold text-white mt-0.5">{value}</p>
        {change && (
          <p className={`text-sm mt-0.5 ${changeColorClass}`}>
            {change}
          </p>
        )}
      </div>
    </Card>
  );
}
