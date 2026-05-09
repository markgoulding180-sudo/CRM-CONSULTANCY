import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header 
      className="px-4 lg:px-6 py-4 border-b border-blue-900/30"
      style={{
        background: 'linear-gradient(90deg, rgba(10, 15, 28, 0.95) 0%, rgba(15, 23, 42, 0.9) 100%)',
        backdropFilter: 'blur(10px)',
      }}
    >
      <div className="flex items-center justify-between gap-4">
        {/* Search bar - takes available space */}
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400" size={18} />
          <input
            type="text"
            placeholder="Search contacts, deals..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-blue-900/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent text-slate-200 placeholder-slate-500 text-sm transition-all duration-300 hover:bg-slate-800"
          />
        </div>
        
        {/* Right side actions */}
        <div className="flex items-center gap-3">
          <button className="p-2.5 text-slate-400 hover:text-blue-400 hover:bg-blue-900/30 rounded-xl transition-all duration-300">
            <Bell size={20} />
          </button>
          
          {/* User avatar placeholder */}
          <div 
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium text-white"
            style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            }}
          >
            MG
          </div>
        </div>
      </div>
    </header>
  );
}
