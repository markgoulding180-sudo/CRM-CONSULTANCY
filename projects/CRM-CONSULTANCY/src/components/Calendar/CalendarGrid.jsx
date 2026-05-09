import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DURATION_COLORS = {
  15: 'bg-green-500',
  30: 'bg-blue-500',
  60: 'bg-orange-500',
  90: 'bg-red-500'
};

export default function CalendarGrid({ meetings, contacts, onDayClick, onMeetingClick }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    // First day of the month
    const firstDay = new Date(year, month, 1);
    // Last day of the month
    const lastDay = new Date(year, month + 1, 0);
    
    // Get the day of week for the first day (0 = Sunday, 1 = Monday, etc.)
    // Convert to Monday-based (0 = Monday, 6 = Sunday)
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek < 0) startDayOfWeek = 6;
    
    // Calculate days from previous month
    const daysFromPrevMonth = startDayOfWeek;
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    const days = [];
    
    // Previous month days
    for (let i = daysFromPrevMonth - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime()
      });
    }
    
    // Current month days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({
        date,
        day,
        isCurrentMonth: true,
        isToday: date.getTime() === today.getTime()
      });
    }
    
    // Next month days to fill the grid (42 cells = 6 rows)
    const remainingCells = 42 - days.length;
    for (let day = 1; day <= remainingCells; day++) {
      const date = new Date(year, month + 1, day);
      days.push({
        date,
        day,
        isCurrentMonth: false,
        isToday: date.getTime() === today.getTime()
      });
    }
    
    return days;
  }, [currentDate]);

  const getMeetingsForDay = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return meetings.filter(m => m.date === dateStr);
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(newDate.getMonth() + direction);
      return newDate;
    });
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const monthYearLabel = currentDate.toLocaleDateString('en-GB', {
    month: 'long',
    year: 'numeric'
  });

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown';
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-slate-900 min-w-[180px]">
            {monthYearLabel}
          </h2>
          <div className="flex items-center gap-1">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Previous month"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Next month"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        <button
          onClick={goToToday}
          className="px-3 py-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
        >
          Today
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 border-b border-slate-200">
        {DAYS.map(day => (
          <div
            key={day}
            className="px-2 py-3 text-center text-sm font-medium text-slate-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7">
        {calendarData.map((dayData, index) => {
          const dayMeetings = getMeetingsForDay(dayData.date);
          
          return (
            <div
              key={index}
              onClick={() => onDayClick(dayData.date)}
              className={`
                min-h-[100px] p-2 border-b border-r border-slate-100 cursor-pointer
                transition-colors hover:bg-slate-50
                ${!dayData.isCurrentMonth ? 'bg-slate-50/50 text-slate-400' : 'bg-white'}
                ${dayData.isToday ? 'bg-blue-50/50' : ''}
              `}
            >
              <div className={`
                text-sm font-medium mb-1 w-7 h-7 flex items-center justify-center rounded-full
                ${dayData.isToday ? 'bg-blue-600 text-white' : 'text-slate-700'}
              `}>
                {dayData.day}
              </div>
              
              {/* Meeting chips */}
              <div className="space-y-1">
                {dayMeetings.slice(0, 3).map(meeting => (
                  <div
                    key={meeting.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onMeetingClick?.(meeting);
                    }}
                    className="flex items-center gap-1.5 px-1.5 py-0.5 bg-slate-100 rounded text-xs truncate hover:bg-slate-200 transition-colors"
                    title={`${meeting.time} - ${meeting.title}`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${DURATION_COLORS[meeting.duration] || 'bg-slate-400'}`} />
                    <span className="text-slate-700 truncate">{meeting.title}</span>
                  </div>
                ))}
                {dayMeetings.length > 3 && (
                  <div className="text-xs text-slate-500 px-1.5">
                    +{dayMeetings.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-6 py-3 border-t border-slate-200 flex items-center gap-4 text-xs text-slate-500">
        <span className="font-medium">Duration:</span>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-green-500" />
          <span>15m</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-blue-500" />
          <span>30m</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-orange-500" />
          <span>60m</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span>90m</span>
        </div>
      </div>
    </div>
  );
}
