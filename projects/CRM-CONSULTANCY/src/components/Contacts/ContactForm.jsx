import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Button from '../UI/Button';

const STATUS_OPTIONS = [
  { value: 'Lead', label: 'Lead' },
  { value: 'Prospect', label: 'Prospect' },
  { value: 'Customer', label: 'Customer' }
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

// Select
function Select({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={onChange}
      style={{
        width: '100%',
        padding: '10px 14px',
        background: 'var(--bg-surface-2)',
        border: '1px solid var(--border)',
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
      {options.map(opt => (
        <option key={opt.value} value={opt.value} style={{ background: 'var(--bg-surface-2)', color: 'var(--text-primary)' }}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

// Modal Component (inline since import might be broken)
function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;
  return (
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
      onClick={onClose}
    >
      <div 
        style={{
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-active)',
          borderRadius: 'var(--radius-xl)',
          padding: '24px',
          width: '100%',
          maxWidth: '480px',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '17px', fontWeight: 700, color: 'var(--text-primary)' }}>{title}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export default function ContactForm({ isOpen, onClose, onSubmit, contact = null }) {
  const isEditing = !!contact;
  
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    role: '',
    email: '',
    phone: '',
    status: 'Lead',
    lastContacted: ''
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      if (contact) {
        setFormData({
          name: contact.name || '',
          company: contact.company || '',
          role: contact.role || '',
          email: contact.email || '',
          phone: contact.phone || '',
          status: contact.status || 'Lead',
          lastContacted: contact.lastContacted || ''
        });
      } else {
        setFormData({
          name: '',
          company: '',
          role: '',
          email: '',
          phone: '',
          status: 'Lead',
          lastContacted: new Date().toISOString().split('T')[0]
        });
      }
      setErrors({});
    }
  }, [isOpen, contact]);

  const handleChange = (field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit(formData);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Edit Contact' : 'Add Contact'}>
      <form onSubmit={handleSubmit}>
        <FormField label="Name" required error={errors.name}>
          <TextInput
            value={formData.name}
            onChange={handleChange('name')}
            placeholder="Enter contact name"
            error={errors.name}
          />
        </FormField>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Company">
            <TextInput
              value={formData.company}
              onChange={handleChange('company')}
              placeholder="Company name"
            />
          </FormField>
          <FormField label="Role">
            <TextInput
              value={formData.role}
              onChange={handleChange('role')}
              placeholder="Job title"
            />
          </FormField>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Email">
            <TextInput
              type="email"
              value={formData.email}
              onChange={handleChange('email')}
              placeholder="email@example.com"
            />
          </FormField>
          <FormField label="Phone">
            <TextInput
              type="tel"
              value={formData.phone}
              onChange={handleChange('phone')}
              placeholder="+44 123 456 789"
            />
          </FormField>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <FormField label="Status">
            <Select
              value={formData.status}
              onChange={handleChange('status')}
              options={STATUS_OPTIONS}
            />
          </FormField>
          <FormField label="Last Contacted">
            <TextInput
              type="date"
              value={formData.lastContacted}
              onChange={handleChange('lastContacted')}
            />
          </FormField>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            {isEditing ? 'Save Changes' : 'Add Contact'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
