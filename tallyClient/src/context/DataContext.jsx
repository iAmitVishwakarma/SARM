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

  // Humein auth state chahiye taaki hum data tabhi fetch karein jab user logged in ho
  const { isAuthenticated } = useContext(AuthContext);

  // --- Data Fetching Functions ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Hum saara data parallel mein fetch karenge
      const [itemsRes, partiesRes, txsRes] = await Promise.all([
        axios.get('/api/items'),
        axios.get('/api/parties'),
        axios.get('/api/transactions'), // Yeh Tally "Day Book" hai
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

  // Jab user login kare (isAuthenticated = true), tab data fetch karein
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllData();
    } else {
      // Agar user logout kare, toh state ko clear kar dein
      setItems([]);
      setParties([]);
      setTransactions([]);
    }
  }, [isAuthenticated]);

  // --- Action Functions (Reducer ki jagah) ---
  
  // Yeh function 'AddEntryForm' se call hoga
  const addTransaction = async (newTransactionData) => {
    try {
      // 1. Naya transaction backend ko bhejein
      await axios.post('/api/transactions', newTransactionData);
      
      // 2. Data successfully create ho gaya, ab saara data refresh karein
      // (Tally ki tarah, entry karte hi har report update ho jaati hai)
      fetchAllData();
    } catch (error) {
      console.error('Failed to add transaction:', error);
      throw error; // Error ko form tak wapas bhejein taaki user ko pata chale
    }
  };
  
  const value = {
    // Current state
    items,
    parties,
    transactions,
    loading,
    
    // Actions (pehle 'dispatch' tha, ab yeh object hai)
    dispatch: {
      [DATA_ACTIONS.ADD_TRANSACTION]: addTransaction,
      // Hum yahaan aur actions add kar sakte hain, jaise:
      // addItem: (data) => ...
      // addParty: (data) => ...
    },
    
    // Function to manually refresh
    refreshData: fetchAllData,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export { DataContext };