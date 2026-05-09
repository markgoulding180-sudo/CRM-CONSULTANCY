import { useState, useEffect } from 'react';
import Input from '../UI/Input';
import Button from '../UI/Button';
import { useData } from '../../context/DataContext';

const DURATIONS = [
  { value: 15, label: '15 minutes' },
  { value: 30, label: '30 minutes' },
  { value: 60, label: '1 hour' },
  { value: 90, label: '1.5 hours' }
];

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
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    
    if (!formData.time) {
      newErrors.time = 'Time is required';
    }
    
    if (!formData.contactId) {
      newErrors.contactId = 'Contact is required';
    }
    
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
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Meeting Title"
        value={formData.title}
        onChange={(e) => handleChange('title', e.target.value)}
        placeholder="e.g., Quarterly Review"
        error={errors.title}
        required
      />

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange('date', e.target.value)}
          error={errors.date}
          required
        />

        <Input
          label="Time"
          type="time"
          value={formData.time}
          onChange={(e) => handleChange('time', e.target.value)}
          error={errors.time}
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Duration
        </label>
        <select
          value={formData.duration}
          onChange={(e) => handleChange('duration', parseInt(e.target.value))}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
        >
          {DURATIONS.map(dur => (
            <option key={dur.value} value={dur.value}>
              {dur.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Contact <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.contactId}
          onChange={(e) => handleChange('contactId', e.target.value)}
          className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-0 transition-colors ${
            errors.contactId
              ? 'border-red-500 focus:ring-red-500'
              : 'border-slate-300 focus:ring-blue-500 focus:border-blue-500'
          } bg-white`}
        >
          <option value="">Select a contact...</option>
          {contacts.map(contact => (
            <option key={contact.id} value={contact.id}>
              {contact.name} ({contact.company})
            </option>
          ))}
        </select>
        {errors.contactId && (
          <p className="mt-1 text-sm text-red-600">{errors.contactId}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => handleChange('notes', e.target.value)}
          placeholder="Add meeting notes, agenda items, or preparation details..."
          rows={4}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="secondary"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button type="submit">
          {editMeeting ? 'Update Meeting' : 'Schedule Meeting'}
        </Button>
      </div>
    </form>
  );
}
