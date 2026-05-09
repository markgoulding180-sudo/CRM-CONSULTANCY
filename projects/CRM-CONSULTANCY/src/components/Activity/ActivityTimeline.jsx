import { useMemo } from 'react';
import { Mail, Phone, FileText, Calendar, Clock } from 'lucide-react';
import { useData } from '../../context/DataContext';

const activityTypeConfig = {
  email: { icon: Mail, label: 'Email', color: 'text-blue-600', bgColor: 'bg-blue-100', borderColor: 'border-blue-200' },
  call: { icon: Phone, label: 'Call', color: 'text-green-600', bgColor: 'bg-green-100', borderColor: 'border-green-200' },
  note: { icon: FileText, label: 'Note', color: 'text-amber-600', bgColor: 'bg-amber-100', borderColor: 'border-amber-200' },
  meeting: { icon: Calendar, label: 'Meeting', color: 'text-purple-600', bgColor: 'bg-purple-100', borderColor: 'border-purple-200' },
};

function formatTime(dateString) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(dateString) {
  const date = new Date(dateString);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  // Reset times for comparison
  const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const yesterdayOnly = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate());
  
  if (dateOnly.getTime() === todayOnly.getTime()) return 'Today';
  if (dateOnly.getTime() === yesterdayOnly.getTime()) return 'Yesterday';
  
  return date.toLocaleDateString('en-GB', { 
    weekday: 'long', 
    day: 'numeric', 
    month: 'long',
    year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
  });
}

function groupActivitiesByDate(activities) {
  const groups = {};
  
  activities.forEach(activity => {
    const dateKey = activity.date;
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(activity);
  });
  
  // Sort dates descending
  return Object.entries(groups)
    .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
    .map(([date, items]) => ({
      date,
      displayDate: formatDate(date),
      activities: items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }));
}

export default function ActivityTimeline({ activities, showContact = true, onEdit, onDelete }) {
  const { contacts } = useData();
  
  const groupedActivities = useMemo(() => {
    return groupActivitiesByDate(activities);
  }, [activities]);

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact?.name || 'Unknown Contact';
  };

  if (activities.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Clock size={32} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">No activities yet</h3>
        <p className="text-slate-500">Log your first activity to start tracking interactions</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groupedActivities.map((group) => (
        <div key={group.date} className="relative">
          {/* Date Header */}
          <div className="sticky top-0 z-10 bg-slate-50/95 backdrop-blur-sm py-2 mb-4">
            <h3 className="text-sm font-semibold text-slate-600 uppercase tracking-wider">
              {group.displayDate}
            </h3>
          </div>
          
          {/* Timeline Items */}
          <div className="relative space-y-4">
            {/* Vertical Line */}
            <div className="absolute left-6 top-0 bottom-0 w-px bg-slate-200" />
            
            {group.activities.map((activity) => {
              const config = activityTypeConfig[activity.type] || activityTypeConfig.note;
              const Icon = config.icon;
              
              return (
                <div key={activity.id} className="relative flex gap-4">
                  {/* Icon */}
                  <div className={`relative z-10 w-12 h-12 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className={config.color} />
                  </div>
                  
                  {/* Content Card */}
                  <div className="flex-1 bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        {/* Header */}
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.color}`}>
                            {config.label}
                          </span>
                          {showContact && (
                            <span className="text-sm text-slate-500">
                              with <span className="font-medium text-slate-700">{getContactName(activity.contactId)}</span>
                            </span>
                          )}
                        </div>
                        
                        {/* Subject */}
                        <h4 className="font-semibold text-slate-900 mb-1">{activity.subject}</h4>
                        
                        {/* Body Preview */}
                        <p className="text-sm text-slate-600 line-clamp-2">{activity.body}</p>
                        
                        {/* Time */}
                        <div className="flex items-center gap-1 mt-2 text-xs text-slate-400">
                          <Clock size={12} />
                          <span>{formatTime(activity.createdAt)}</span>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      {(onEdit || onDelete) && (
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {onEdit && (
                            <button
                              onClick={() => onEdit(activity)}
                              className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                              title="Edit activity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                            </button>
                          )}
                          {onDelete && (
                            <button
                              onClick={() => onDelete(activity)}
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete activity"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
