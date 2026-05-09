import { Trash2, CheckCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';
import Button from '../UI/Button';

const statusColors = {
  draft: 'bg-slate-100 text-slate-700',
  sent: 'bg-blue-100 text-blue-700',
  paid: 'bg-green-100 text-green-700',
  overdue: 'bg-red-100 text-red-700'
};

const statusLabels = {
  draft: 'Draft',
  sent: 'Sent',
  paid: 'Paid',
  overdue: 'Overdue'
};

export default function InvoicesTable({ invoices, filterStatus = 'all' }) {
  const { contacts, deleteInvoice, markInvoicePaid } = useData();

  const getContactName = (contactId) => {
    const contact = contacts.find(c => c.id === contactId);
    return contact ? contact.name : 'Unknown Contact';
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const filteredInvoices = filterStatus === 'all' 
    ? invoices 
    : invoices.filter(inv => inv.status === filterStatus);

  // Sort by date, newest first
  const sortedInvoices = [...filteredInvoices].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );

  const handleDelete = (invoice) => {
    if (window.confirm(`Are you sure you want to delete invoice ${invoice.number}?`)) {
      deleteInvoice(invoice.id);
    }
  };

  const handleMarkPaid = (invoice) => {
    markInvoicePaid(invoice.id);
  };

  if (sortedInvoices.length === 0) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p>No invoices found.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200">
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Invoice #</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Contact</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Date</th>
            <th className="text-left py-3 px-4 text-sm font-medium text-slate-600">Due Date</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Amount</th>
            <th className="text-center py-3 px-4 text-sm font-medium text-slate-600">Status</th>
            <th className="text-right py-3 px-4 text-sm font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {sortedInvoices.map((invoice) => (
            <tr key={invoice.id} className="hover:bg-slate-50">
              <td className="py-3 px-4 text-sm font-medium text-slate-900">
                {invoice.number}
              </td>
              <td className="py-3 px-4 text-sm text-slate-700">
                {getContactName(invoice.contactId)}
              </td>
              <td className="py-3 px-4 text-sm text-slate-600">
                {formatDate(invoice.date)}
              </td>
              <td className="py-3 px-4 text-sm text-slate-600">
                {formatDate(invoice.dueDate)}
              </td>
              <td className="py-3 px-4 text-sm text-slate-900 text-right font-medium">
                {formatCurrency(invoice.total)}
              </td>
              <td className="py-3 px-4 text-center">
                <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${statusColors[invoice.status] || statusColors.draft}`}>
                  {statusLabels[invoice.status] || invoice.status}
                </span>
              </td>
              <td className="py-3 px-4 text-right">
                <div className="flex items-center justify-end gap-2">
                  {(invoice.status === 'sent' || invoice.status === 'overdue') && (
                    <Button
                      onClick={() => handleMarkPaid(invoice)}
                      className="flex items-center gap-1 text-xs py-1 px-2"
                      title="Mark as Paid"
                    >
                      <CheckCircle size={14} />
                      Mark Paid
                    </Button>
                  )}
                  <button
                    onClick={() => handleDelete(invoice)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                    title="Delete Invoice"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
