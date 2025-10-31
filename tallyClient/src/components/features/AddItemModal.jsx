import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import useData from '../../hooks/useData';

export default function AddItemModal({ isOpen, onClose }) {
  const { addItem } = useData();
  const [name, setName] = useState('');
  const [unit, setUnit] = useState('pcs');
  const [purchaseRate, setPurchaseRate] = useState(0);
  const [saleRate, setSaleRate] = useState(0);
  const [currentStock, setCurrentStock] = useState(0);

  const handleSubmit = async () => {
    try {
      await addItem({ name, unit, purchaseRate, saleRate, currentStock });
      alert('Item Added!');
      onClose(); // Modal band karein
    } catch (error) {
      alert('Error adding item. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Add New Stock Item"
      onClose={onClose}
      onConfirm={handleSubmit}
      confirmText="Save Item"
    >
      <div className="space-y-4">
        <Input label="Item Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Input label="Unit (e.g., pcs, kg, ft)" value={unit} onChange={(e) => setUnit(e.target.value)} required />
        <Input label="Opening Stock" type="number" value={currentStock} onChange={(e) => setCurrentStock(e.target.value)} />
        <Input label="Purchase Rate" type="number" value={purchaseRate} onChange={(e) => setPurchaseRate(e.target.value)} />
        <Input label="Sale Rate" type="number" value={saleRate} onChange={(e) => setSaleRate(e.target.value)} />
      </div>
    </Modal>
  );
}