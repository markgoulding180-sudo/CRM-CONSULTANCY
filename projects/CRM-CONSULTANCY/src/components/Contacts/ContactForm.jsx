import { useState, useEffect } from 'react';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';

const STATUS_OPTIONS = [
  { value: 'Lead', label: 'Lead' },
  { value: 'Prospect', label: 'Prospect' },
  { value: 'Customer', label: 'Customer' }
];

export default function ContactForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  contact = null 
}) {
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

  // Reset form when modal opens/closes or contact changes
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
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit(formData);
    onClose();
  };

  const handleClose = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={isEditing ? 'Edit Contact' : 'Add Contact'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Name"
          value={formData.name}
          onChange={handleChange('name')}
          placeholder="Enter contact name"
          error={errors.name}
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Company"
            value={formData.company}
            onChange={handleChange('company')}
            placeholder="Company name"
          />
          <Input
            label="Role"
            value={formData.role}
            onChange={handleChange('role')}
            placeholder="Job title"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Email"
            type="email"
            value={formData.email}
            onChange={handleChange('email')}
            placeholder="email@example.com"
          />
          <Input
            label="Phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange('phone')}
            placeholder="+1 234 567 890"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              value={formData.status}
              onChange={handleChange('status')}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Last Contacted"
            type="date"
            value={formData.lastContacted}
            onChange={handleChange('lastContacted')}
          />
        </div>
        
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 mt-6">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Save Changes' : 'Add Contact'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
