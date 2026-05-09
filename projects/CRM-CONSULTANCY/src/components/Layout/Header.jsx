import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-slate-900/80 backdrop-blur-sm border-b border-blue-900/30 px-4 lg:px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        {/* Title */}
        <h1 className="text-xl lg:text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent hidden sm:block">
          Dashboard
        </h1>
        
        {/* Search bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
          <input
            type="text"
            placeholder="Search contacts, deals..."
            className="w-full pl-10 pr-4 py-2 bg-slate-800/50 border border-blue-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-200 placeholder-slate-500 text-sm transition-all duration-300 hover:bg-slate-800"
          />
        </div>
        
        {/* Notification bell */}
        <button className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-900/30 rounded-xl transition-all duration-300">
          <Bell size={20} />
        </button>
      </div>
    </header>
  );
}
