import { useState } from 'react';
import { X, Mail, Phone, FileText, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';

const activityTypes = [
  { value: 'email', label: 'Email', icon: Mail, color: 'text-blue-600', bgColor: 'bg-blue-100' },
  { value: 'call', label: 'Call', icon: Phone, color: 'text-green-600', bgColor: 'bg-green-100' },
  { value: 'note', label: 'Note', icon: FileText, color: 'text-amber-600', bgColor: 'bg-amber-100' },
  { value: 'meeting', label: 'Meeting', icon: Calendar, color: 'text-purple-600', bgColor: 'bg-purple-100' },
];

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

  // Reset form when modal opens/closes or editingActivity changes
  useState(() => {
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

  const selectedType = activityTypes.find(t => t.value === formData.type);
  const TypeIcon = selectedType?.icon || Mail;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editingActivity ? 'Edit Activity' : 'Log Activity'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contact <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.contactId}
            onChange={(e) => handleChange('contactId', e.target.value)}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.contactId ? 'border-red-500' : 'border-slate-300'
            }`}
            disabled={!!preselectedContactId}
          >
            <option value="">Select a contact...</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name} {contact.company ? `(${contact.company})` : ''}
              </option>
            ))}
          </select>
          {errors.contactId && (
            <p className="mt-1 text-sm text-red-600">{errors.contactId}</p>
          )}
        </div>

        {/* Type Dropdown */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Activity Type <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-4 gap-2">
            {activityTypes.map((type) => {
              const Icon = type.icon;
              const isSelected = formData.type === type.value;
              return (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => handleChange('type', type.value)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-lg border transition-all ${
                    isSelected
                      ? `border-${type.color.split('-')[1]}-500 ${type.bgColor}`
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <Icon size={20} className={type.color} />
                  <span className={`text-xs font-medium ${isSelected ? type.color : 'text-slate-600'}`}>
                    {type.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Subject Input */}
        <Input
          label="Subject"
          value={formData.subject}
          onChange={(e) => handleChange('subject', e.target.value)}
          placeholder="Enter activity subject..."
          error={errors.subject}
          required
        />

        {/* Body Textarea */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Body <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => handleChange('body', e.target.value)}
            placeholder="Enter activity details..."
            rows={4}
            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
              errors.body ? 'border-red-500' : 'border-slate-300'
            }`}
          />
          {errors.body && (
            <p className="mt-1 text-sm text-red-600">{errors.body}</p>
          )}
        </div>

        {/* Date Picker */}
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          error={errors.date}
          required
        />

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {editingActivity ? 'Update Activity' : 'Log Activity'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
