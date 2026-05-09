import { useState } from 'react';
import { Plus, Trash2, DollarSign, CheckCircle, Briefcase } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import KanbanBoard from '../components/Deals/KanbanBoard';
import DealForm from '../components/Deals/DealForm';
import Button from '../components/UI/Button';
import { useData } from '../context/DataContext';

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

// Stat Card Component
function StatCard({ icon: Icon, label, value, color }) {
  const colorStyles = {
    blue: { bg: 'rgba(45,126,247,0.15)', border: 'rgba(45,126,247,0.3)', text: '#5ba3ff' },
    green: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.3)', text: '#10b981' },
    amber: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' },
  };
  const style = colorStyles[color] || colorStyles.blue;

  return (
    <div className="stat-card">
      <div 
        className="stat-icon"
        style={{ 
          background: style.bg, 
          borderColor: style.border,
          color: style.text 
        }}
      >
        <Icon size={18} />
      </div>
      <div className="stat-label">{label}</div>
      <div className="stat-value" style={{ color: style.text }}>{value}</div>
    </div>
  );
}

export default function Deals() {
  const { deals, deleteDeal } = useData();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDeal, setEditingDeal] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Calculate stats
  const totalPipelineValue = deals.reduce((sum, deal) => sum + (deal.value || 0), 0);
  const closedWonValue = deals
    .filter(deal => deal.stage === 'Closed Won')
    .reduce((sum, deal) => sum + (deal.value || 0), 0);
  const activeDeals = deals.filter(deal => deal.stage !== 'Closed Won').length;

  const handleAddDeal = () => {
    setEditingDeal(null);
    setIsModalOpen(true);
  };

  const handleEditDeal = (deal) => {
    setEditingDeal(deal);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingDeal(null);
  };

  const handleDeleteClick = () => {
    if (editingDeal) {
      setShowDeleteConfirm(true);
    }
  };

  const confirmDelete = () => {
    if (editingDeal) {
      deleteDeal(editingDeal.id);
      setShowDeleteConfirm(false);
      setIsModalOpen(false);
      setEditingDeal(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="page-title">Deals Pipeline</h1>
          <p className="page-subtitle">Track and manage your sales opportunities</p>
        </div>
        <Button variant="primary" onClick={handleAddDeal}>
          <Plus size={16} /> Add Deal
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <StatCard 
          icon={DollarSign} 
          label="Total Pipeline" 
          value={formatCurrency(totalPipelineValue)}
          color="blue"
        />
        <StatCard 
          icon={CheckCircle} 
          label="Closed Won" 
          value={formatCurrency(closedWonValue)}
          color="green"
        />
        <StatCard 
          icon={Briefcase} 
          label="Active Deals" 
          value={activeDeals}
          color="amber"
        />
      </div>

      {/* Kanban Board Card */}
      <div className="card" style={{ padding: 'var(--space-4)', minHeight: '500px' }}>
        <KanbanBoard onEditDeal={handleEditDeal} />
      </div>

      {/* Deal Form Modal */}
      <DealForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        deal={editingDeal}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="modal-backdrop" onClick={cancelDelete}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              Delete Deal
              <button onClick={cancelDelete} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <span style={{ fontSize: '20px' }}>×</span>
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                background: 'var(--red-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(239,68,68,0.3)'
              }}>
                <Trash2 size={20} style={{ color: 'var(--red)' }} />
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                Are you sure you want to delete "{editingDeal?.name}"? This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <Button variant="ghost" onClick={cancelDelete}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete Deal</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
