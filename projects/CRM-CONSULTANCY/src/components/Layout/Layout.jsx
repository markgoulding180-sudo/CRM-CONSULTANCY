import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Sidebar - fixed width */}
      <Sidebar />
      
      {/* Main content area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header />
        
        <main className="flex-1 p-6 overflow-auto">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
