import { Search, Bell, Menu } from 'lucide-react';

export default function Header({ setMobileOpen }) {
  return (
    <header className="topbar">
      <button 
        className="btn btn-ghost lg:hidden"
        onClick={() => setMobileOpen(true)}
        style={{ padding: '8px', height: 'auto' }}
      >
        <Menu size={20} />
      </button>

      <div className="topbar-search">
        <Search size={16} />
        <input type="text" placeholder="Search contacts, deals..." />
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button className="btn btn-ghost" style={{ padding: '8px', height: 'auto' }}>
          <Bell size={20} />
        </button>
        <div style={{ 
          width: '36px', 
          height: '36px', 
          borderRadius: '10px', 
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: 600,
          fontSize: '13px'
        }}>
          MG
        </div>
      </div>
    </header>
  );
}
