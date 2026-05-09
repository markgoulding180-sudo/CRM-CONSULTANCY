import { Card } from '../ui/Card';

export default function StatCard({ icon: Icon, title, value, change, changeType = 'neutral' }) {
  const changeColorClass = {
    positive: 'text-green-600',
    negative: 'text-red-600',
    neutral: 'text-gray-500'
  }[changeType];

  return (
    <Card className="flex items-start space-x-4">
      <div className="p-3 bg-blue-50 rounded-lg">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${changeColorClass}`}>
            {change}
          </p>
        )}
      </div>
    </Card>
  );
}
