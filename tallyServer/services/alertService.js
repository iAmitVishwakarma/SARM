import Item from '../models/itemModel.js';
import Party from '../models/partyModel.js';

const LOW_STOCK_THRESHOLD = 20;
const PENDING_PAYMENT_THRESHOLD = 1000;

/**
 * Ek specific user ke liye saare smart alerts generate karta hai.
 * @param {string} userId - User ki MongoDB ID
 * @returns {Array<string>} Alert messages ka ek array
 */
const generateAlertsForUser = async (userId) => {
  const alerts = [];

  try {
    // 1. Low Stock Alerts
    const lowStockItems = await Item.find({
      user: userId,
      currentStock: { $lt: LOW_STOCK_THRESHOLD },
    });
    lowStockItems.forEach((item) => {
      alerts.push(
        `Low Stock: "${item.name}" is down to ${item.currentStock} units.`
      );
    });

    // 2. Pending Payment Alerts
    const pendingDebtors = await Party.find({
      user: userId,
      type: 'Debtor',
      balance: { $gte: PENDING_PAYMENT_THRESHOLD },
    });
    pendingDebtors.forEach((party) => {
      alerts.push(
        `Payment Pending: "${party.name}" owes ${party.balance.toFixed(2)}.`
      );
    });

    if (alerts.length === 0) {
      alerts.push('All clear! No immediate alerts.');
    }

    return alerts;
  } catch (error) {
    console.error(`Failed to generate alerts for user ${userId}:`, error);
    return ['Error generating alerts.'];
  }
};

export { generateAlertsForUser };