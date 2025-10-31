import React, { useState, useEffect } from 'react';
import useData from '../../hooks/useData';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import Select from '../common/Select';

const initialState = {
  name: '',
  unit: 'pcs',
  purchaseRate: 0,
  saleRate: 0,
  currentStock: 0,
  hsnCode: '',
  gstRate: 0, // --- ADDED ---
};

export default function ItemForm({ itemToEdit, onClose }) {
  const [formData, setFormData] = useState(initialState);
  const { dispatch } = useData();

  useEffect(() => {
    if (itemToEdit) {
      setFormData({
        name: itemToEdit.name || '',
        unit: itemToEdit.unit || 'pcs',
        purchaseRate: itemToEdit.purchaseRate || 0,
        saleRate: itemToEdit.saleRate || 0,
        currentStock: itemToEdit.currentStock || 0,
        hsnCode: itemToEdit.hsnCode || '',
        gstRate: itemToEdit.gstRate || 0, // --- ADDED ---
      });
    } else {
      setFormData(initialState);
    }
  }, [itemToEdit]);

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
      const itemData = {
        ...formData,
        purchaseRate: parseFloat(formData.purchaseRate),
        saleRate: parseFloat(formData.saleRate),
        currentStock: parseFloat(formData.currentStock),
        gstRate: parseFloat(formData.gstRate), // --- ADDED ---
      };

      if (itemToEdit) {
        await dispatch.updateItem(itemToEdit._id, itemData);
      } else {
        await dispatch.addItem(itemData);
      }
      onClose();
    } catch (error) {
      alert(`Error: ${error.response?.data?.message || 'Could not save item.'}`);
    }
  };

  return (
    <Modal
      title={itemToEdit ? 'Edit Item' : 'Add New Item'}
      onClose={onClose}
      onConfirm={handleSubmit}
      confirmText={itemToEdit ? 'Save Changes' : 'Add Item'}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="name"
          name="name"
          label="Item Name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Select
          id="unit"
          name="unit"
          label="Unit of Measure"
          value={formData.unit}
          onChange={handleChange}
          required
        >
          <option value="pcs">Pieces (pcs)</option>
          <option value="kg">Kilograms (kg)</option>
          <option value="ltr">Liters (ltr)</option>
          <option value="box">Box (box)</option>
          <option value="other">Other</option>
        </Select>
        <Input
          id="purchaseRate"
          name="purchaseRate"
          label="Purchase Rate"
          type="number"
          value={formData.purchaseRate}
          onChange={handleChange}
        />
        <Input
          id="saleRate"
          name="saleRate"
          label="Sale Rate"
          type="number"
          value={formData.saleRate}
          onChange={handleChange}
        />
        <Input
          id="currentStock"
          name="currentStock"
          label="Opening Stock"
          type="number"
          value={formData.currentStock}
          onChange={handleChange}
          disabled={!!itemToEdit}
        />
        <Input
          id="hsnCode"
          name="hsnCode"
          label="HSN Code (Optional)"
          value={formData.hsnCode}
          onChange={handleChange}
        />
        {/* --- NEW FIELD --- */}
        <Input
          id="gstRate"
          name="gstRate"
          label="GST Rate (%)"
          type="number"
          value={formData.gstRate}
          onChange={handleChange}
        />
        <button type="submit" className="hidden"></button>
      </form>
    </Modal>
  );
}