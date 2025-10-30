// This is our initial "database" state.
export const initialState = {
  // All our products
  items: [
    { id: 'i1', name: 'Parle-G Biscuit', stock: 100, purchaseRate: 4, saleRate: 5 },
    { id: 'i2', name: 'Lays Chips (Blue)', stock: 50, purchaseRate: 18, saleRate: 20 },
    { id: 'i3', name: 'Coca-Cola (500ml)', stock: 30, purchaseRate: 35, saleRate: 40 },
  ],
  
  // Our customers (Debtors) and suppliers (Creditors)
  parties: [
    { id: 'p1', name: 'Ramesh Traders', type: 'Creditor', balance: -5000 }, // We owe them 5000
    { id: 'p2', name: 'Ankit General Store', type: 'Debtor', balance: 3500 }, // They owe us 3500
    { id: 'p3', name: 'Walk-in Customer', type: 'Debtor', balance: 0 },
  ],
  
  // Our transaction history
  transactions: [
    { 
      id: 't1', 
      type: 'Sale', 
      partyId: 'p2', 
      date: '2025-10-28',
      items: [{ itemId: 'i2', qty: 5, rate: 20 }],
      grandTotal: 100 
    },
    { 
      id: 't2', 
      type: 'Purchase', 
      partyId: 'p1', 
      date: '2025-10-27',
      items: [{ itemId: 'i3', qty: 20, rate: 35 }],
      grandTotal: 700 
    },
  ],
  
  // Shop settings (from AuthContext, but good to have a placeholder)
  settings: {
    shopName: 'My Kirana Store',
  },
};