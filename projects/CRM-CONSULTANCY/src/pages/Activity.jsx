import { useState, useMemo } from 'react';
import { Plus, Filter, Mail, Phone, FileText, Users, Trash2, Edit2, X } from 'lucide-react';
import { useData } from '../context/DataContext';
import Layout from '../components/Layout/Layout';
import ActivityForm from '../components/Activity/ActivityForm';
import Button from '../components/UI/Button';

// Activity type icons and colors
const ACTIVITY_CONFIG = {
  email: { icon: Mail, color: '#2d7ef7', bg: 'rgba(45,126,247,0.15)', label: 'Email' },
  call: { icon: Phone, color: '#10b981', bg: 'rgba(16,185,129,0.15)', label: 'Call' },
  note: { icon: FileText, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', label: 'Note' },
  meeting: { icon: Users, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)', label: 'Meeting' },
};

// Activity Item Component
function ActivityItem({ activity, contact, onEdit, onDelete }) {
  const config = ACTIVITY_CONFIG[activity.type] || ACTIVITY_CONFIG.note;
  const Icon = config.icon;
  
  return (
    <div style={{ 
      display: 'flex', 
      gap: '16px', 
      padding: '16px 0',
      borderBottom: '1px solid var(--border)'
    }}>
      {/* Icon */}
      <div style={{ 
        width: '40px', 
        height: '40px', 
        borderRadius: '10px', 
        background: config.bg,
        border: `1px solid ${config.color}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0
      }}>
        <Icon size={18} style={{ color: config.color }} />
      </div>
      
      {/* Content */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
          <span className="badge" style={{ 
            background: config.bg, 
            color: config.color, 
            border: `1px solid ${config.color}40`,
            fontSize: '10px',
            padding: '2px 8px'
          }}>
            {config.label}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '12px' }}>
            {new Date(activity.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </span>
        </div>
        <h3 style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: 600, marginBottom: '4px' }}>
          {activity.subject}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px', lineHeight: '1.5' }}>
          {activity.body}
        </p>
        {contact && (
          <p style={{ color: 'var(--text-muted)', fontSize: '12px', marginTop: '8px' }}>
            with <span style={{ color: 'var(--text-accent)' }}>{contact.name}</span> {contact.company && `(${contact.company})`}
          </p>
        )}
      </div>
      
      {/* Actions */}
      <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
        <button 
          onClick={() => onEdit(activity)}
          style={{ 
            padding: '8px', 
            background: 'var(--bg-surface-2)', 
            border: '1px solid var(--border)',
            borderRadius: '6px',
            color: 'var(--text-secondary)',
            cursor: 'pointer'
          }}
        >
          <Edit2 size={16} />
        </button>
        <button 
          onClick={() => onDelete(activity)}
          style={{ 
            padding: '8px', 
            background: 'var(--red-bg)', 
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: '6px',
            color: 'var(--red)',
            cursor: 'pointer'
          }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
}

export default function Activity() {
  const { contacts, contactActivities, addContactActivity, updateContactActivity, deleteContactActivity } = useData();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);
  const [filterContactId, setFilterContactId] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  // Filter activities by contact
  const filteredActivities = useMemo(() => {
    let activities = filterContactId 
      ? contactActivities.filter(a => a.contactId === filterContactId)
      : contactActivities;
    return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [contactActivities, filterContactId]);

  // Get activity counts by type
  const activityCounts = useMemo(() => {
    const counts = { email: 0, call: 0, note: 0, meeting: 0 };
    filteredActivities.forEach(a => counts[a.type]++);
    return counts;
  }, [filteredActivities]);

  const handleAddClick = () => {
    setEditingActivity(null);
    setIsModalOpen(true);
  };

  const handleEditClick = (activity) => {
    setEditingActivity(activity);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (activity) => {
    setDeleteConfirm(activity);
  };

  const confirmDelete = () => {
    if (deleteConfirm) {
      deleteContactActivity(deleteConfirm.id);
      setDeleteConfirm(null);
    }
  };

  const handleFormSubmit = (formData, activityId) => {
    if (activityId) {
      updateContactActivity(activityId, formData);
    } else {
      addContactActivity(formData);
    }
  };

  const getContact = (id) => contacts.find(c => c.id === id);

  return (
    <Layout>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 'var(--space-6)' }}>
        <div>
          <h1 className="page-title">Activity</h1>
          <p className="page-subtitle">Track emails, calls, notes, and meetings with your contacts</p>
        </div>
        <Button variant="primary" onClick={handleAddClick}>
          <Plus size={16} /> Log Activity
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        {Object.entries(ACTIVITY_CONFIG).map(([type, config]) => (
          <div key={type} className="stat-card">
            <div className="stat-icon" style={{ background: config.bg, borderColor: `${config.color}40`, color: config.color }}>
              <config.icon size={18} />
            </div>
            <div className="stat-label">{config.label}s</div>
            <div className="stat-value" style={{ color: config.color }}>{activityCounts[type]}</div>
          </div>
        ))}
      </div>

      {/* Filter Bar Card */}
      <div className="card" style={{ marginBottom: 'var(--space-6)', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-secondary)' }}>
            <Filter size={18} />
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Filter by contact:</span>
          </div>
          <select
            value={filterContactId}
            onChange={(e) => setFilterContactId(e.target.value)}
            style={{
              flex: 1,
              minWidth: '200px',
              maxWidth: '400px',
              padding: '10px 14px',
              background: 'var(--bg-surface-2)',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius)',
              color: 'var(--text-primary)',
              fontSize: '14px',
              outline: 'none',
              cursor: 'pointer',
            }}
          >
            <option value="">All contacts</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id} style={{ background: 'var(--bg-surface-2)' }}>
                {contact.name} {contact.company ? `(${contact.company})` : ''}
              </option>
            ))}
          </select>
          {filterContactId && (
            <button
              onClick={() => setFilterContactId('')}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '4px',
                padding: '8px 12px',
                background: 'var(--bg-surface-2)',
                border: '1px solid var(--border)',
                borderRadius: 'var(--radius)',
                color: 'var(--text-secondary)',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              <X size={14} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Activity Timeline Card */}
      <div className="card">
        <div className="page-header" style={{ marginBottom: 'var(--space-4)', paddingBottom: 'var(--space-4)', borderBottom: '1px solid var(--border)' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)' }}>
            Activity Timeline
          </h2>
          <span style={{ color: 'var(--text-muted)', fontSize: '14px' }}>
            {filteredActivities.length} activities
          </span>
        </div>
        
        {filteredActivities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '48px' }}>
            <div style={{ 
              width: '64px', 
              height: '64px', 
              borderRadius: '16px', 
              background: 'var(--bg-surface-2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px'
            }}>
              <Mail size={28} style={{ color: 'var(--text-muted)' }} />
            </div>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '16px', fontWeight: 600, marginBottom: '8px' }}>
              No activities yet
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
              Log your first activity to start tracking interactions
            </p>
          </div>
        ) : (
          <div>
            {filteredActivities.map(activity => (
              <ActivityItem
                key={activity.id}
                activity={activity}
                contact={getContact(activity.contactId)}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <ActivityForm
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingActivity(null); }}
        onSubmit={handleFormSubmit}
        editingActivity={editingActivity}
      />

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-backdrop" onClick={() => setDeleteConfirm(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-title">
              Delete Activity
              <button onClick={() => setDeleteConfirm(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '20px' }}>
                <X size={20} />
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
                Are you sure you want to delete <strong style={{ color: 'var(--text-primary)' }}>"{deleteConfirm.subject}"</strong>? This action cannot be undone.
              </p>
            </div>
            <div className="modal-actions">
              <Button variant="ghost" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="danger" onClick={confirmDelete}>Delete Activity</Button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
}
