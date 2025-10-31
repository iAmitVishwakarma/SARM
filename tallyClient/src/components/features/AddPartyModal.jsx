import React, { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';
import useData from '../../hooks/useData';

export default function AddPartyModal({ isOpen, onClose }) {
  const { addParty } = useData();
  const [name, setName] = useState('');
  const [type, setType] = useState('Debtor'); // Default 'Customer'
  const [balance, setBalance] = useState(0);
  const [phone, setPhone] = useState('');
  const [gstin, setGstin] = useState('');

  const handleSubmit = async () => {
    try {
      await addParty({ name, type, balance, phone, gstin });
      alert('Party Added!');
      onClose(); // Modal band karein
    } catch (error) {
      alert('Error adding party. Please try again.');
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      title="Add New Party (Customer/Supplier)"
      onClose={onClose}
      onConfirm={handleSubmit}
      confirmText="Save Party"
    >
      <div className="space-y-4">
        <Input label="Party Name" value={name} onChange={(e) => setName(e.target.value)} required />
        <Select label="Party Type" value={type} onChange={(e) => setType(e.target.value)} required>
          <option value="Debtor">Debtor (Customer)</option>
          <option value="Creditor">Creditor (Supplier)</option>
        </Select>
        <Input label="Opening Balance" type="number" value={balance} onChange={(e) => setBalance(e.target.value)} />
        <Input label="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Input label="GSTIN" value={gstin} onChange={(e) => setGstin(e.target.value)} />
      </div>
    </Modal>
  );
}