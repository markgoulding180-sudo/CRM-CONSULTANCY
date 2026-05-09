import { useState, useMemo } from 'react';
import { Search, Pencil, Trash2, User, ChevronUp, ChevronDown } from 'lucide-react';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

export default function ContactsTable({ 
  contacts, 
  searchQuery, 
  onEdit, 
  onDelete 
}) {
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc'
  });

  // Filter contacts based on search query
  const filteredContacts = useMemo(() => {
    if (!searchQuery.trim()) return contacts;
    
    const query = searchQuery.toLowerCase();
    return contacts.filter(contact => 
      contact.name?.toLowerCase().includes(query) ||
      contact.company?.toLowerCase().includes(query) ||
      contact.email?.toLowerCase().includes(query)
    );
  }, [contacts, searchQuery]);

  // Sort contacts
  const sortedContacts = useMemo(() => {
    if (!sortConfig.key) return filteredContacts;

    return [...filteredContacts].sort((a, b) => {
      let aValue = a[sortConfig.key];
      let bValue = b[sortConfig.key];

      // Handle null/undefined values
      if (aValue === null || aValue === undefined) aValue = '';
      if (bValue === null || bValue === undefined) bValue = '';

      // String comparison
      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredContacts, sortConfig]);

  // Handle sort click
  const handleSort = (key) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Get status badge variant
  const getStatusVariant = (status) => {
    switch (status?.toLowerCase()) {
      case 'lead': return 'lead';
      case 'prospect': return 'prospect';
      case 'customer': return 'customer';
      default: return 'lead';
    }
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Sort header component
  const SortHeader = ({ label, sortKey }) => {
    const isActive = sortConfig.key === sortKey;
    return (
      <button
        onClick={() => handleSort(sortKey)}
        className="flex items-center gap-1 hover:text-slate-900 transition-colors"
      >
        {label}
        <span className="inline-flex flex-col">
          <ChevronUp 
            size={12} 
            className={`${isActive && sortConfig.direction === 'asc' ? 'text-blue-600' : 'text-slate-400'}`}
          />
          <ChevronDown 
            size={12} 
            className={`-mt-1 ${isActive && sortConfig.direction === 'desc' ? 'text-blue-600' : 'text-slate-400'}`}
          />
        </span>
      </button>
    );
  };

  // Empty state
  if (sortedContacts.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
        <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <User size={32} className="text-slate-400" />
        </div>
        <h3 className="text-lg font-medium text-slate-900 mb-2">
          {searchQuery ? 'No contacts found' : 'No contacts yet'}
        </h3>
        <p className="text-slate-500">
          {searchQuery 
            ? 'Try adjusting your search terms'
            : 'Get started by adding your first contact'
          }
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <SortHeader label="Name" sortKey="name" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <SortHeader label="Company" sortKey="company" />
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Phone
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">
                <SortHeader label="Last Contacted" sortKey="lastContacted" />
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {sortedContacts.map((contact) => (
              <tr 
                key={contact.id}
                className="hover:bg-slate-50 transition-colors"
              >
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-sm font-medium text-blue-700">
                        {contact.name?.charAt(0).toUpperCase() || '?'}
                      </span>
                    </div>
                    <span className="font-medium text-slate-900">{contact.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{contact.company || '-'}</td>
                <td className="px-4 py-3 text-slate-600">{contact.role || '-'}</td>
                <td className="px-4 py-3 text-slate-600">
                  <a 
                    href={`mailto:${contact.email}`}
                    className="text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    {contact.email || '-'}
                  </a>
                </td>
                <td className="px-4 py-3 text-slate-600">{contact.phone || '-'}</td>
                <td className="px-4 py-3">
                  <Badge variant={getStatusVariant(contact.status)}>
                    {contact.status || 'Lead'}
                  </Badge>
                </td>
                <td className="px-4 py-3 text-slate-600">
                  {formatDate(contact.lastContacted)}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => onEdit(contact)}
                      className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      title="Edit contact"
                    >
                      <Pencil size={16} />
                    </button>
                    <button
                      onClick={() => onDelete(contact)}
                      className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete contact"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Results count */}
      <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-sm text-slate-600">
        Showing {sortedContacts.length} of {contacts.length} contacts
        {searchQuery && ` (filtered by "${searchQuery}")`}
      </div>
    </div>
  );
}
