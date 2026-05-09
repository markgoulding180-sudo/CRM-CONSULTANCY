import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';

export default function TaskForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  task = null, 
  contacts = [] 
}) {
  const isEditing = !!task;
  
  const [formData, setFormData] = useState({
    description: '',
    dueDate: '',
    priority: 'Medium',
    contactId: ''
  });
  const [errors, setErrors] = useState({});
  
  // Reset form when modal opens/closes or task changes
  useEffect(() => {
    if (isOpen) {
      if (task) {
        setFormData({
          description: task.description || '',
          dueDate: task.dueDate || '',
          priority: task.priority || 'Medium',
          contactId: task.contactId || ''
        });
      } else {
        setFormData({
          description: '',
          dueDate: '',
          priority: 'Medium',
          contactId: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, task]);
  
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when field is edited
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };
  
  const validate = () => {
    const newErrors = {};
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
  
  // Get today's date for min attribute
  const today = new Date().toISOString().split('T')[0];
  
  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? 'Edit Task' : 'Add New Task'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Description */}
        <Input
          label="Description"
          value={formData.description}
          onChange={(e) => handleChange('description', e.target.value)}
          placeholder="What needs to be done?"
          error={errors.description}
          required
        />
        
        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={(e) => handleChange('dueDate', e.target.value)}
          min={today}
        />
        
        {/* Priority */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Priority
          </label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        
        {/* Linked Contact */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Linked Contact
          </label>
          <select
            value={formData.contactId}
            onChange={(e) => handleChange('contactId', e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">-- No Contact --</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name} ({contact.company})
              </option>
            ))}
          </select>
        </div>
        
        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Save Changes' : 'Add Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
