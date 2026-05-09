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
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center space-x-2 mb-4">
        <Clock className="w-5 h-5 text-blue-600" />
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>

      {recentActivities.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No recent activity</p>
      ) : (
        <ul className="space-y-4">
          {recentActivities.map((activity) => {
            const Icon = iconMap[activity.type] || Clock;
            return (
              <li key={activity.id} className="flex items-start space-x-3">
                <div className="p-2 bg-gray-100 rounded-full flex-shrink-0">
                  <Icon className="w-4 h-4 text-gray-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-800">{activity.description}</p>
                  <p className="text-xs text-gray-500 mt-1">
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
