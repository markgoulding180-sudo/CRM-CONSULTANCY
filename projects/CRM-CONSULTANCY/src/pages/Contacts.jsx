import { useState } from 'react';
import { Search, Plus, User } from 'lucide-react';
import { useData } from '../context/DataContext';
import Layout from '../components/Layout/Layout';
import ContactsTable from '../components/Contacts/ContactsTable';
import ContactForm from '../components/Contacts/ContactForm';
import ContactActivityPanel from '../components/Activity/ContactActivityPanel';
import ActivityForm from '../components/Activity/ActivityForm';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

export default function Contacts() {
  const { contacts, addContact, updateContact, deleteContact, addContactActivity, updateContactActivity, deleteContactActivity } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContact, setEditingContact] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  
  // Activity panel state
  const [selectedContactId, setSelectedContactId] = useState(null);
  const [isActivityPanelOpen, setIsActivityPanelOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [activityDeleteConfirm, setActivityDeleteConfirm] = useState(null);

  // Handle add new contact
  const handleAddClick = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  // Handle edit contact
  const handleEditClick = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  // Handle delete contact
  const handleDeleteClick = (contact) => {
    setDeleteConfirm(contact);
  };

  // Handle contact row click - open activity panel
  const handleContactClick = (contact) => {
    setSelectedContactId(contact.id);
    setIsActivityPanelOpen(true);
  };

  // Handle close activity panel
  const handleCloseActivityPanel = () => {
    setIsActivityPanelOpen(false);
    setSelectedContactId(null);
  };

  // Handle add activity from panel
  const handleAddActivity = () => {
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  // Handle edit activity
  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  // Handle delete activity
  const handleDeleteActivity = (activity) => {
    setActivityDeleteConfirm(activity);
  };

  // Confirm activity delete
  const confirmActivityDelete = () => {
    if (activityDeleteConfirm) {
      deleteContactActivity(activityDeleteConfirm.id);
      setActivityDeleteConfirm(null);
    }
  };

  // Handle activity form submit
  const handleActivitySubmit = (formData, activityId) => {
    if (activityId) {
      updateContactActivity(activityId, formData);
    } else {
      addContactActivity({ ...formData, contactId: selectedContactId });
    }
    setIsActivityModalOpen(false);
    setEditingActivity(null);
  };

  // Confirm delete
  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteContact(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteConfirm(null);
  };

  // Handle form submit
  const handleFormSubmit = (formData) => {
    if (editingContact) {
      updateContact(editingContact.id, formData);
    } else {
      addContact(formData);
    }
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Contacts</h1>
            <p className="text-slate-600 mt-1">
              Manage your leads, prospects, and customers
            </p>
          </div>
          <Button onClick={handleAddClick} className="flex items-center gap-2">
            <Plus size={18} />
            Add Contact
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search 
            size={18} 
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" 
          />
          <input
            type="text"
            placeholder="Search by name, company, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Contacts Table */}
        <ContactsTable
          contacts={contacts}
          searchQuery={searchQuery}
          onEdit={handleEditClick}
          onDelete={handleDeleteClick}
          onRowClick={handleContactClick}
        />
      </div>

      {/* Add/Edit Modal */}
      <ContactForm
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleFormSubmit}
        contact={editingContact}
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
                <User size={24} className="text-red-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900">
                  Delete Contact
                </h3>
                <p className="text-slate-600 mt-2">
                  Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? 
                  This action cannot be undone and will also remove any associated deals and tasks.
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
                Delete Contact
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Side Panel */}
      <ContactActivityPanel
        contactId={selectedContactId}
        isOpen={isActivityPanelOpen}
        onClose={handleCloseActivityPanel}
        onAddActivity={handleAddActivity}
        onEditActivity={handleEditActivity}
        onDeleteActivity={handleDeleteActivity}
      />

      {/* Activity Form Modal */}
      <ActivityForm
        isOpen={isActivityModalOpen}
        onClose={() => {
          setIsActivityModalOpen(false);
          setEditingActivity(null);
        }}
        onSubmit={handleActivitySubmit}
        editingActivity={editingActivity}
        preselectedContactId={selectedContactId}
      />

      {/* Activity Delete Confirmation */}
      {activityDeleteConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center">
          <div className="fixed inset-0 bg-black/50" onClick={() => setActivityDeleteConfirm(null)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md mx-4 z-10 p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Activity</h3>
            <p className="text-slate-600">
              Are you sure you want to delete <strong>&quot;{activityDeleteConfirm.subject}&quot;</strong>?
            </p>
            <div className="flex justify-end gap-3 mt-6">
              <Button variant="secondary" onClick={() => setActivityDeleteConfirm(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={confirmActivityDelete}>
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
