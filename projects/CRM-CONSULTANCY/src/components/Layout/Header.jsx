import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="top-bar">
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <Search className="text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search..."
          className="flex-1 bg-transparent border-none outline-none text-white placeholder-slate-500 text-sm"
        />
      </div>
      
      <div className="flex items-center gap-3">
        <button className="p-2 text-slate-400 hover:text-white transition-colors">
          <Bell size={20} />
        </button>
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-sm font-medium text-white">
          MG
        </div>
      </div>
    </header>
  );
}
