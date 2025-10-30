import { Routes, Route } from 'react-router-dom';
import { ROUTES } from '../utils/constants';

// Import Layouts & Protectors
import PageWrapper from '../components/layout/PageWrapper';
import ProtectedRoute from './ProtectedRoute'; // Import our new guard

// Import Pages
import DashboardPage from '../pages/DashboardPage';
import LoginPage from '../pages/LoginPage';
import AddEntryPage from '../pages/AddEntryPage';
import StockPage from '../pages/StockPage';
import LedgerPage from '../pages/LedgerPage';
import ReportsPage from '../pages/ReportsPage';
import SettingsPage from '../pages/SettingsPage';

export default function AppRouter() {
  return (
    <Routes>
      {/* Public route */}
      <Route path={ROUTES.LOGIN} element={<LoginPage />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<PageWrapper />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.ADD_ENTRY} element={<AddEntryPage />} />
          <Route path={ROUTES.STOCK} element={<StockPage />} />
          <Route path={ROUTES.LEDGER} element={<LedgerPage />} />
          <Route path={ROUTES.REPORTS} element={<ReportsPage />} />
          <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
        </Route>
      </Route>
      
      {/* TODO: Add a 404 Not Found route */}
    </Routes>
  );
}