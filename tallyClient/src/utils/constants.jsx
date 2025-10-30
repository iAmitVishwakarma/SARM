// Route constants (from M2)
export const ROUTES = {
  DASHBOARD: '/',
  LOGIN: '/login',
  ADD_ENTRY: '/add-entry',
  STOCK: '/stock',
  LEDGER: '/ledger',
  REPORTS: '/reports',
  SETTINGS: '/settings',
};

// --- NEW ---
// Data Context Action Types
export const DATA_ACTIONS = {
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  // We will add more later, e.g., ADD_PARTY, UPDATE_ITEM
};

// --- NEW ---
// Transaction Types
export const TRANSACTION_TYPES = {
  SALE: 'Sale',
  PURCHASE: 'Purchase',
  SALES_RETURN: 'SalesReturn',
  PURCHASE_RETURN: 'PurchaseReturn',
};