import { useState, useEffect } from 'react';
import Button from '../UI/Button';
import { useData } from '../../context/DataContext';

const DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' }
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

// Text Input Component
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

// Select Component
function Select({ value, onChange, options, placeholder, error }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '10px 14px',
        background: 'var(--bg-surface-2)',
        border: `1px solid ${error ? 'var(--red)' : 'var(--border)'}`,
        borderRadius: 'var(--radius)',
        color: 'var(--text-primary)',
        fontSize: '14px',
        outline: 'none',
        cursor: 'pointer',
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

// Textarea Component
function Textarea({ value, onChange, placeholder, rows = 4 }) {
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
        border: '1px solid var(--border)',
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
      onBlur={(e) => e.target.style.borderColor = 'var(--border)'}
    />
  );
}

export default function MeetingForm({ onClose, initialDate = null, editMeeting = null }) {
  const { contacts, addMeeting, updateMeeting } = useData();
  
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    time: '',
    duration: 30,
    contactId: '',
    notes: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editMeeting) {
      setFormData({
        title: editMeeting.title || '',
        date: editMeeting.date || '',
        time: editMeeting.time || '',
        duration: editMeeting.duration || 30,
        contactId: editMeeting.contactId || '',
        notes: editMeeting.notes || ''
      });
    } else if (initialDate) {
      const dateStr = initialDate.toISOString().split('T')[0];
      setFormData(prev => ({ ...prev, date: dateStr }));
    }
  }, [editMeeting, initialDate]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.date) newErrors.date = 'Date is required';
    if (!formData.time) newErrors.time = 'Time is required';
    if (!formData.contactId) newErrors.contactId = 'Contact is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (editMeeting) {
      updateMeeting(editMeeting.id, formData);
    } else {
      addMeeting(formData);
    }
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const contactOptions = contacts.map(c => ({ value: c.id, label: `${c.name} (${c.company})` }));

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Meeting Title" required error={errors.title}>
        <TextInput
          value={formData.title}
          onChange={(e) => handleChange('title', e.target.value)}
          placeholder="e.g., Quarterly Review"
          error={errors.title}
        />
      </FormField>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        <FormField label="Date" required error={errors.date}>
          <TextInput
            type="date"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            error={errors.date}
          />
        </FormField>

        <FormField label="Time" required error={errors.time}>
          <TextInput
            type="time"
            value={formData.time}
            onChange={(e) => handleChange('time', e.target.value)}
            error={errors.time}
          />
        </FormField>
      </div>

      <FormField label="Duration">
        <Select
          value={formData.duration}
          onChange={(e) => handleChange('duration', parseInt(e.target.value))}
          options={DURATIONS}
        />
      </FormField>

      <FormField label="Contact" required error={errors.contactId}>
        <Select
          value={formData.contactId}
          onChange={(e) => handleChange('contactId', e.target.value)}
          options={contactOptions}
          placeholder="Select a contact..."
          error={errors.contactId}
        />
      </FormField>

      <FormField label="Notes">
        <Textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Add meeting notes, agenda items, or preparation details..."
          rows={4}
        />
      </FormField>

      <div className="modal-actions" style={{ marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
        <Button type="button" variant="ghost" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" variant="primary">
          {editMeeting ? 'Update Meeting' : 'Schedule Meeting'}
        </Button>
      </div>
    </form>
  );
}
