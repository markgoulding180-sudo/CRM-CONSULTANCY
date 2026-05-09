import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar />
      
      {/* Main content area - offset by sidebar width on desktop */}
      <div className="lg:ml-64 min-h-screen flex flex-col">
        <Header />
        
        <main className="flex-1 p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
