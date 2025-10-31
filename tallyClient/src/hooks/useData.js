import { useContext } from 'react';
import { DataContext } from '../context/DataContext';

export default function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  // Ab hum poora context return karte hain
  return context;
}