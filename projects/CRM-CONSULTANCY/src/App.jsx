import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';

// Placeholder pages
function Dashboard() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Dashboard</h2>
      <p className="text-slate-600">Welcome to your CRM dashboard.</p>
    </div>
  );
}

function Contacts() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Contacts</h2>
      <p className="text-slate-600">Manage your contacts here.</p>
    </div>
  );
}

function Deals() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Deals</h2>
      <p className="text-slate-600">Track your deals and opportunities.</p>
    </div>
  );
}

function Tasks() {
  return (
    <div>
      <h2 className="text-2xl font-bold text-slate-900 mb-4">Tasks</h2>
      <p className="text-slate-600">Manage your tasks and to-dos.</p>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/deals" element={<Deals />} />
          <Route path="/tasks" element={<Tasks />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App
