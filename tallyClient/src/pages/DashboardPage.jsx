import React, { useMemo } from 'react';
import useData from '../hooks/useData';
import useAuth from '../hooks/useAuth';
import DashboardCard from '../components/features/DashboardCard';
import { formatCurrency, formatDate } from '../utils/formatters';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { generateInvoicePDF } from '../services/pdfService';
import { getSmartAlerts } from '../services/aiAssistant';


const alertStyles = {
  warning: 'bg-orange-100 text-orange-800',
  info: 'bg-blue-100 text-blue-800',
  success: 'bg-green-100 text-green-800',
};

export default function DashboardPage() {
  const { user } = useAuth();
  const { items, parties, transactions } = useData();

  // --- Dashboard Calculations ---
  // We use useMemo to prevent re-calculating on every render
  const stats = useMemo(() => {
    // 1. Stock Value
    const stockValue = items.reduce((total, item) => {
      return total + (item.stock * item.purchaseRate);
    }, 0);

    // 2. Pending Debtors
    const pendingDebtors = parties.reduce((total, party) => {
      // We only sum up balances for 'Debtors' that are positive (they owe us)
      if (party.type === 'Debtor' && party.balance > 0) {
        return total + party.balance;
      }
      return total;
    }, 0);
    
    // 3. Sales Today (Mock logic, as we don't have real-time dates yet)
    // For now, let's just sum all 'Sale' transactions from our mock data
const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
const salesToday = transactions
      .filter(tx => tx.type === 'Sale' && tx.date === today)
      .reduce((total, tx) => total + tx.grandTotal, 0);

    return { stockValue, pendingDebtors, salesToday };
  }, [items, parties, transactions]);
  
  // --- Get recent transactions ---
  const recentTransactions = transactions.slice(0, 5); // Get first 5
  
  // --- Get AI Insights (Placeholder for M10) ---
  // TODO: Get this from aiAssistant.js in M10
 const aiAlerts = useMemo(() => getSmartAlerts(items, parties), [items, parties]);

  const handleDownloadInvoice = (tx) => {
    const party = parties.find(p => p.id === tx.partyId);
    if (party) {
      generateInvoicePDF(tx, party, items, user);
    } else {
      alert("Error: Party not found for this transaction.");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.shopName || 'Admin'}
      </h1>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <DashboardCard
          title="Sales Today (All Time Demo)"
          value={formatCurrency(stats.salesToday)}
          icon="💰"
          note="Total of all sales in mock data"
        />
        <DashboardCard
          title="Total Stock Value"
          value={formatCurrency(stats.stockValue)}
          icon="📦"
          note={`${items.length} unique items`}
        />
        <DashboardCard
          title="Pending Debtors (Udaar)"
          value={formatCurrency(stats.pendingDebtors)}
          icon="🧾"
          note="Total amount to be collected"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* --- AI Insights (Placeholder) --- */}
        <Card>
          <h2 className="mb-4 text-xl font-semibold">Smart Alerts</h2>
          <ul className="space-y-2">
            {aiAlerts.map(alert => (
              <li key={alert.id} className="rounded-md bg-orange-100 p-3 text-sm text-orange-800">
                {alert.message}
              </li>
            ))}
          </ul>
        </Card>
        
        {/* --- Recent Transactions (Placeholder) --- */}
      
        <Card>
        <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>
        <ul className="space-y-3">
          {recentTransactions.map(tx => (
            <li key={tx.id} className="flex items-center justify-between border-b pb-2">
              <div>
                <p className="font-medium">{tx.type} (ID: {tx.id})</p>
                <p className="text-sm text-gray-600">
                  Party: {parties.find(p => p.id === tx.partyId)?.name}
                </p>
                <p className="text-sm text-gray-500">{formatDate(tx.date)}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{formatCurrency(tx.grandTotal)}</p>
                {/* --- NEW BUTTON --- */}
                <Button 
                  onClick={() => handleDownloadInvoice(tx)} 
                  variant="secondary" 
                  className="!w-auto !py-1 !px-2 !text-xs !mt-1"
                >
                  Download PDF
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </Card>
      </div>
    </div>
  );
}