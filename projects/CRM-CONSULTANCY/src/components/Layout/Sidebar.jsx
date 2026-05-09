import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, DollarSign, CheckSquare, Menu, X, Calendar, FileText, Receipt } from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/contacts', label: 'Contacts', icon: Users },
  { path: '/deals', label: 'Deals', icon: DollarSign },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/activity', label: 'Activity', icon: FileText },
  { path: '/invoices', label: 'Invoices', icon: Receipt },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-lg lg:hidden shadow-lg shadow-blue-500/30"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar with gradient */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 z-40 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{
          background: 'linear-gradient(180deg, #0a0f1c 0%, #1a1f3a 50%, #0f172a 100%)',
        }}
      >
        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-transparent pointer-events-none" />
        
        <div className="relative p-6">
          {/* Logo area with glow */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              CRM Pro
            </h2>
            <div className="h-0.5 w-12 bg-gradient-to-r from-blue-500 to-cyan-400 mt-2 rounded-full" />
          </div>
          
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group ${
                      isActive
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30'
                        : 'text-slate-400 hover:bg-blue-900/30 hover:text-blue-300'
                    }`
                  }
                >
                  <Icon size={20} className={`transition-transform duration-300 group-hover:scale-110 ${
                    item.path === window.location.pathname ? 'text-white' : 'text-slate-400 group-hover:text-blue-300'
                  }`} />
                  <span className="font-medium">{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
        
        {/* Bottom gradient glow */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-900/30 to-transparent pointer-events-none" />
      </aside>
    </>
  );
}
