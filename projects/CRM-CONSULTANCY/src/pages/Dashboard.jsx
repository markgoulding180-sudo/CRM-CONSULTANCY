import { useState } from 'react';
import { Users, Briefcase, PoundSterling, CheckCircle, Calendar, Clock, FileText } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import StatCard from '../components/Dashboard/StatCard';
import ActivityFeed from '../components/Dashboard/ActivityFeed';
import QuickActions from '../components/Dashboard/QuickActions';
import { useData } from '../context/DataContext';
import Modal from '../components/UI/Modal';
import ContactForm from '../components/Contacts/ContactForm';
import DealForm from '../components/Deals/DealForm';
import TaskForm from '../components/Tasks/TaskForm';

export default function Dashboard() {
  const { contacts, deals, tasks, activities, meetings, invoices } = useData();
  const [showContactModal, setShowContactModal] = useState(false);
  const [showDealModal, setShowDealModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);

  // Calculate stats
  const totalContacts = contacts.length;
  
  const openDeals = deals.filter(d => d.stage !== 'Closed Won').length;
  
  const pipelineValue = deals
    .filter(d => d.stage !== 'Closed Won')
    .reduce((sum, d) => sum + (parseFloat(d.value) || 0), 0);
  
  const today = new Date().toISOString().split('T')[0];
  const tasksDueToday = tasks.filter(
    t => !t.done && t.dueDate && t.dueDate <= today
  ).length;

  // Outstanding invoices (sent + overdue)
  const outstandingInvoices = invoices.filter(
    inv => inv.status === 'sent' || inv.status === 'overdue'
  );
  const totalOutstanding = outstandingInvoices.reduce(
    (sum, inv) => sum + (inv.total || 0), 
    0
  );

  // Get today's meetings
  const todaysMeetings = meetings
    .filter(m => m.date === today)
    .sort((a, b) => a.time.localeCompare(b.time));

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

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown';
  };

  // Format currency
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            icon={Users}
            title="Total Contacts"
            value={totalContacts}
          />
          <StatCard
            icon={Briefcase}
            title="Open Deals"
            value={openDeals}
          />
          <StatCard
            icon={PoundSterling}
            title="Pipeline Value"
            value={formatCurrency(pipelineValue)}
          />
          <StatCard
            icon={FileText}
            title="Outstanding Invoices"
            value={formatCurrency(totalOutstanding)}
          />
          <StatCard
            icon={CheckCircle}
            title="Tasks Due Today"
            value={tasksDueToday}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed - Takes up 2 columns */}
          <div className="lg:col-span-2 space-y-6">
            <ActivityFeed activities={activities} />
            
            {/* Today's Meetings Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200">
              <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" />
                  <h2 className="text-lg font-semibold text-slate-900">Today's Meetings</h2>
                </div>
                <span className="text-sm text-slate-500">
                  {todaysMeetings.length} scheduled
                </span>
              </div>
              <div className="p-4">
                {todaysMeetings.length === 0 ? (
                  <div className="text-center py-6">
                    <Calendar className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                    <p className="text-slate-500 text-sm">No meetings today</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {todaysMeetings.map(meeting => (
                      <div
                        key={meeting.id}
                        className="flex items-center gap-4 p-3 rounded-lg bg-slate-50 border border-slate-100"
                      >
                        <div className="flex items-center gap-2 text-slate-600 min-w-[80px]">
                          <Clock size={16} className="text-slate-400" />
                          <span className="text-sm font-medium">
                            {formatTime(meeting.time)}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-slate-900 truncate">
                            {meeting.title}
                          </h3>
                          <p className="text-sm text-slate-500 truncate">
                            with {getContactName(meeting.contactId)}
                          </p>
                        </div>
                        <span className="text-xs text-slate-400 bg-slate-200 px-2 py-1 rounded">
                          {meeting.duration}m
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions - Takes up 1 column */}
          <div className="lg:col-span-1">
            <QuickActions
              onAddContact={() => setShowContactModal(true)}
              onAddDeal={() => setShowDealModal(true)}
              onAddTask={() => setShowTaskModal(true)}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <Modal
        isOpen={showContactModal}
        onClose={() => setShowContactModal(false)}
        title="Add Contact"
      >
        <ContactForm onClose={() => setShowContactModal(false)} />
      </Modal>

      <Modal
        isOpen={showDealModal}
        onClose={() => setShowDealModal(false)}
        title="Add Deal"
      >
        <DealForm onClose={() => setShowDealModal(false)} />
      </Modal>

      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Add Task"
      >
        <TaskForm onClose={() => setShowTaskModal(false)} />
      </Modal>
    </Layout>
  );
}
