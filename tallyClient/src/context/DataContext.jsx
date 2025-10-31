import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { DATA_ACTIONS } from '../utils/constants';
import { AuthContext } from './AuthContext'; // AuthContext ko import karein

const DataContext = createContext(null);

export default function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [parties, setParties] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const { isAuthenticated } = useContext(AuthContext);

  // --- Data Fetching Functions ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [itemsRes, partiesRes, txsRes] = await Promise.all([
        axios.get('/api/items'),
        axios.get('/api/parties'),
        axios.get('/api/transactions'),
      ]);
      setItems(itemsRes.data);
      setParties(partiesRes.data);
      setTransactions(txsRes.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    } else {
      setItems([]);
      setParties([]);
      setTransactions([]);
    }
  }, [isAuthenticated]);

  // --- Action Functions ---

  const addTransaction = async (newTransactionData) => {
    try {
      await axios.post('/api/transactions', newTransactionData);
      fetchAllData(); // Refresh all data
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error;
    }
  };

  // --- NEW FUNCTION: Add Item ---
  const addItem = async (itemData) => {
    try {
      await axios.post('/api/items', itemData);
      fetchAllData(); // Refresh all data
    } catch (error) {
      console.error('Failed to add item:', error);
      throw error;
    }
  };

  // --- NEW FUNCTION: Update Item ---
  const updateItem = async (itemId, itemData) => {
    try {
      await axios.put(`/api/items/${itemId}`, itemData);
      fetchAllData(); // Refresh all data
    } catch (error) {
      console.error('Failed to update item:', error);
      throw error;
    }
  };

  // --- NEW FUNCTION: Add Party ---
  const addParty = async (partyData) => {
    try {
      await axios.post('/api/parties', partyData);
      fetchAllData(); // Refresh all data
    } catch (error) {
      console.error('Failed to add party:', error);
      throw error;
    }
  };

  // --- NEW FUNCTION: Update Party ---
  const updateParty = async (partyId, partyData) => {
    try {
      await axios.put(`/api/parties/${partyId}`, partyData);
      fetchAllData(); // Refresh all data
    } catch (error) {
      console.error('Failed to update party:', error);
      throw error;
    }
  };

  const value = {
    items,
    parties,
    transactions,
    loading,
    refreshData: fetchAllData, // Expose refresh function
    
    // --- UPDATED DISPATCH ---
    dispatch: {
      [DATA_ACTIONS.ADD_TRANSACTION]: addTransaction,
      // We will add more later, e.g., ADD_PARTY, UPDATE_ITEM
      // --- NEW ACTIONS ---
      addItem,
      updateItem,
      addParty,
      updateParty,
    },
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export { DataContext };