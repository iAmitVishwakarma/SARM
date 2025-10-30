import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/constants';
import useAuth from '../../hooks/useAuth';

// You can find free icons from libraries like 'react-icons' (e.g., 'react-icons/fi')
// For now, we'll use text
const NavLink = ({ to, children }) => (
  <li>
    <Link to={to} className="block rounded-lg px-4 py-2 text-gray-200 hover:bg-brand-blue/60">
      {children}
    </Link>
  </li>
);

export default function Sidebar() {

    const { logout } = useAuth();
  return (
    <aside className="w-64 flex-shrink-0 bg-brand-blue text-black">
      <div className="flex h-16 items-center justify-center p-4">
        <h2 className="text-2xl font-bold">SARM</h2>
      </div>
    <nav className="p-4">
        <ul>
          <NavLink to={ROUTES.DASHBOARD}>🏠 Dashboard</NavLink>
          <NavLink to={ROUTES.ADD_ENTRY}>➕ Add Entry</NavLink>
          <NavLink to={ROUTES.STOCK}>📦 Stock</NavLink>
          <NavLink to={ROUTES.LEDGER}>📒 Ledger</NavLink>
          <NavLink to={ROUTES.REPORTS}>📊 Reports</NavLink>
          <NavLink to={ROUTES.SETTINGS}>⚙️ Settings</NavLink>
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4">
       <button
          onClick={logout}
          className="block w-full rounded-lg px-4 py-2 text-left text-gray-200 hover:bg-brand-blue/60"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}