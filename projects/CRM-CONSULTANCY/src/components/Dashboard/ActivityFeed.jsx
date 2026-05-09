import { Clock, UserPlus, Briefcase, CheckCircle, Trash2, Edit3 } from 'lucide-react';

const iconMap = {
  contact_added: UserPlus,
  contact_updated: Edit3,
  contact_deleted: Trash2,
  deal_added: Briefcase,
  deal_updated: Edit3,
  deal_deleted: Trash2,
  deal_stage_changed: Briefcase,
  task_added: CheckCircle,
  task_updated: Edit3,
  task_deleted: Trash2,
  task_toggled: CheckCircle
};

const iconColors = {
  contact_added: 'text-blue-400',
  contact_updated: 'text-amber-400',
  contact_deleted: 'text-rose-400',
  deal_added: 'text-emerald-400',
  deal_updated: 'text-amber-400',
  deal_deleted: 'text-rose-400',
  deal_stage_changed: 'text-blue-400',
  task_added: 'text-emerald-400',
  task_updated: 'text-amber-400',
  task_deleted: 'text-rose-400',
  task_toggled: 'text-emerald-400'
};

function formatTimestamp(timestamp) {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
}

export default function ActivityFeed({ activities }) {
  const recentActivities = activities.slice(0, 5);

  return (
    <div 
      className="rounded-2xl p-6 card-hover animate-card"
      style={{
        background: 'linear-gradient(145deg, rgba(30, 58, 95, 0.8) 0%, rgba(30, 64, 175, 0.6) 50%, rgba(30, 58, 138, 0.8) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-5 h-5 text-blue-300" />
        <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
      </div>

      {recentActivities.length === 0 ? (
        <p className="text-blue-200/70 text-center py-8">No recent activity</p>
      ) : (
        <ul className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = iconMap[activity.type] || Clock;
            const iconColor = iconColors[activity.type] || 'text-blue-400';
            return (
              <li key={activity.id} className="flex items-start gap-3">
                <div 
                  className="p-2 rounded-full flex-shrink-0"
                  style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid rgba(59, 130, 246, 0.2)',
                  }}
                >
                  <Icon className={`w-4 h-4 ${iconColor}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.description}</p>
                  <p className="text-xs text-blue-200/60 mt-1">
                    {formatTimestamp(activity.timestamp)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
