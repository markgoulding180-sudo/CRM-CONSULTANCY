import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useData } from '../../context/DataContext';

const STAGES = ['Lead', 'Discovery', 'Proposal', 'Negotiation', 'Closed Won'];

export default function DealForm({ isOpen, onClose, deal = null }) {
  const { contacts, addDeal, updateDeal } = useData();
  const isEditing = !!deal;

  const [formData, setFormData] = useState({
    name: '',
    company: '',
    value: '',
    closeDate: '',
    probability: 50,
    stage: 'Lead',
    contactId: ''
  });
  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (deal) {
      setFormData({
        name: deal.name || '',
        company: deal.company || '',
        value: deal.value || '',
        closeDate: deal.closeDate || '',
        probability: deal.probability || 50,
        stage: deal.stage || 'Lead',
        contactId: deal.contactId || ''
      });
    } else {
      setFormData({
        name: '',
        company: '',
        value: '',
        closeDate: '',
        probability: 50,
        stage: 'Lead',
        contactId: ''
      });
    }
    setErrors({});
  }, [deal, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  // When contact is selected, auto-fill company
  const handleContactChange = (contactId) => {
    const selectedContact = contacts.find(c => c.id === contactId);
    setFormData(prev => ({
      ...prev,
      contactId,
      company: selectedContact ? selectedContact.company : prev.company
    }));
    if (errors.contactId) {
      setErrors(prev => ({ ...prev, contactId: null }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Deal name is required';
    }
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const dealData = {
      ...formData,
      value: parseFloat(formData.value) || 0,
      probability: parseInt(formData.probability) || 0
    };

    if (isEditing) {
      updateDeal(deal.id, dealData);
    } else {
      addDeal(dealData);
    }
    onClose();
  };

  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Deal' : 'Add New Deal'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Deal Name */}
        <Input
          label="Deal Name"
          value={formData.name}
          onChange={(e) => handleChange('name', e.target.value)}
          placeholder="e.g., Enterprise Software License"
          error={errors.name}
          required
        />

        {/* Company / Contact */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Associated Contact
          </label>
          <select
            value={formData.contactId}
            onChange={(e) => handleContactChange(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="">Select a contact...</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name} — {contact.company}
              </option>
            ))}
          </select>
        </div>

        {/* Company Name (read-only if contact selected) */}
        <Input
          label="Company"
          value={formData.company}
          onChange={(e) => handleChange('company', e.target.value)}
          placeholder="Company name"
        />

        {/* Value and Close Date row */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Value (£)"
            type="number"
            value={formData.value}
            onChange={(e) => handleChange('value', e.target.value)}
            placeholder="0"
            min="0"
            step="0.01"
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Close Date
            </label>
            <input
              type="date"
              value={formData.closeDate}
              onChange={(e) => handleChange('closeDate', e.target.value)}
              min={today}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Stage */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Stage
          </label>
          <select
            value={formData.stage}
            onChange={(e) => handleChange('stage', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            {STAGES.map(stage => (
              <option key={stage} value={stage}>{stage}</option>
            ))}
          </select>
        </div>

        {/* Probability */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Probability: {formData.probability}%
          </label>
          <input
            type="range"
            min="0"
            max="100"
            value={formData.probability}
            onChange={(e) => handleChange('probability', e.target.value)}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          />
          <div className="flex justify-between text-xs text-slate-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Save Changes' : 'Add Deal'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
