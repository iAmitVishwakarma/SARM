import React from 'react';
import StockTable from '../components/features/StockTable';

export default function StockPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Stock Management</h1>
      <StockTable />
    </div>
  );
}