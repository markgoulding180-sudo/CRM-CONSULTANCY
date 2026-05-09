import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import KanbanBoard from '../components/Deals/KanbanBoard';
import DealForm from '../components/Deals/DealForm';
import Button from '../components/UI/Button';
import { useData } from '../context/DataContext';

// Format currency for header stats
const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};

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
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Deals Pipeline</h1>
            <p className="text-slate-600 mt-1">
              Track and manage your sales opportunities
            </p>
          </div>
          <Button onClick={handleAddDeal} className="flex items-center gap-2">
            <Plus size={18} />
            Add Deal
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Total Pipeline</p>
            <p className="text-2xl font-bold text-slate-900">
              {formatCurrency(totalPipelineValue)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Closed Won</p>
            <p className="text-2xl font-bold text-green-600">
              {formatCurrency(closedWonValue)}
            </p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
            <p className="text-sm text-slate-500">Active Deals</p>
            <p className="text-2xl font-bold text-blue-600">{activeDeals}</p>
          </div>
        </div>

        {/* Kanban Board */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <KanbanBoard onEditDeal={handleEditDeal} />
        </div>
      </div>

      {/* Deal Form Modal */}
      <DealForm
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        deal={editingDeal}
      />

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={cancelDelete}
          />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 z-10 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-red-100 rounded-full">
                <Trash2 size={20} className="text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Delete Deal
              </h3>
            </div>
            <p className="text-slate-600 mb-6">
              Are you sure you want to delete "{editingDeal?.name}"? This action
              cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={cancelDelete}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmDelete}>
                Delete Deal
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit mode delete button - shown in modal when editing */}
      {isModalOpen && editingDeal && !showDeleteConfirm && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            variant="danger"
            onClick={handleDeleteClick}
            className="flex items-center gap-2 shadow-lg"
          >
            <Trash2 size={16} />
            Delete Deal
          </Button>
        </div>
      )}
    </Layout>
  );
}
