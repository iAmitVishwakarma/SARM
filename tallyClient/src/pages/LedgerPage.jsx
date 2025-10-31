import React, { useState } from 'react'; // --- Import useState ---
import LedgerTable from '../components/features/LedgerTable';
import Button from '../components/common/Button';
import useData from '../hooks/useData';
import { exportToExcel } from '../services/excelService';
import PartyForm from '../components/features/PartyForm'; // --- Import Form ---

export default function LedgerPage() {
  const { parties } = useData();

  // --- State for modal ---
  const [showModal, setShowModal] = useState(false);
  const [partyToEdit, setPartyToEdit] = useState(null);

  const handleOpenModal = () => {
    setPartyToEdit(null);
    setShowModal(true);
  };
  
  const handleEditParty = (party) => {
    setPartyToEdit(party);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setPartyToEdit(null);
  };

  const handleExport = () => {
    const exportData = parties.map((p) => ({
      'Party Name': p.name,
      Type: p.type,
      Balance: p.balance,
      Status:
        p.balance > 0
          ? 'Lene Hain'
          : p.balance < 0
          ? 'Dene Hain'
          : 'Settled',
    }));

    exportToExcel(exportData, 'Party Ledger', 'SARM_Ledger_Report.xlsx');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Party Ledger (Hisaab-Kitaab)</h1>
        {/* --- Button Group --- */}
        <div className="flex space-x-2">
          <Button
            onClick={handleOpenModal}
            variant="primary"
            className="!w-auto"
          >
            + Add New Party
          </Button>
          <Button onClick={handleExport} variant="secondary" className="!w-auto">
            Export to Excel
          </Button>
        </div>
      </div>
      
      {/* --- Pass edit handler to table --- */}
      <LedgerTable onEditParty={handleEditParty} />

      {/* --- Render Modal Conditionally --- */}
      {showModal && (
        <PartyForm 
          partyToEdit={partyToEdit} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}