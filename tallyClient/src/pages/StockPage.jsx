import React, { useState } from 'react';
import StockTable from '../components/features/StockTable';
import Button from '../components/common/Button';
import ItemForm from '../components/features/ItemForm'; // --- Import Form ---

export default function StockPage() {
  // --- State for modal ---
  const [showModal, setShowModal] = useState(false);
  // This state will hold the item we want to edit
  const [itemToEdit, setItemToEdit] = useState(null);

  const handleOpenModal = () => {
    setItemToEdit(null); // Clear any previous item
    setShowModal(true);
  };
  
  // This function will be passed to StockTable
  const handleEditItem = (item) => {
    setItemToEdit(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setItemToEdit(null); // Clear item on close
  };

  return (
    <div className="space-y-6">
      {/* --- Header with Button --- */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Stock Management</h1>
        <Button
          onClick={handleOpenModal}
          variant="primary"
          className="!w-auto"
        >
          + Add New Item
        </Button>
      </div>
      
      {/* --- Pass edit handler to table --- */}
      <StockTable onEditItem={handleEditItem} />

      {/* --- Render Modal Conditionally --- */}
      {showModal && (
        <ItemForm 
          itemToEdit={itemToEdit} 
          onClose={handleCloseModal} 
        />
      )}
    </div>
  );
}