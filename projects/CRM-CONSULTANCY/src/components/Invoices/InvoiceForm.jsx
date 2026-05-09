import { useState, useEffect } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Modal from '../UI/Modal';
import Input from '../UI/Input';
import Button from '../UI/Button';

export default function InvoiceForm({ isOpen, onClose, invoice = null }) {
  const { contacts, addInvoice, updateInvoice } = useData();
  
  const [formData, setFormData] = useState({
    contactId: '',
    lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
    status: 'draft',
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  });

  // Load invoice data if editing
  useEffect(() => {
    if (invoice) {
      setFormData({
        contactId: invoice.contactId || '',
        lineItems: invoice.lineItems || [{ description: '', quantity: 1, unitPrice: 0 }],
        status: invoice.status || 'draft',
        dueDate: invoice.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    } else {
      setFormData({
        contactId: '',
        lineItems: [{ description: '', quantity: 1, unitPrice: 0 }],
        status: 'draft',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      });
    }
  }, [invoice, isOpen]);

  // Calculate totals
  const calculateTotals = () => {
    const subtotal = formData.lineItems.reduce((sum, item) => {
      return sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0);
    }, 0);
    const vat = subtotal * 0.20;
    const total = subtotal + vat;
    return { subtotal, vat, total };
  };

  const { subtotal, vat, total } = calculateTotals();

  const handleContactChange = (e) => {
    setFormData(prev => ({ ...prev, contactId: e.target.value }));
  };

  const handleDueDateChange = (e) => {
    setFormData(prev => ({ ...prev, dueDate: e.target.value }));
  };

  const handleStatusChange = (e) => {
    setFormData(prev => ({ ...prev, status: e.target.value }));
  };

  const handleLineItemChange = (index, field, value) => {
    setFormData(prev => {
      const newLineItems = [...prev.lineItems];
      newLineItems[index] = { ...newLineItems[index], [field]: value };
      return { ...prev, lineItems: newLineItems };
    });
  };

  const addLineItem = () => {
    setFormData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeLineItem = (index) => {
    if (formData.lineItems.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty line items
    const validLineItems = formData.lineItems.filter(
      item => item.description.trim() !== ''
    );
    
    if (validLineItems.length === 0) {
      alert('Please add at least one line item');
      return;
    }

    const invoiceData = {
      ...formData,
      lineItems: validLineItems
    };

    if (invoice) {
      updateInvoice(invoice.id, invoiceData);
    } else {
      addInvoice(invoiceData);
    }
    
    onClose();
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={invoice ? 'Edit Invoice' : 'New Invoice'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Contact Selection */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Contact <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.contactId}
            onChange={handleContactChange}
            required
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select a contact...</option>
            {contacts.map(contact => (
              <option key={contact.id} value={contact.id}>
                {contact.name} {contact.company ? `(${contact.company})` : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Due Date */}
        <Input
          label="Due Date"
          type="date"
          value={formData.dueDate}
          onChange={handleDueDateChange}
          required
        />

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status
          </label>
          <select
            value={formData.status}
            onChange={handleStatusChange}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>

        {/* Line Items */}
        <div className="border-t border-slate-200 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-medium text-slate-700">Line Items</h3>
            <Button type="button" onClick={addLineItem} className="flex items-center gap-1 text-sm py-1 px-2">
              <Plus size={16} />
              Add Item
            </Button>
          </div>

          <div className="space-y-3">
            {formData.lineItems.map((item, index) => (
              <div key={index} className="flex gap-2 items-start">
                <div className="flex-1">
                  <input
                    type="text"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) => handleLineItemChange(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="w-20">
                  <input
                    type="number"
                    placeholder="Qty"
                    min="1"
                    value={item.quantity}
                    onChange={(e) => handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <div className="w-28">
                  <input
                    type="number"
                    placeholder="Price"
                    min="0"
                    step="0.01"
                    value={item.unitPrice}
                    onChange={(e) => handleLineItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeLineItem(index)}
                  disabled={formData.lineItems.length <= 1}
                  className="p-2 text-slate-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-slate-200 pt-4 bg-slate-50 rounded-lg p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-600">Subtotal:</span>
              <span className="font-medium">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-600">VAT (20%):</span>
              <span className="font-medium">{formatCurrency(vat)}</span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-slate-200 pt-2">
              <span className="text-slate-900">Total:</span>
              <span className="text-slate-900">{formatCurrency(total)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-slate-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">
            {invoice ? 'Update Invoice' : 'Create Invoice'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
