import { useState } from 'react';
import { Users, Briefcase, PoundSterling, CheckCircle, Clock, Calendar, Plus } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { useData } from '../context/DataContext';
import Modal from '../components/UI/Modal';
import ContactForm from '../components/Contacts/ContactForm';
import DealForm from '../components/Deals/DealForm';
import TaskForm from '../components/Tasks/TaskForm';

// Stat Card
function StatCard({ icon: Icon, label, value, subtext }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={18} />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value">{value}</div>
      {subtext && <div className="stat-sub">{subtext}</div>}
    </div>
  );
}

// Activity Item
function ActivityItem({ text, time }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--border)' }}>
      <div style={{ 
        width: '32px', 
        height: '32px', 
        borderRadius: '8px', 
        background: 'var(--bg-surface-2)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Clock size={14} style={{ color: 'var(--text-secondary)' }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ color: 'var(--text-primary)', fontSize: '13px', marginBottom: '4px' }}>{text}</p>
        <p style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{time}</p>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { contacts, deals, tasks, activities, meetings } = useData();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Stats
  const totalContacts = contacts.length;
  const openDeals = deals.filter(d => d.stage !== 'Closed Won').length;
  const pipelineValue = deals
    .filter(d => d.stage !== 'Closed Won')
    .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
  const today = new Date().toISOString().split('T')[0];
  const tasksDue = tasks.filter(t => !t.done && t.dueDate && t.dueDate <= today).length;

  // Today's meetings
  const todaysMeetings = meetings
    .filter(m => m.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

  const formatCurrency = (val) => new Intl.NumberFormat('en-GB', {
    style: 'currency', currency: 'GBP', maximumFractionDigits: 0
  }).format(val);

  const formatTime = (time) => {
    const [h, m] = time.split(':');
    const date = new Date();
    date.setHours(parseInt(h), parseInt(m));
    return date.toLocaleTimeString('en-GB', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const getContact = (id) => contacts.find(c => c.id === id)?.name || 'Unknown';

  return (
    <Layout>
      {/* Stats Grid */}
      <div className="grid-4">
        <StatCard icon={Users} label="Total Contacts" value={totalContacts} />
        <StatCard icon={Briefcase} label="Open Deals" value={openDeals} />
        <StatCard icon={PoundSterling} label="Pipeline Value" value={formatCurrency(pipelineValue)} />
        <StatCard icon={CheckCircle} label="Tasks Due" value={tasksDue} subtext="Due today" />
      </div>

      {/* Main Content Grid */}
      <div className="grid-main-aside">
        {/* Left Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          {/* Activity Feed */}
          <div className="card">
            <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
              <h2 className="page-title" style={{ fontSize: '16px' }}>Recent Activity</h2>
            </div>
            {activities.slice(0, 5).map((activity, i) => (
              <ActivityItem 
                key={activity.id || i}
                text={activity.description}
                time={new Date(activity.timestamp).toLocaleDateString()}
              />
            ))}
          </div>

          {/* Today's Meetings */}
          <div className="card">
            <div className="page-header" style={{ marginBottom: 'var(--space-4)' }}>
              <h2 className="page-title" style={{ fontSize: '16px' }}>Today's Meetings</h2>
              <span className="badge badge-blue">{todaysMeetings.length}</span>
            </div>
            {todaysMeetings.length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '24px' }}>
                No meetings scheduled for today
              </p>
            ) : (
              todaysMeetings.map(meeting => (
                <div key={meeting.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '16px', 
                  padding: '12px 0',
                  borderBottom: '1px solid var(--border)'
                }}>
                  <span style={{ color: 'var(--accent)', fontSize: '13px', fontWeight: 600, minWidth: '60px' }}>
                    {formatTime(meeting.time)}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: 500 }}>
                      {meeting.title}
                    </p>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '12px' }}>
                      with {getContact(meeting.contactId)}
                    </p>
                  </div>
                  <span className="badge badge-gray">{meeting.duration}m</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="card" style={{ height: 'fit-content' }}>
          <h2 className="page-title" style={{ fontSize: '16px', marginBottom: 'var(--space-4)' }}>Quick Actions</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            <button className="btn btn-primary" onClick={() => setShowContactModal(true)}>
              <Plus size={16} /> Add Contact
            </button>
            <button className="btn btn-ghost" onClick={() => setShowDealModal(true)}>
              <Plus size={16} /> Add Deal
            </button>
            <button className="btn btn-ghost" onClick={() => setShowTaskModal(true)}>
              <Plus size={16} /> Add Task
            </button>
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal isOpen={showContactModal} onClose={() => setShowContactModal(false)} title="Add Contact">
        <ContactForm onClose={() => setShowContactModal(false)} />
      </Modal>
      <Modal isOpen={showDealModal} onClose={() => setShowDealModal(false)} title="Add Deal">
        <DealForm onClose={() => setShowDealModal(false)} />
      </Modal>
      <Modal isOpen={showTaskModal} onClose={() => setShowTaskModal(false)} title="Add Task">
        <TaskForm onClose={() => setShowTaskModal(false)} />
      </Modal>
    </Layout>
  );
}
