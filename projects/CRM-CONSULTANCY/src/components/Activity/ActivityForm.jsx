import { useState, useEffect } from 'react';
import { Mail, Phone, FileText, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../UI/Modal';
import Button from '../UI/Button';

const activityTypes = [
  { value: 'email', label: 'Email', icon: Mail, color: '#2d7ef7', bg: 'rgba(45,126,247,0.15)' },
  { value: 'call', label: 'Call', icon: Phone, color: '#10b981', bg: 'rgba(16,185,129,0.15)' },
  { value: 'note', label: 'Note', icon: FileText, color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' },
  { value: 'meeting', label: 'Meeting', icon: Calendar, color: '#8b5cf6', bg: 'rgba(139,92,246,0.15)' },
];

// Form Field Component
function FormField({ label, required, error, children }) {
  return (
    <div style={{ marginBottom: '20px' }}>
      <label style={{ 
        display: 'block', 
        fontSize: '11px', 
        fontWeight: 600, 
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
        color: 'var(--text-secondary)',
        marginBottom: '6px'
      }}>
        {label}
        {required && <span style={{ color: 'var(--red)', marginLeft: '4px' }}>*</span>}
      </label>
      {children}
      {error && (
        <p style={{ color: 'var(--red)', fontSize: '12px', marginTop: '6px' }}>{error}</p>
      )}
    </div>
  );
}

// Text Input
function TextInput({ type = 'text', value, onChange, placeholder, error }) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      style={{
        width: '100%',
        padding: '10px 14px',
        background: 'var(--bg-surface-2)',
        border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        color: 'var(--text-primary)',
        fontSize: '14px',
        outline: 'none',
        transition: 'border-color 0.2s',
      }}
      onFocus={(e) => e.target.style.borderColor = 'var(--border-active)'}
      onBlur={(e) => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
    />
  );
}

// Textarea
function Textarea({ value, onChange, placeholder, error, rows = 4 }) {
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        padding: '10px 14px',
        background: 'var(--bg-surface-2)',
        border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        color: 'var(--text-primary)',
        fontSize: '14px',
        outline: 'none',
        resize: 'vertical',
        minHeight: '100px',
        fontFamily: 'inherit',
        lineHeight: '1.5',
      }}
      onFocus={(e) => e.target.style.borderColor = 'var(--border-active)'}
      onBlur={(e) => e.target.style.borderColor = error ? 'var(--red)' : 'var(--border)'}
    />
  );
}

// Select
function Select({ value, onChange, options, placeholder, error, disabled }) {
  return (
    <select
      value={value}
      onChange={onChange}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '10px 14px',
        background: disabled ? 'var(--bg-surface-3)' : 'var(--bg-surface-2)',
        border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        color: 'var(--text-primary)',
        fontSize: '14px',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        appearance: 'none',
        backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237a9cc5' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 14px center',
        paddingRight: '40px',
      }}
    >
      {placeholder && <option value="" style={{ color: 'var(--text-muted)' }}>{placeholder}</option>}
      {options.map(opt => (
        <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-surface-2)', color: 'var(--text-primary)' }}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

export default function ActivityForm({ isOpen, onClose, onSubmit, editingActivity = null, preselectedContactId = null }) {
  const { contacts } = useData();
  
  const [formData, setFormData] = useState({
    contactId: preselectedContactId || '',
    type: 'email',
    subject: '',
    body: '',
    date: new Date().toISOString().split('T')[0]
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (editingActivity) {
        setFormData({
          contactId: editingActivity.contactId,
          type: editingActivity.type,
          subject: editingActivity.subject,
          body: editingActivity.body,
          date: editingActivity.date
        });
      } else {
        setFormData({
          contactId: preselectedContactId || '',
          type: 'email',
          subject: '',
          body: '',
          date: new Date().toISOString().split('T')[0]
        });
      }
      setErrors({});
    }
  }, [isOpen, editingActivity, preselectedContactId]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.contactId) newErrors.contactId = 'Please select a contact';
    if (!formData.subject.trim()) newErrors.subject = 'Subject is required';
    if (!formData.body.trim()) newErrors.body = 'Body is required';
    if (!formData.date) newErrors.date = 'Date is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData, editingActivity?.id);
      onClose();
    }
  };

  const contactOptions = contacts.map(c => ({ value: c.id, label: `${c.name} ${c.company ? `(${c.company})` : ''}` }));

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingActivity ? 'Edit Activity' : 'Log Activity'}>
      <form onSubmit={handleSubmit}>
        {/* Contact */}
        <FormField label="Contact" required error={errors.contactId}>
          <Select
            value={formData.contactId}
            onChange={(e) => handleChange('contactId', e.target.value)}
            options={contactOptions}
            placeholder="Select a contact..."
            error={errors.contactId}
            disabled={!!preselectedContactId}
          />
        </FormField>

        {/* Activity Type */}
        <FormField label="Activity Type" required>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
            {activityTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.type === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('type', type.value)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '12px 8px',
                    borderRadius: 'var(--radius)',
                    border: `1px solid ${isSelected ? type.color : 'var(--border)'}`,
                    background: isSelected ? type.bg : 'var(--bg-surface-2)',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--border-hover)';
                  }}
                  onMouseLeave={(e) => {
                    if (!isSelected) e.currentTarget.style.borderColor = 'var(--border)';
                  }}
                >
                  <Icon size={20} style={{ color: type.color }} />
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 600, 
                    color: isSelected ? type.color : 'var(--text-secondary)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.3px'
                  }}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </FormField>

        {/* Subject */}
        <FormField label="Subject" required error={errors.subject}>
          <TextInput
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            placeholder="Enter activity subject..."
            error={errors.subject}
          />
        </FormField>

        {/* Body */}
        <FormField label="Body" required error={errors.body}>
          <Textarea
            value={formData.body}
            onChange={(e) => handleChange('body', e.target.value)}
            placeholder="Enter activity details..."
            error={errors.body}
            rows={4}
          />
        </FormField>

        {/* Date */}
        <FormField label="Date" required error={errors.date}>
          <TextInput
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            error={errors.date}
          />
        </FormField>

        {/* Actions */}
        <div className="modal-actions" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {editingActivity ? 'Update Activity' : 'Log Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
