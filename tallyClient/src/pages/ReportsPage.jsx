import React from 'react';
import SalesChart from '../components/features/SalesChart';
import ProfitLossReport from '../components/features/ProfitLossReport'; // --- IMPORT NEW COMPONENT ---

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>

      {/* --- NEW COMPONENT ADDED --- */}
      <ProfitLossReport />
<br />
<hr />
     <div className="space-y-6">
        <h1 className="text-3xl font-bold">Sales Trend (Last 30 Days)</h1>
        <SalesChart />
      </div>

      {/* TODO: Add more reports here, e.g.,
        - GST Report
        - Expense Trend
      */}
    </div>
  );
}