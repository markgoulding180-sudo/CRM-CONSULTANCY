import { useMemo } from 'react';
import { Calendar, Clock, User } from 'lucide-react';
import { useData } from '../../context/DataContext';

const DURATION_LABELS = {
  15: '15m',
  30: '30m',
  60: '1h',
  90: '1.5h'
};

export default function UpcomingMeetings({ onMeetingClick }) {
  const { meetings, contacts } = useData();

  const upcomingMeetings = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    return meetings
      .filter(meeting => {
        const meetingDate = new Date(meeting.date);
        meetingDate.setHours(0, 0, 0, 0);
        return meetingDate >= today && meetingDate <= nextWeek;
      })
      .sort((a, b) => {
        // Sort by date first
        const dateCompare = new Date(a.date) - new Date(b.date);
        if (dateCompare !== 0) return dateCompare;
        // Then by time
        return a.time.localeCompare(b.time);
      });
  }, [meetings]);

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown';
  };

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const dateWithoutTime = new Date(dateStr);
    dateWithoutTime.setHours(0, 0, 0, 0);
    
    if (dateWithoutTime.getTime() === today.getTime()) {
      return 'Today';
    } else if (dateWithoutTime.getTime() === tomorrow.getTime()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-GB', {
        weekday: 'short',
        day: 'numeric',
        month: 'short'
      });
    }
  };

  const formatTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(':');
    const date = new Date();
    date.setHours(parseInt(hours), parseInt(minutes));
    return date.toLocaleTimeString('en-GB', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 h-full">
      <div className="px-6 py-4 border-b border-slate-200">
        <h2 className="text-lg font-semibold text-slate-900">Upcoming Meetings</h2>
        <p className="text-sm text-slate-500 mt-1">Next 7 days</p>
      </div>

      <div className="p-4">
        {upcomingMeetings.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">No meetings scheduled</p>
            <p className="text-slate-400 text-xs mt-1">for the next 7 days</p>
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingMeetings.map(meeting => (
              <div
                key={meeting.id}
                onClick={() => onMeetingClick?.(meeting)}
                className="p-3 rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 cursor-pointer transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-slate-900 truncate">
                      {meeting.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-2 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar size={14} className="text-slate-400" />
                        {formatDate(meeting.date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={14} className="text-slate-400" />
                        {formatTime(meeting.time)}
                        <span className="text-slate-400">({DURATION_LABELS[meeting.duration]})</span>
                      </span>
                    </div>
                    <div className="flex items-center gap-1 mt-2 text-sm text-slate-500">
                      <User size={14} className="text-slate-400" />
                      <span className="truncate">{getContactName(meeting.contactId)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
