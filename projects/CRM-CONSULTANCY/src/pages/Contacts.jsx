import { useState } from 'react';
import { Search, Plus, User, Trash2, Edit2, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import Layout from '../components/Layout/Layout';
import ContactsTable from '../components/Contacts/ContactsTable';
import ContactForm from '../components/Contacts/ContactForm';
import ContactActivityPanel from '../components/Activity/ContactActivityPanel';
import ActivityForm from '../components/Activity/ActivityForm';
import Button from '../components/UI/Button';

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

  // Stats
  const totalContacts = contacts.length;
  const leads = contacts.filter(c => c.status === 'Lead').length;
  const prospects = contacts.filter(c => c.status === 'Prospect').length;
  const customers = contacts.filter(c => c.status === 'Customer').length;

  const handleAddClick = () => {
    setEditingContact(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (contact) => {
    setEditingContact(contact);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (contact) => {
    setDeleteConfirm(contact);
  };

  const handleContactClick = (contact) => {
    setSelectedContactId(contact.id);
    setIsActivityPanelOpen(true);
  };

  const handleCloseActivityPanel = () => {
    setIsActivityPanelOpen(false);
    setSelectedContactId(null);
  };

  const handleAddActivity = () => {
    setEditingActivity(null);
    setIsActivityModalOpen(true);
  };

  const handleEditActivity = (activity) => {
    setEditingActivity(activity);
    setIsActivityModalOpen(true);
  };

  const handleDeleteActivity = (activity) => {
    setActivityDeleteConfirm(activity);
  };

  const confirmActivityDelete = () => {
    if (activityDeleteConfirm) {
      deleteContactActivity(activityDeleteConfirm.id);
      setActivityDeleteConfirm(null);
    }
  };

  const handleActivitySubmit = (formData, activityId) => {
    if (activityId) {
      updateContactActivity(activityId, formData);
    } else {
      addContactActivity({ ...formData, contactId: selectedContactId });
    }
    setIsActivityModalOpen(false);
    setEditingActivity(null);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteContact(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleFormSubmit = (formData) => {
    if (editingContact) {
      updateContact(editingContact.id, formData);
    } else {
      addContact(formData);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingContact(null);
  };

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="page-title">Contacts</h1>
          <p className="page-subtitle">Manage your leads, prospects, and customers</p>
        </div>
        <Button variant="primary" onClick={handleAddClick}>
          <Plus size={16} /> Add Contact
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(45,126,247,0.15)', borderColor: 'rgba(45,126,247,0.3)', color: '#2d7ef7' }}>
            <User size={18} />
          </div>
          <div className="stat-label">Total Contacts</div>
          <div className="stat-value" style={{ color: '#2d7ef7' }}>{totalContacts}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(100,116,139,0.15)', borderColor: 'rgba(100,116,139,0.3)', color: '#64748b' }}>
            <User size={18} />
          </div>
          <div className="stat-label">Leads</div>
          <div className="stat-value" style={{ color: '#64748b' }}>{leads}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(45,126,247,0.15)', borderColor: 'rgba(45,126,247,0.3)', color: '#2d7ef7' }}>
            <User size={18} />
          </div>
          <div className="stat-label">Prospects</div>
          <div className="stat-value" style={{ color: '#2d7ef7' }}>{prospects}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'rgba(16,185,129,0.15)', borderColor: 'rgba(16,185,129,0.3)', color: '#10b981' }}>
            <User size={18} />
          </div>
          <div className="stat-label">Customers</div>
          <div className="stat-value" style={{ color: '#10b981' }}>{customers}</div>
        </div>
      </div>

      {/* Search Card */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Search size={18} style={{ color: 'var(--text-muted)' }} />
          <input
            type="text"
            placeholder="Search by name, company, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              flex: 1,
              padding: '10px 0',
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Contacts Table Card */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
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
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 500,
            padding: '16px',
          }}
          onClick={cancelDelete}
        >
          <div 
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-active)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: 'var(--red-bg)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '1px solid rgba(239,68,68,0.3)'
              }}>
                <User size={24} style={{ color: 'var(--red)' }} />
              </div>
              <div>
                <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  Delete Contact
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
                  Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>{deleteConfirm.name}</strong>?
                </p>
              </div>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '13px', marginBottom: '20px' }}>
              This action cannot be undone and will also remove any associated deals and tasks.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="ghost" onClick={cancelDelete}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete Contact</Button>
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
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 600,
            padding: '16px',
          }}
          onClick={() => setActivityDeleteConfirm(null)}
        >
          <div 
            style={{
              background: 'var(--bg-surface)',
              border: '1px solid var(--border-active)',
              borderRadius: 'var(--radius-xl)',
              padding: '24px',
              width: '100%',
              maxWidth: '400px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Delete Activity
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', marginBottom: '20px' }}>
              Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{activityDeleteConfirm.subject}"</strong>?
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
              <Button variant="ghost" onClick={() => setActivityDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmActivityDelete}>Delete</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
