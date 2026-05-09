import Sidebar from './Sidebar';
import Header from './Header';

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      
      <div className="lg:ml-64">
        <Header />
        
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
