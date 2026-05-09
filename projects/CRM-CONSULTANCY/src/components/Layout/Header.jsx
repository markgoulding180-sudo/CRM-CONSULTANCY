import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-slate-200 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Title - hidden on mobile, shown on larger screens */}
        <h1 className="text-xl lg:text-2xl font-bold text-slate-900 hidden sm:block">
          CRM Consultancy
        </h1>
        
        {/* Search bar - full width on mobile */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search contacts, deals..."
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          />
        </div>
        
        {/* Notification bell */}
        <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}
