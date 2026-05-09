import { useState, useMemo } from 'react';
import { Plus, Filter, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';
import Layout from '../components/Layout/Layout';
import ActivityTimeline from '../components/Activity/ActivityTimeline';
import ActivityForm from '../components/Activity/ActivityForm';
import Button from '../components/UI/Button';

export default function Activity() {
  const { contacts, contactActivities, addContactActivity, updateContactActivity, deleteContactActivity } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [filterContactId, setFilterContactId] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter activities by contact
  const filteredActivities = useMemo(() => {
    if (!filterContactId) return contactActivities;
    return contactActivities.filter(a => a.contactId === filterContactId);
  }, [contactActivities, filterContactId]);

  // Handle add new activity
  const handleAddClick = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  // Handle edit activity
  const handleEditClick = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  // Handle delete activity
  const handleDeleteClick = (activity) => {
    setDeleteConfirm(activity);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteContactActivity(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Handle form submit
  const handleFormSubmit = (formData, activityId) => {
    if (activityId) {
      updateContactActivity(activityId, formData);
    } else {
      addContactActivity(formData);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingActivity(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Activity</h1>
            <p className="text-slate-600 mt-1">
              Track emails, calls, notes, and meetings with your contacts
            </p>
          </div>
          <Button onClick={handleAddClick} className="flex items-center gap-2">
            <Plus size={18} />
            Log Activity
          </Button>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center bg-white p-4 rounded-lg border border-slate-200">
          <div className="flex items-center gap-2 text-slate-600">
            <Filter size={18} />
            <span className="font-medium">Filter by contact:</span>
          </div>
          <select
            value={filterContactId}
            onChange={(e) => setFilterContactId(e.target.value)}
            className="flex-1 max-w-md px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All contacts</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name} {contact.company ? `(${contact.company})` : ''}
              </option>
            ))}
          </select>
          {filterContactId && (
            <button
              onClick={() => setFilterContactId('')}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium"
            >
              Clear filter
            </button>
          )}
        </div>

        {/* Activity Timeline */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <ActivityTimeline 
            activities={filteredActivities}
            showContact={true}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        </div>
      </div>

      {/* Add/Edit Modal */}
      <ActivityForm
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        editingActivity={editingActivity}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50"
            onClick={cancelDelete}
          />
          
          {/* Modal */}
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 z-10 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Clock size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  Delete Activity
                </h3>
                <p className="text-slate-600 mt-2">
                  Are you sure you want to delete the activity <strong>&quot;{deleteConfirm.subject}&quot;</strong>? 
                  This action cannot be undone.
                </p>
              </div>
            </div>
            
            <div className="flex justify-end gap-3 mt-6">
              <Button
                variant="secondary"
                onClick={cancelDelete}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
              >
                Delete Activity
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
