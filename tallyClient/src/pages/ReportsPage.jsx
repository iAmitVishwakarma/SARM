import React from 'react';
import SalesChart from '../components/features/SalesChart';

export default function ReportsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Reports</h1>
      
      <div className="mx-auto max-w-4xl">
        <SalesChart />
      </div>

      {/* TODO: Add more reports here, e.g.,
        - GST Report
        - Profit & Loss
        - Expense Trend
      */}
    </div>
  );
}