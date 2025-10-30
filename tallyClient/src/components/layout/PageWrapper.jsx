import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function PageWrapper() {
  return (
    <div className="flex h-screen bg-brand-light">
      <Sidebar />
      <main className="flex flex-1 flex-col overflow-auto">
        <Navbar />
        <div className="flex-1 p-6">
          <Outlet /> {/* This is where the actual page content will be rendered */}
        </div>
      </main>
    </div>
  );
}