import { useState } from 'react';
import { Plus, FileText } from 'lucide-react';
import Layout from '../components/Layout/Layout';
import InvoicesTable from '../components/Invoices/InvoicesTable';
import InvoiceForm from '../components/Invoices/InvoiceForm';
import Button from '../components/UI/Button';
import { useData } from '../context/DataContext';

const statusTabs = [
  { key: 'all', label: 'All' },
  { key: 'draft', label: 'Draft' },
  { key: 'sent', label: 'Sent' },
  { key: 'paid', label: 'Paid' },
  { key: 'overdue', label: 'Overdue' }
];

export default function Invoices() {
  const { invoices } = useData();
  const [activeTab, setActiveTab] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Calculate total outstanding (sent + overdue)
  const outstandingInvoices = invoices.filter(
    inv => inv.status === 'sent' || inv.status === 'overdue'
  );
  const totalOutstanding = outstandingInvoices.reduce(
    (sum, inv) => sum + (inv.total || 0), 
    0
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 2
    }).format(value);
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Invoices</h1>
            <p className="text-slate-600 mt-1">
              Manage invoices and quotes for your clients
            </p>
          </div>
          <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
            <Plus size={18} />
            New Invoice
          </Button>
        </div>

        {/* Outstanding Amount Card */}
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <FileText size={24} className="text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Total Outstanding</p>
              <p className="text-2xl font-bold text-slate-900">
                {formatCurrency(totalOutstanding)}
              </p>
              <p className="text-xs text-slate-500 mt-0.5">
                {outstandingInvoices.length} invoice{outstandingInvoices.length !== 1 ? 's' : ''} pending
              </p>
            </div>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="border-b border-slate-200">
          <nav className="flex gap-1">
            {statusTabs.map((tab) => {
              const count = tab.key === 'all' 
                ? invoices.length 
                : invoices.filter(inv => inv.status === tab.key).length;
              
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.key
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
                  }`}
                >
                  {tab.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    activeTab === tab.key
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Invoices Table */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <InvoicesTable invoices={invoices} filterStatus={activeTab} />
        </div>
      </div>

      {/* Invoice Form Modal */}
      <InvoiceForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </Layout>
  );
}
