import { useState } from 'react';
import { Users, Briefcase, PoundSterling, CheckCircle, FileText, Clock, Calendar } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import { useData } from '../context/DataContext';
import Modal from '../components/UI/Modal';
import ContactForm from '../components/Contacts/ContactForm';
import DealForm from '../components/Deals/DealForm';
import TaskForm from '../components/Tasks/TaskForm';

// Stat Card Component - follows .card exactly
function StatCard({ icon: Icon, label, value }) {
  return (
    <div className="card flex items-center gap-4">
      <div className="w-12 h-12 rounded-lg bg-blue-600/20 flex items-center justify-center flex-shrink-0">
        <Icon className="text-blue-400" size={24} />
      </div>
      <div className="min-w-0">
        <p className="text-slate-400 text-sm">{label}</p>
        <p className="text-white text-2xl font-bold truncate">{value}</p>
      </div>
    </div>
  );
}

// Activity Item Component
function ActivityItem({ icon: Icon, text, time }) {
  return (
    <div className="flex items-start gap-3 py-3 border-b border-white/5 last:border-0">
      <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center flex-shrink-0">
        <Icon className="text-slate-400" size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm">{text}</p>
        <p className="text-slate-500 text-xs mt-1">{time}</p>
      </div>
    </div>
  );
}

// Quick Action Button
function ActionButton({ icon: Icon, label, onClick }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-700 hover:bg-slate-600 transition-colors text-left"
    >
      <Icon className="text-blue-400" size={20} />
      <span className="text-white font-medium">{label}</span>
    </button>
  );
}

export default function Dashboard() {
  const { contacts, deals, tasks, activities, meetings, invoices } = useData();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Stats calculations
  const totalContacts = contacts.length;
  const openDeals = deals.filter(d => d.stage !== 'Closed Won').length;
  const pipelineValue = deals
    .filter(d => d.stage !== 'Closed Won')
    .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
  const outstandingInvoices = invoices
    .filter(inv => inv.status === 'sent' || inv.status === 'overdue')
    .reduce((sum, inv) => sum + (inv.total || 0), 0);
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
      {/* Stats Grid - 4 columns */}
      <div className="stats-grid">
        <StatCard icon={Users} label="Contacts" value={totalContacts} />
        <StatCard icon={Briefcase} label="Open Deals" value={openDeals} />
        <StatCard icon={PoundSterling} label="Pipeline" value={formatCurrency(pipelineValue)} />
        <StatCard icon={CheckCircle} label="Tasks Due" value={tasksDue} />
      </div>

      {/* Bottom Section - Activity + Sidebar */}
      <div className="dashboard-bottom">
        {/* Left Column - Activity & Meetings */}
        <div className="flex flex-col gap-6">
          {/* Activity Feed */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="text-blue-400" size={20} />
              <h2 className="text-white text-lg font-semibold">Recent Activity</h2>
            </div>
            {activities.slice(0, 5).map(activity => (
              <ActivityItem 
                key={activity.id}
                icon={FileText}
                text={activity.description}
                time={new Date(activity.timestamp).toLocaleDateString()}
              />
            ))}
          </div>

          {/* Today's Meetings */}
          <div className="card">
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="text-blue-400" size={20} />
              <h2 className="text-white text-lg font-semibold">Today's Meetings</h2>
              <span className="ml-auto text-slate-400 text-sm">{todaysMeetings.length}</span>
            </div>
            {todaysMeetings.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No meetings today</p>
            ) : (
              todaysMeetings.map(meeting => (
                <div key={meeting.id} className="flex items-center gap-4 py-3 border-b border-white/5 last:border-0">
                  <div className="text-blue-400 text-sm font-medium min-w-[60px]">
                    {formatTime(meeting.time)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm truncate">{meeting.title}</p>
                    <p className="text-slate-500 text-xs">with {getContact(meeting.contactId)}</p>
                  </div>
                  <span className="text-slate-400 text-xs bg-slate-700 px-2 py-1 rounded">
                    {meeting.duration}m
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Quick Actions */}
        <div className="card">
          <h2 className="text-white text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="flex flex-col gap-3">
            <ActionButton icon={Users} label="Add Contact" onClick={() => setShowContactModal(true)} />
            <ActionButton icon={Briefcase} label="Add Deal" onClick={() => setShowDealModal(true)} />
            <ActionButton icon={CheckCircle} label="Add Task" onClick={() => setShowTaskModal(true)} />
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
