import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import MeetingForm from '../components/Calendar/MeetingForm';
import Modal from '../components/UI/Modal';
import Button from '../components/UI/Button';
import { useData } from '../context/DataContext';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DURATION_COLORS = {
  15: '#10b981',
  30: '#2d7ef7',
  60: '#f59e0b',
  90: '#ef4444'
};

// Calendar Day Component
function CalendarDay({ dayData, meetings, onClick, onMeetingClick, getContactName }) {
  const dayMeetings = meetings.filter(m => m.date === dayData.dateStr);
  
  return (
    <div
      onClick={() => onClick(dayData.date)}
      style={{
        minHeight: '100px',
        padding: '8px',
        background: dayData.isToday ? 'rgba(45,126,247,0.1)' : dayData.isCurrentMonth ? 'transparent' : 'rgba(15,23,42,0.5)',
        border: '1px solid var(--border)',
        borderTop: 'none',
        borderLeft: dayData.index % 7 === 0 ? '1px solid var(--border)' : 'none',
        cursor: 'pointer',
        transition: 'background 0.2s',
      }}
      onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-surface-2)'}
      onMouseLeave={(e) => e.currentTarget.style.background = dayData.isToday ? 'rgba(45,126,247,0.1)' : dayData.isCurrentMonth ? 'transparent' : 'rgba(15,23,42,0.5)'}
    >
      <div
        style={{
          width: '28px',
          height: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 600,
          marginBottom: '6px',
          background: dayData.isToday ? 'var(--accent)' : 'transparent',
          color: dayData.isToday ? '#fff' : dayData.isCurrentMonth ? 'var(--text-primary)' : 'var(--text-muted)',
        }}
      >
        {dayData.day}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
        {dayMeetings.slice(0, 2).map(meeting => (
          <div
            key={meeting.id}
            onClick={(e) => {
              e.stopPropagation();
              onMeetingClick?.(meeting);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              padding: '2px 6px',
              background: 'var(--bg-surface-3)',
              borderRadius: '4px',
              fontSize: '11px',
              cursor: 'pointer',
            }}
            title={`${meeting.time} - ${meeting.title} with ${getContactName(meeting.contactId)}`}
          >
            <span
              style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: DURATION_COLORS[meeting.duration] || '#64748b',
                flexShrink: 0,
              }}
            />
            <span style={{ color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {meeting.title}
            </span>
          </div>
        ))}
        {dayMeetings.length > 2 && (
          <div style={{ fontSize: '10px', color: 'var(--text-muted)', paddingLeft: '4px' }}>
            +{dayMeetings.length - 2} more
          </div>
        )}
      </div>
    </div>
  );
}

export default function Calendar() {
  const { meetings, contacts } = useData();
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingMeeting, setEditingMeeting] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate calendar days
  const calendarDays = (() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    let startDayOfWeek = firstDay.getDay() - 1;
    if (startDayOfWeek < 0) startDayOfWeek = 6;
    
    const days = [];
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const day = prevMonthLastDay - i;
      const date = new Date(year, month - 1, day);
      days.push({ date, day, isCurrentMonth: false, isToday: date.getTime() === today.getTime(), dateStr: date.toISOString().split('T')[0], index: days.length });
    }
    
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      days.push({ date, day, isCurrentMonth: true, isToday: date.getTime() === today.getTime(), dateStr: date.toISOString().split('T')[0], index: days.length });
    }
    
    const remaining = 42 - days.length;
    for (let day = 1; day <= remaining; day++) {
      const date = new Date(year, month + 1, day);
      days.push({ date, day, isCurrentMonth: false, isToday: date.getTime() === today.getTime(), dateStr: date.toISOString().split('T')[0], index: days.length });
    }
    
    return days;
  })();

  const upcomingMeetings = meetings
    .filter(m => new Date(m.date) >= today)
    .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
    .slice(0, 5);

  const getContactName = (id) => contacts.find(c => c.id === id)?.name || 'Unknown';

  const formatTime = (time) => {
    const [h, m] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m));
    return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleDayClick = (date) => {
    setSelectedDate(date);
    setEditingMeeting(null);
    setShowModal(true);
  };

  const handleMeetingClick = (meeting) => {
    setEditingMeeting(meeting);
    setSelectedDate(new Date(meeting.date));
    setShowModal(true);
  };

  const monthYearLabel = currentDate.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' });

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="page-title">Calendar</h1>
          <p className="page-subtitle">Schedule and manage your meetings</p>
        </div>
        <Button variant="primary" onClick={() => { setSelectedDate(new Date()); setEditingMeeting(null); setShowModal(true); }}>
          <Plus size={16} /> New Meeting
        </Button>
      </div>

      {/* Main Content */}
      <div className="grid-main-aside">
        {/* Calendar Card */}
        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {/* Calendar Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            padding: '16px 20px',
            borderBottom: '1px solid var(--border)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-primary)', minWidth: '160px' }}>
                {monthYearLabel}
              </h2>
              <div style={{ display: 'flex', gap: '4px' }}>
                <button
                  onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() - 1))}
                  style={{ padding: '6px', background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => setCurrentDate(d => new Date(d.getFullYear(), d.getMonth() + 1))}
                  style={{ padding: '6px', background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
            <button
              onClick={() => setCurrentDate(new Date())}
              style={{ padding: '6px 12px', background: 'var(--bg-surface-2)', border: '1px solid var(--border)', borderRadius: '6px', color: 'var(--text-secondary)', fontSize: '13px', cursor: 'pointer' }}
            >
              Today
            </button>
          </div>

          {/* Day Headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', borderBottom: '1px solid var(--border)' }}>
            {DAYS.map(day => (
              <div key={day} style={{ padding: '12px', textAlign: 'center', fontSize: '12px', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {day}
              </div>
            ))}
          </div>

          {/* Calendar Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)' }}>
            {calendarDays.map((dayData) => (
              <CalendarDay
                key={dayData.index}
                dayData={dayData}
                meetings={meetings}
                onClick={handleDayClick}
                onMeetingClick={handleMeetingClick}
                getContactName={getContactName}
              />
            ))}
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 20px', borderTop: '1px solid var(--border)', fontSize: '12px', color: 'var(--text-secondary)' }}>
            <span style={{ fontWeight: 500 }}>Duration:</span>
            {Object.entries(DURATION_COLORS).map(([duration, color]) => (
              <div key={duration} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
                <span>{duration}m</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Meetings Sidebar */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '16px' }}>Upcoming Meetings</h2>
          {upcomingMeetings.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>No upcoming meetings</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {upcomingMeetings.map(meeting => (
                <div
                  key={meeting.id}
                  onClick={() => handleMeetingClick(meeting)}
                  style={{
                    padding: '12px',
                    background: 'var(--bg-surface-2)',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--border-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: DURATION_COLORS[meeting.duration] || '#64748b',
                      }}
                    />
                    <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent)' }}>
                      {formatTime(meeting.time)}
                    </span>
                    <span className="badge badge-gray" style={{ marginLeft: 'auto' }}>
                      {meeting.duration}m
                    </span>
                  </div>
                  <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500, marginBottom: '2px' }}>
                    {meeting.title}
                  </p>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                    with {getContactName(meeting.contactId)}
                  </p>
                  <p style={{ color: 'var(--text-muted)', fontSize: '11px', marginTop: '4px' }}>
                    {new Date(meeting.date).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Meeting Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => { setShowModal(false); setEditingMeeting(null); }}
        title={editingMeeting ? 'Edit Meeting' : 'New Meeting'}
      >
        <MeetingForm
          onClose={() => { setShowModal(false); setEditingMeeting(null); }}
          initialDate={selectedDate}
          editMeeting={editingMeeting}
        />
      </Modal>
    </Layout>
  );
}
