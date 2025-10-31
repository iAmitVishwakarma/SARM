import React, { useState, useEffect } from 'react';
import useData from '../../hooks/useData';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Select from '../common/Select';

const initialState = {
  name: '',
  type: 'Debtor',
  phone: '',
  gstin: '',
  balance: 0,
};

export default function PartyForm({ partyToEdit, onClose }) {
  const [formData, setFormData] = useState(initialState);
  const { dispatch } = useData();

  useEffect(() => {
    if (partyToEdit) {
      setFormData({
        name: partyToEdit.name || '',
        type: partyToEdit.type || 'Debtor',
        phone: partyToEdit.phone || '',
        gstin: partyToEdit.gstin || '',
        balance: partyToEdit.balance || 0,
      });
    } else {
      setFormData(initialState);
    }
  }, [partyToEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const partyData = {
        ...formData,
        balance: parseFloat(formData.balance),
      };

      if (partyToEdit) {
        await dispatch.updateParty(partyToEdit._id, partyData);
      } else {
        await dispatch.addParty(partyData);
      }
      onClose();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || 'Could not save party.'}`);
    }
  };

  return (
    <Modal
      title={partyToEdit ? 'Edit Party' : 'Add New Party'}
      onClose={onClose}
      onConfirm={handleSubmit}
      confirmText={partyToEdit ? 'Save Changes' : 'Add Party'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          name="name"
          label="Party Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Select
          id="type"
          name="type"
          label="Party Type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="Debtor">Customer (Debtor)</option>
          <option value="Creditor">Supplier (Creditor)</option>
        </Select>
        <Input
          id="phone"
          name="phone"
          label="Phone Number (Optional)"
          value={formData.phone}
          onChange={handleChange}
        />
        <Input
          id="gstin"
          name="gstin"
          label="GSTIN (Optional)"
          value={formData.gstin}
          onChange={handleChange}
        />
        <Input
          id="balance"
          name="balance"
          label="Opening Balance (Hisaab)"
          type="number"
          value={formData.balance}
          onChange={handleChange}
          // Disable opening balance if editing
          disabled={!!partyToEdit}
        />
        <button type="submit" className="hidden"></button>
      </form>
    </Modal>
  );
}