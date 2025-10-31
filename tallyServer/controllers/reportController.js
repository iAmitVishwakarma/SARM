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
  // Note: Yeh server ke time par based hai. Production ke liye behtar timezoning zaroori hai.
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Start of today
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

  try {
    // Hum saare calculations parallel mein run karenge
    const [salesTodayData, stockValueData, pendingDebtorsData, recentTxs] =
      await Promise.all([
        
        // A. Calculate Sales Today (Tally Day Book Summary)
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

        // B. Calculate Total Stock Value (Tally Stock Summary)
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

        // C. Calculate Pending Debtors (Tally Outstanding)
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

        // D. Get 5 Recent Transactions (Tally Day Book)
        Transaction.find({ user: userId })
          .populate('party', 'name')
          .sort({ createdAt: -1 })
          .limit(5),
      ]);

    // 4. Sab data ko ek JSON object mein format karein
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

  // Pichle 30 din ka data calculate karein
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
        // Date ke hisaab se group karein
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$date' },
          },
          totalSales: { $sum: '$grandTotal' },
        },
      },
      { $sort: { _id: 1 } }, // Date se sort karein
    ]);

    // Chart.js ke format mein data ko taiyaar karein
    const labels = salesData.map(d => new Date(d._id).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }));
    const data = salesData.map(d => d.totalSales);

    res.status(200).json({ labels, data });

  } catch (error) {
     res.status(500);
    throw new Error('Error fetching chart data: ' + error.message);
  }
});

export { getDashboardStats, getSalesChartData };