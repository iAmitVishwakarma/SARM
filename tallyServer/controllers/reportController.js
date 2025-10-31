import asyncHandler from 'express-async-handler';
import Transaction from '../models/transactionModel.js';
import Item from '../models/itemModel.js';
import Party from '../models/partyModel.js';

// @desc    Get aggregated stats for the dashboard
// @route   GET /api/reports/dashboard
// @access  Private
const getDashboardStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // 1. Get today's date range (IST)
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

  try {
    const [salesTodayData, stockValueData, pendingDebtorsData, recentTxs] =
      await Promise.all([
        // A. Calculate Sales Today
        Transaction.aggregate([
          {
            $match: {
              user: userId,
              type: 'Sale',
              date: { $gte: today, $lt: tomorrow },
            },
          },
          {
            $group: {
              _id: null,
              totalSales: { $sum: '$grandTotal' },
            },
          },
        ]),

        // B. Calculate Total Stock Value
        Item.aggregate([
          { $match: { user: userId } },
          {
            $group: {
              _id: null,
              totalValue: {
                $sum: { $multiply: ['$currentStock', '$purchaseRate'] },
              },
              totalItems: { $sum: 1 },
            },
          },
        ]),

        // C. Calculate Pending Debtors
        Party.aggregate([
          {
            $match: {
              user: userId,
              type: 'Debtor',
              balance: { $gt: 0 },
            },
          },
          {
            $group: {
              _id: null,
              totalDue: { $sum: '$balance' },
            },
          },
        ]),

        // D. Get 5 Recent Transactions
        Transaction.find({ user: userId })
          .populate('party', 'name')
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    const stats = {
      salesToday: salesTodayData[0]?.totalSales || 0,
      stockValue: stockValueData[0]?.totalValue || 0,
      totalItems: stockValueData[0]?.totalItems || 0,
      pendingDebtors: pendingDebtorsData[0]?.totalDue || 0,
      recentTransactions: recentTxs,
    };

    res.status(200).json(stats);
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching dashboard stats: ' + error.message);
  }
});

// @desc    Get data for sales chart
// @route   GET /api/reports/sales-chart
// @access  Private
const getSalesChartData = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  thirtyDaysAgo.setHours(0, 0, 0, 0);

  try {
    const salesData = await Transaction.aggregate([
      {
        $match: {
          user: userId,
          type: 'Sale',
          date: { $gte: thirtyDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          totalSales: { $sum: '$grandTotal' },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const labels = salesData.map((d) =>
      new Date(d._id).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
      })
    );
    const data = salesData.map((d) => d.totalSales);

    res.status(200).json({ labels, data });
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching chart data: ' + error.message);
  }
});

// --- NEW FUNCTION ---
// @desc    Get Profit & Loss data
// @route   GET /api/reports/profit-loss
// @access  Private
const getProfitAndLoss = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  try {
    // 1. Aggregate all transaction types
    const results = await Transaction.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: '$type', // Group by transaction type (Sale, Purchase, Payment, etc.)
          totalAmount: { $sum: '$grandTotal' },
        },
      },
    ]);

    // 2. Process the results into a simple object
    const totals = {
      Sale: 0,
      SalesReturn: 0,
      Purchase: 0,
      PurchaseReturn: 0,
      Payment: 0, // This is our Expense
    };

    results.forEach((r) => {
      if (totals.hasOwnProperty(r._id)) {
        totals[r._id] = r.totalAmount;
      }
    });

    // 3. Calculate P&L
    const netSales = totals.Sale - totals.SalesReturn;
    const netPurchases = totals.Purchase - totals.PurchaseReturn;
    // Note: This is a simple P&L. A real one also needs Opening/Closing Stock.
    // For now, Gross Profit = Net Sales - Net Purchases
    const grossProfit = netSales - netPurchases;
    // Net Profit = Gross Profit - Expenses
    const netProfit = grossProfit - totals.Payment;

    res.status(200).json({
      netSales,
      netPurchases,
      totalExpenses: totals.Payment,
      grossProfit,
      netProfit,
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error fetching P&L data: ' + error.message);
  }
});

export { getDashboardStats, getSalesChartData, getProfitAndLoss };