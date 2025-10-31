// src/services/aiAssistant.js

// Constants for our alert thresholds
const LOW_STOCK_THRESHOLD = 20; // Alert if stock is below 20
const PENDING_PAYMENT_THRESHOLD = 1000; // Alert for pending payments over 1000

/**
 * Analyzes the current data state and returns an array of smart alerts.
 * @param {Array<Object>} items - The master list of items.
 * @param {Array<Object>} parties - The master list of parties.
 * @returns {Array<Object>} An array of alert objects.
 */
export const getSmartAlerts = (items, parties) => {
  const alerts = [];

  // 1. Low Stock Alerts
  const lowStockItems = items.filter(item => item.stock < LOW_STOCK_THRESHOLD);
  lowStockItems.forEach(item => {
    alerts.push({
      id: `ls-${item.id}`,
      type: 'warning',
      message: `Low Stock: "${item.name}" is down to ${item.stock} units.`,
    });
  });

  // 2. Pending Payment Alerts
  const pendingDebtors = parties.filter(party => 
    party.type === 'Debtor' && party.balance >= PENDING_PAYMENT_THRESHOLD
  );
  pendingDebtors.forEach(party => {
    alerts.push({
      id: `pp-${party.id}`,
      type: 'info',
      message: `Payment Pending: "${party.name}" owes ${party.balance.toFixed(2)}.`,
    });
  });
  
  if (alerts.length === 0) {
    alerts.push({ id: 'all-good', type: 'success', message: 'All clear! No immediate alerts.' });
  }

  return alerts;
};