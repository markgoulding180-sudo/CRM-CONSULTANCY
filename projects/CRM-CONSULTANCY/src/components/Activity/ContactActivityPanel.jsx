import { useMemo } from 'react';
import { X, Plus, Mail, Phone, FileText, Calendar, Receipt } from 'lucide-react';
import { useData } from '../../context/DataContext';
import ActivityTimeline from './ActivityTimeline';
import Button from '../UI/Button';

const activityTypeConfig = {
  email: { icon: Mail, label: 'Email', color: 'text-blue-600', bgColor: 'bg-blue-100' },
  call: { icon: Phone, label: 'Call', color: 'text-green-600', bgColor: 'bg-green-100' },
  note: { icon: FileText, label: 'Note', color: 'text-amber-600', bgColor: 'bg-amber-100' },
  meeting: { icon: Calendar, label: 'Meeting', color: 'text-purple-600', bgColor: 'bg-purple-100' },
};

const statusColors = {
  draft: 'bg-slate-100 text-slate-700',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700'
};

export default function ContactActivityPanel({ contactId, isOpen, onClose, onAddActivity, onEditActivity, onDeleteActivity }) {
  const { contacts, contactActivities, invoices } = useData();
  
  const contact = useMemo(() => {
    return contacts.find(c => c.id === contactId);
  }, [contacts, contactId]);
  
  const activities = useMemo(() => {
    return contactActivities.filter(a => a.contactId === contactId);
  }, [contactActivities, contactId]);

  // Get invoices for this contact
  const contactInvoices = useMemo(() => {
    return invoices
      .filter(inv => inv.contactId === contactId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [invoices, contactId]);

  // Calculate activity stats
  const activityStats = useMemo(() => {
    const stats = { email: 0, call: 0, note: 0, meeting: 0 };
    activities.forEach(a => {
      if (stats[a.type] !== undefined) {
        stats[a.type]++;
      }
    });
    return stats;
  }, [activities]);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(value);
  };

  if (!isOpen || !contact) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 z-40 transition-opacity"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Activity History</h2>
            <p className="text-sm text-slate-500">{contact.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
            aria-label="Close panel"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Contact Info Summary */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-semibold text-blue-700">
                {contact.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-slate-900">{contact.name}</h3>
              <p className="text-sm text-slate-500">{contact.company || 'No company'}</p>
            </div>
          </div>
          
          {/* Activity Stats */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {Object.entries(activityTypeConfig).map(([type, config]) => {
              const Icon = config.icon;
              const count = activityStats[type];
              return (
                <div key={type} className={`flex flex-col items-center p-2 rounded-lg ${config.bgColor}`}>
                  <Icon size={16} className={config.color} />
                  <span className={`text-xs font-medium mt-1 ${config.color}`}>
                    {count} {config.label}s
                  </span>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Invoices Section */}
        {contactInvoices.length > 0 && (
          <div className="px-6 py-4 border-b border-slate-200 bg-slate-50">
            <h3 className="text-sm font-semibold text-slate-700 mb-3 flex items-center gap-2">
              <Receipt size={16} />
              Invoices ({contactInvoices.length})
            </h3>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {contactInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between p-2 bg-white rounded-lg border border-slate-200"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-slate-900">{invoice.number}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[invoice.status] || 'bg-slate-100 text-slate-700'}`}>
                      {invoice.status}
                    </span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Activity Timeline */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <h3 className="text-sm font-semibold text-slate-700 mb-3">Activity History</h3>
          <ActivityTimeline 
            activities={activities} 
            showContact={false}
            onEdit={onEditActivity}
            onDelete={onDeleteActivity}
          />
        </div>
        
        {/* Footer - Add Activity Button */}
        <div className="px-6 py-4 border-t border-slate-200 bg-slate-50">
          <Button onClick={onAddActivity} className="w-full flex items-center justify-center gap-2">
            <Plus size={18} />
            Log Activity
          </Button>
        </div>
      </div>
    </>
  );
}
