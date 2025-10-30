import React from 'react';
import LedgerTable from '../components/features/LedgerTable';
import Button from '../components/common/Button';
import useData from '../hooks/useData';
import { exportToExcel } from '../services/excelService'; // Import our new service

export default function LedgerPage() {
  const { parties } = useData(); // Get the data to export

  const handleExport = () => {
    // 1. We can re-format the data slightly for a cleaner export
    const exportData = parties.map(p => ({
      "Party Name": p.name,
      "Type": p.type,
      "Balance": p.balance,
      "Status": p.balance > 0 ? 'Lene Hain' : (p.balance < 0 ? 'Dene Hain' : 'Settled')
    }));

    // 2. Call the service
    exportToExcel(exportData, "Party Ledger", "SARM_Ledger_Report.xlsx");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Party Ledger (Hisaab-Kitaab)</h1>
        <Button onClick={handleExport} variant="secondary" className="!w-auto">
          Export to Excel
        </Button>
      </div>
      <LedgerTable />
    </div>
  );
}