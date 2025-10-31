import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useData from '../../hooks/useData';
import { DATA_ACTIONS, ROUTES, TRANSACTION_TYPES } from '../../utils/constants';

import Button from '../common/Button';
import Input from '../common/Input';
import Select from '../common/Select';
import Card from '../common/Card';

export default function AddEntryForm() {
  const { parties, items, dispatch } = useData();
  const navigate = useNavigate();

  const [type, setType] = useState(TRANSACTION_TYPES.SALE);
  const [partyId, setPartyId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  // --- UPDATED ITEM STATE ---
  const [txItems, setTxItems] = useState([
    { itemId: '', qty: 1, rate: 0, gstRate: 0, gstAmount: 0, total: 0 },
  ]);

  const [isItemEntry, setIsItemEntry] = useState(true);
  const [amount, setAmount] = useState(0);
  const [notes, setNotes] = useState('');

  // --- Handle form type change ---
  useEffect(() => {
    const nonItemTypes = [
      TRANSACTION_TYPES.PAYMENT,
      TRANSACTION_TYPES.RECEIPT,
    ];
    setIsItemEntry(!nonItemTypes.includes(type));
  }, [type]);

  // --- Recalculate rates when type changes ---
  useEffect(() => {
    if (!isItemEntry) return;

    setTxItems((current) =>
      current.map((txItem) => {
        if (!txItem.itemId) return txItem;
        const selectedItem = items.find((i) => i._id === txItem.itemId);
        if (!selectedItem) return txItem;

        const rate = [
          TRANSACTION_TYPES.SALE,
          TRANSACTION_TYPES.SALES_RETURN,
        ].includes(type)
          ? selectedItem.saleRate
          : selectedItem.purchaseRate;
        
        // --- Recalculate GST and Total ---
        const itemTotal = txItem.qty * rate;
        const gstAmount = (itemTotal * selectedItem.gstRate) / 100;
        const total = itemTotal + gstAmount;

        return { ...txItem, rate, gstRate: selectedItem.gstRate, gstAmount, total };
      })
    );
  }, [type, items, isItemEntry]);

  // --- Handle changes in item rows ---
  const handleItemChange = (index, field, value) => {
    const updatedItems = [...txItems];
    const updatedItem = { ...updatedItems[index], [field]: value };

    // Auto-fill rate and GST when item is selected
    if (field === 'itemId') {
      const selectedItem = items.find((i) => i._id === value);
      if (selectedItem) {
        updatedItem.rate =
          type === TRANSACTION_TYPES.SALE
            ? selectedItem.saleRate
            : selectedItem.purchaseRate;
        updatedItem.gstRate = selectedItem.gstRate;
      }
    }

    // --- Recalculate totals for the row ---
    const itemTotal = updatedItem.qty * updatedItem.rate;
    const gstAmount = (itemTotal * updatedItem.gstRate) / 100;
    const total = itemTotal + gstAmount;
    
    updatedItem.gstAmount = gstAmount;
    updatedItem.total = total;

    updatedItems[index] = updatedItem;
    setTxItems(updatedItems);
  };

  const addNewItemRow = () => {
    setTxItems([
      ...txItems,
      { itemId: '', qty: 1, rate: 0, gstRate: 0, gstAmount: 0, total: 0 },
    ]);
  };

  const removeItemRow = (index) => {
    setTxItems(txItems.filter((_, i) => i !== index));
  };

  // --- CALCULATE GRAND TOTALS ---
  const subTotal = txItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const totalGst = txItems.reduce((sum, item) => sum + item.gstAmount, 0);
  const grandTotal = isItemEntry ? (subTotal + totalGst) : parseFloat(amount);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!partyId) {
      alert('Please select a party.');
      return;
    }
    if (isItemEntry && txItems.some((item) => !item.itemId)) {
      alert('Please select an item for all rows.');
      return;
    }
    if (!isItemEntry && (!amount || parseFloat(amount) <= 0)) {
      alert('Please enter a valid amount.');
      return;
    }

    const newTransaction = {
      type,
      party: partyId,
      date,
      items: isItemEntry
        ? txItems.map(({ itemId, qty, rate, gstAmount, total }) => ({
            item: itemId,
            qty: parseFloat(qty),
            rate: parseFloat(rate),
            gstAmount: parseFloat(gstAmount),
            total: parseFloat(qty) * parseFloat(rate), // Item-level total (pre-GST)
          }))
        : [],
      subTotal: isItemEntry ? subTotal : parseFloat(amount),
      totalGst: isItemEntry ? totalGst : 0,
      grandTotal: grandTotal,
      notes: notes,
    };

    try {
      await dispatch[DATA_ACTIONS.ADD_TRANSACTION](newTransaction);
      alert('Transaction Added!');
      navigate(ROUTES.DASHBOARD);
    } catch {
      alert('Error: Could not save transaction.');
    }
  };

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Transaction Info */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Select id="type" label="Transaction Type" value={type} onChange={(e) => setType(e.target.value)} required>
            <option value={TRANSACTION_TYPES.SALE}>Sale (बिक्री)</option>
            <option value={TRANSACTION_TYPES.PURCHASE}>Purchase (खरीद)</option>
            <option value={TRANSACTION_TYPES.PAYMENT}>Payment (Kharcha)</option>
            <option value={TRANSACTION_TYPES.RECEIPT}>Receipt (Paisa Aaya)</option>
            <option value={TRANSACTION_TYPES.SALES_RETURN}>Sales Return</option>
            <option value={TRANSACTION_TYPES.PURCHASE_RETURN}>Purchase Return</option>
          </Select>

          <Select id="party" label="Party" value={partyId} onChange={(e) => setPartyId(e.target.value)} required>
            <option value="">-- Select Party --</option>
            {parties.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name} ({p.type})
              </option>
            ))}
          </Select>

          <Input id="date" label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
        </div>

        {/* Conditional Fields */}
        {isItemEntry ? (
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Items</h3>
            {/* --- UPDATED ITEM ROW --- */}
            {txItems.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-4 rounded-md border p-4">
                <div className="col-span-12 md:col-span-4">
                  <Select id={`item-${index}`} label="Item" value={item.itemId} onChange={(e) => handleItemChange(index, 'itemId', e.target.value)} required>
                    <option value="">-- Select Item --</option>
                    {items.map((i) => (
                      <option key={i._id} value={i._id}>
                        {i.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <Input id={`qty-${index}`} label="Qty" type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} min="0" required/>
                </div>
                <div className="col-span-6 md:col-span-2">
                  <Input id={`rate-${index}`} label="Rate" type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} min="0" step="0.01" required/>
                </div>
                <div className="col-span-6 md:col-span-1">
                  <Input id={`gst-${index}`} label="GST(%)" type="number" value={item.gstRate} readOnly disabled />
                </div>
                <div className="col-span-6 md:col-span-2">
                  <Input id={`total-${index}`} label="Total+GST" type="number" value={item.total.toFixed(2)} readOnly disabled/>
                </div>
                <div className="col-span-12 md:col-span-1 flex items-end">
                  {txItems.length > 1 && (
                    <Button onClick={() => removeItemRow(index)} variant="secondary" className="!w-auto !p-2">X</Button>
                  )}
                </div>
              </div>
            ))}
            <Button onClick={addNewItemRow} variant="secondary" className="!w-auto">
              + Add Another Item
            </Button>
          </div>
        ) : (
          <div className="space-y-4 rounded-md border p-4">
            <h3 className="text-lg font-medium">Details</h3>
            <Input id="amount" label="Amount (रुपये)" type="number" placeholder="0.00" value={amount} onChange={(e) => setAmount(e.target.value)} required/>
          </div>
        )}

        <Input id="notes" label="Notes (Narration)" type="text" placeholder="Add a description..." value={notes} onChange={(e) => setNotes(e.target.value)} />

        {/* Totals & Submit */}
        <div className="flex flex-col items-end border-t pt-6 md:flex-row md:items-center md:justify-between">
          {/* --- UPDATED TOTALS SECTION --- */}
          <div className="text-right md:text-left">
            {isItemEntry && (
              <>
                <div className="text-md text-gray-600">
                  Subtotal: ₹{subTotal.toFixed(2)}
                </div>
                <div className="text-md text-gray-600">
                  Total GST: ₹{totalGst.toFixed(2)}
                </div>
              </>
            )}
            <div className="text-xl font-bold">
              Grand Total: ₹{grandTotal.toFixed(2)}
            </div>
          </div>
          <Button type="submit" variant="primary" className="!w-auto mt-4 md:mt-0">
            Save Transaction
          </Button>
        </div>
      </form>
    </Card>
  );
}