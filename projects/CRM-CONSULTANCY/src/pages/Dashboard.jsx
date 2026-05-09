import { useState } from 'react';
import { Users, Briefcase, PoundSterling, CheckCircle } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import StatCard from '../components/Dashboard/StatCard';
import ActivityFeed from '../components/Dashboard/ActivityFeed';
import QuickActions from '../components/Dashboard/QuickActions';
import { useData } from '../context/DataContext';
import Modal from '../components/Modal';
import ContactForm from '../components/ContactForm';
import DealForm from '../components/DealForm';
import TaskForm from '../components/TaskForm';

export default function Dashboard() {
  const { contacts, deals, tasks, activities } = useData();
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
            icon={CheckCircle}
            title="Tasks Due Today"
            value={tasksDueToday}
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Activity Feed - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <ActivityFeed activities={activities} />
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
