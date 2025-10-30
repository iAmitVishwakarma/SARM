import React, { createContext, useReducer } from 'react';
import { initialState } from '../data/mockData';
import { DATA_ACTIONS, TRANSACTION_TYPES } from '../utils/constants';

// 1. Create the Context
const DataContext = createContext(null);

// 2. Define the Reducer Function
// This function contains all our business logic
const dataReducer = (state, action) => {
  switch (action.type) {
    
    case DATA_ACTIONS.ADD_TRANSACTION: {
      const newTransaction = action.payload;
      
      // --- This is the core logic ---
      // 1. Update Stock
      const newItems = state.items.map(item => {
        const txItem = newTransaction.items.find(i => i.itemId === item.id);
        if (!txItem) return item; // Not in this transaction

        let newStock = item.stock;
        const type = newTransaction.type;
        
        if (type === TRANSACTION_TYPES.SALE || type === TRANSACTION_TYPES.PURCHASE_RETURN) {
          newStock -= txItem.qty; // Stock goes down
        } else if (type === TRANSACTION_TYPES.PURCHASE || type === TRANSACTION_TYPES.SALES_RETURN) {
          newStock += txItem.qty; // Stock goes up
        }
        
        return { ...item, stock: newStock };
      });

      // 2. Update Party Balance
      const newParties = state.parties.map(party => {
        if (party.id !== newTransaction.partyId) return party;

        let newBalance = party.balance;
        const type = newTransaction.type;
        const total = newTransaction.grandTotal;

        if (type === TRANSACTION_TYPES.SALE || type === TRANSACTION_TYPES.PURCHASE_RETURN) {
          newBalance += total; // They owe us more (Debtor) OR We owe them less (Creditor)
        } else if (type === TRANSACTION_TYPES.PURCHASE || type === TRANSACTION_TYPES.SALES_RETURN) {
          newBalance -= total; // We owe them more (Creditor) OR They owe us less (Debtor)
        }
        
        return { ...party, balance: newBalance };
      });

      // 3. Return the new state
      return {
        ...state,
        items: newItems,
        parties: newParties,
        transactions: [newTransaction, ...state.transactions], // Add to top
      };
    }
    
    default:
      return state;
  }
};

// 3. Create the Provider Component
export default function DataProvider({ children }) {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  const value = {
    state,
    dispatch,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

// 4. Export the context (for the hook)
export { DataContext };