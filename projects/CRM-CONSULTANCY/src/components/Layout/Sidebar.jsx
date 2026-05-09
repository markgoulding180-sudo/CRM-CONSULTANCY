import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, Users, DollarSign, CheckSquare, 
  Calendar, FileText, Receipt, ChevronLeft, ChevronRight 
} from 'lucide-react';

const navItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/contacts', label: 'Contacts', icon: Users },
  { path: '/deals', label: 'Deals', icon: DollarSign },
  { path: '/tasks', label: 'Tasks', icon: CheckSquare },
  { path: '/calendar', label: 'Calendar', icon: Calendar },
  { path: '/activity', label: 'Activity', icon: FileText },
  { path: '/invoices', label: 'Invoices', icon: Receipt },
];

export default function Sidebar({ collapsed, toggleSidebar, mobileOpen, setMobileOpen }) {
  return (
    <>
      {/* Mobile Overlay */}
      <div 
        className={`sidebar-overlay ${mobileOpen ? 'open' : ''}`}
        onClick={() => setMobileOpen(false)}
      />

      {/* Sidebar */}
      <aside className={`sidebar ${collapsed ? 'collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo */}
        <div className="sidebar-logo">
          <div className="logo-icon">C</div>
          <span className="logo-text">CRM Pro</span>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '8px 0' }}>
          <div className="nav-section-label">Main</div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
            >
              <item.icon size={18} />
              <span className="nav-label">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Toggle */}
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {collapsed ? <ChevronRight size={18} /> : <><ChevronLeft size={18} /> Collapse</>}
        </button>
      </aside>
    </>
  );
}
