// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import useData from '../../hooks/useData';
// import { DATA_ACTIONS, ROUTES, TRANSACTION_TYPES } from '../../utils/constants';

// // Import common components
// import Button from '../common/Button';
// import Input from '../common/Input';
// import Select from '../common/Select';
// import Card from '../common/Card';

// export default function AddEntryForm() {
//   const { parties, items, dispatch } = useData();
//   const navigate = useNavigate();

//   // --- Form State ---
//   const [type, setType] = useState(TRANSACTION_TYPES.SALE);
//   const [partyId, setPartyId] = useState('');
//   const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // Default to today
  
//   // This state holds the list of items being added to this one transaction
//   const [txItems, setTxItems] = useState([
//     { itemId: '', qty: 1, rate: 0 }
//   ]);
  
//   // --- Dynamic Item List Handlers ---
  

// useEffect(() => {
//     setTxItems(currentItems => 
//       currentItems.map(txItem => {
//         if (!txItem.itemId) return txItem; // Keep as is if no item is selected

//         const selectedItem = items.find(i => i.id === txItem.itemId);
//         if (!selectedItem) return txItem;

//         // Recalculate the rate based on the new type
//         const newRate = (type === TRANSACTION_TYPES.SALE || type === TRANSACTION_TYPES.SALES_RETURN)
//           ? selectedItem.saleRate
//           : selectedItem.purchaseRate;
        
//         return { ...txItem, rate: newRate };
//       })
//     );
//   }, [type, items]); // Dependency array: run when 'type' or 'items' list changes

//   // Handles changes to qty/rate/item in the items list
//   const handleItemChange = (index, field, value) => {
//     const newItems = [...txItems];
//     let updatedItem = { ...newItems[index], [field]: value };

//     // Auto-fill rate when item is selected
//     if (field === 'itemId') {
//       const selectedItem = items.find(i => i.id === value);
//       if (selectedItem) {
//         updatedItem.rate = (type === TRANSACTION_TYPES.SALE) 
//           ? selectedItem.saleRate 
//           : selectedItem.purchaseRate;
//       }
//     }
    
//     newItems[index] = updatedItem;
//     setTxItems(newItems);
//   };

//   const addNewItemRow = () => {
//     setTxItems([...txItems, { itemId: '', qty: 1, rate: 0 }]);
//   };

//   const removeItemRow = (index) => {
//     const newItems = txItems.filter((_, i) => i !== index);
//     setTxItems(newItems);
//   };

//   // --- Submission ---
//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (!partyId || txItems.some(item => !item.itemId)) {
//       alert('Please select a party and item for all rows.');
//       return;




//     }




//     // 1. Calculate totals
//     const subTotal = txItems.reduce((total, item) => total + (item.qty * item.rate), 0);
//     // TODO: Add GST calculation here
//     const grandTotal = subTotal; // Keeping it simple for now

//     // 2. Format the new transaction object
//     const newTransaction = {
//       id: `t${Date.now()}`, // Simple unique ID
//       type,
//       partyId,
//       date,
//       items: txItems.map(item => ({
//         ...item,
//         qty: parseFloat(item.qty),
//         rate: parseFloat(item.rate)
//       })),
//       grandTotal,
//     };

//     // 3. Dispatch the action to our global state
//     dispatch({
//       type: DATA_ACTIONS.ADD_TRANSACTION,
//       payload: newTransaction,
//     });

//     // 4. Navigate back to the dashboard
//     alert('Transaction Added!');
//     navigate(ROUTES.DASHBOARD);
//   };
  
//   // --- Calculate Totals for Display ---
//   const subTotal = txItems.reduce((total, item) => total + (item.qty * item.rate), 0);

//   return (
//     <Card>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         {/* --- Top Row: Type, Party, Date --- */}
//         <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
//           <Select id="type" label="Transaction Type" value={type} onChange={(e) => setType(e.target.value)} required>
//             <option value={TRANSACTION_TYPES.SALE}>Sale (बिक्री)</option>
//             <option value={TRANSACTION_TYPES.PURCHASE}>Purchase (खरीद)</option>
//             <option value={TRANSACTION_TYPES.SALES_RETURN}>Sales Return</option>
//             <option value={TRANSACTION_TYPES.PURCHASE_RETURN}>Purchase Return</option>
//           </Select>

//           <Select id="party" label="Party (Customer/Supplier)" value={partyId} onChange={(e) => setPartyId(e.target.value)} required>
//             <option value="">-- Select Party --</option>
//             {parties.map(party => (
//               <option key={party.id} value={party.id}>
//                 {party.name} ({party.type})
//               </option>
//             ))}
//           </Select>
          
//           <Input id="date" label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
//         </div>

//         {/* --- Items List --- */}
//         <div className="space-y-4">
//           <h3 className="text-lg font-medium">Items</h3>
//           {txItems.map((item, index) => (
//             <div key={index} className="grid grid-cols-12 gap-4 rounded-md border p-4">
//               <div className="col-span-5">
//                 <Select id={`item-${index}`} label="Item" value={item.itemId} onChange={(e) => handleItemChange(index, 'itemId', e.target.value)} required>
//                   <option value="">-- Select Item --</option>
//                   {items.map(i => (
//                     <option key={i.id} value={i.id}>{i.name}</option>
//                   ))}
//                 </Select>
//               </div>
//               <div className="col-span-2">
//                 <Input id={`qty-${index}`} label="Qty" type="number" value={item.qty} onChange={(e) => handleItemChange(index, 'qty', e.target.value)} min="0" required />
//               </div>
//               <div className="col-span-2">
//                 <Input id={`rate-${index}`} label="Rate" type="number" value={item.rate} onChange={(e) => handleItemChange(index, 'rate', e.target.value)} min="0" step="0.01" required />
//               </div>
//               <div className="col-span-2">
//                 <Input id={`total-${index}`} label="Total" type="number" value={(item.qty * item.rate).toFixed(2)} readOnly disabled />
//               </div>
//               <div className="col-span-1 flex items-end">
//                 {txItems.length > 1 && (
//                   <Button onClick={() => removeItemRow(index)} variant="secondary" className="!w-auto !p-2">X</Button>
//                 )}
//               </div>
//             </div>
//           ))}
//           <Button onClick={addNewItemRow} variant="secondary" className="!w-auto">
//             + Add Another Item
//           </Button>
//         </div>
        
//         {/* --- Totals & Submit --- */}
//         <div className="flex items-center justify-between border-t pt-6">
//           <div>
//             <span className="text-xl font-bold">Total: </span>
//             <span className="text-xl font-bold">₹{subTotal.toFixed(2)}</span>
//             {/* TODO: Add GST and Grand Total */}
//           </div>
//           <Button type="submit" variant="primary" className="!w-auto">
//             Save Transaction
//           </Button>
//         </div>
//       </form>
//     </Card>
//   );
// }


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
  const [txItems, setTxItems] = useState([{ itemId: '', qty: 1, rate: 0 }]);

  // Update item rates when type or items change
  useEffect(() => {
    setTxItems(current =>
      current.map(txItem => {
        if (!txItem.itemId) return txItem;
        const selectedItem = items.find(i => i.id === txItem.itemId);
        if (!selectedItem) return txItem;

        const rate =
          [TRANSACTION_TYPES.SALE, TRANSACTION_TYPES.SALES_RETURN].includes(type)
            ? selectedItem.saleRate
            : selectedItem.purchaseRate;

        return { ...txItem, rate };
      })
    );
  }, [type, items]);

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...txItems];
    const updatedItem = { ...updatedItems[index], [field]: value };

    if (field === 'itemId') {
      const selectedItem = items.find(i => i.id === value);
      if (selectedItem) {
        updatedItem.rate =
          type === TRANSACTION_TYPES.SALE ? selectedItem.saleRate : selectedItem.purchaseRate;
      }
    }

    updatedItems[index] = updatedItem;
    setTxItems(updatedItems);
  };

  const addNewItemRow = () => {
    setTxItems([...txItems, { itemId: '', qty: 1, rate: 0 }]);
  };

  const removeItemRow = index => {
    setTxItems(txItems.filter((_, i) => i !== index));
  };

  const subTotal = txItems.reduce((sum, item) => sum + item.qty * item.rate, 0);
  const grandTotal = subTotal; // TODO: Add GST logic

  const handleSubmit = async e => {
    e.preventDefault();

    if (!partyId || txItems.some(item => !item.itemId)) {
      alert('Please select a party and item for all rows.');
      return;
    }

    const newTransaction = {
      type,
      party: partyId,
      date,
      items: txItems.map(({ itemId, qty, rate }) => ({
        item: itemId,
        qty: parseFloat(qty),
        rate: parseFloat(rate),
        total: parseFloat(qty) * parseFloat(rate),
      })),
      subTotal,
      grandTotal,
      totalGst: 0,
      notes: '',
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
          <Select id="type" label="Transaction Type" value={type} onChange={e => setType(e.target.value)} required>
            <option value={TRANSACTION_TYPES.SALE}>Sale (बिक्री)</option>
            <option value={TRANSACTION_TYPES.PURCHASE}>Purchase (खरीद)</option>
            <option value={TRANSACTION_TYPES.SALES_RETURN}>Sales Return</option>
            <option value={TRANSACTION_TYPES.PURCHASE_RETURN}>Purchase Return</option>
          </Select>

          <Select id="party" label="Party (Customer/Supplier)" value={partyId} onChange={e => setPartyId(e.target.value)} required>
            <option value="">-- Select Party --</option>
            {parties.map(p => (
              <option key={p.id} value={p.id}>
                {p.name} ({p.type})
              </option>
            ))}
          </Select>

          <Input id="date" label="Date" type="date" value={date} onChange={e => setDate(e.target.value)} required />
        </div>

        {/* Items List */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Items</h3>
          {txItems.map((item, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 rounded-md border p-4">
              <div className="col-span-5">
                <Select
                  id={`item-${index}`}
                  label="Item"
                  value={item.itemId}
                  onChange={e => handleItemChange(index, 'itemId', e.target.value)}
                  required
                >
                  <option value="">-- Select Item --</option>
                  {items.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.name}
                    </option>
                  ))}
                </Select>
              </div>
              <div className="col-span-2">
                <Input
                  id={`qty-${index}`}
                  label="Qty"
                  type="number"
                  value={item.qty}
                  onChange={e => handleItemChange(index, 'qty', e.target.value)}
                  min="0"
                  required
                />
              </div>
              <div className="col-span-2">
                <Input
                  id={`rate-${index}`}
                  label="Rate"
                  type="number"
                  value={item.rate}
                  onChange={e => handleItemChange(index, 'rate', e.target.value)}
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div className="col-span-2">
                <Input
                  id={`total-${index}`}
                  label="Total"
                  type="number"
                  value={(item.qty * item.rate).toFixed(2)}
                  readOnly
                  disabled
                />
              </div>
              <div className="col-span-1 flex items-end">
                {txItems.length > 1 && (
                  <Button onClick={() => removeItemRow(index)} variant="secondary" className="!w-auto !p-2">
                    X
                  </Button>
                )}
              </div>
            </div>
          ))}
          <Button onClick={addNewItemRow} variant="secondary" className="!w-auto">
            + Add Another Item
          </Button>
        </div>

        {/* Totals & Submit */}
        <div className="flex items-center justify-between border-t pt-6">
          <div>
            <span className="text-xl font-bold">Total: </span>
            <span className="text-xl font-bold">₹{subTotal.toFixed(2)}</span>
          </div>
          <Button type="submit" variant="primary" className="!w-auto">
            Save Transaction
          </Button>
        </div>
      </form>
    </Card>
  );
}