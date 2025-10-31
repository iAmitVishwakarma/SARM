import asyncHandler from 'express-async-handler';
import Transaction from '../models/transactionModel.js';
import Item from '../models/itemModel.js';
import Party from '../models/partyModel.js';
import mongoose from 'mongoose';

// @desc    Create a new transaction (Sale, Purchase, etc.)
// @route   POST /api/transactions
// @access  Private
const createTransaction = asyncHandler(async (req, res) => {
  const { party, type, date, items, subTotal, totalGst, grandTotal, notes } =
    req.body;

  // 1. Basic validation
  if (!party || !type || !items || items.length === 0) {
    res.status(400);
    throw new Error('Please provide party, type, and at least one item');
  }

  // --- Industry Level: Atomic Operations ---
  // Hum database "session" ka use karenge. Iska matlab hai, ya toh sab kuch
  // (Transaction create, Item update, Party update) ek saath hoga, ya kuch bhi nahi.
  // Isse data kabhi bhi corrupt nahi hoga.
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // 2. Create the Transaction
    const transaction = new Transaction({
      user: req.user._id,
      party,
      type,
      date,
      items,
      subTotal: Number(subTotal),
      totalGst: Number(totalGst),
      grandTotal: Number(grandTotal),
      notes,
    });

    const createdTransaction = await transaction.save({ session });

    // 3. Update Item Stock (Stock Summary)
    const stockUpdates = items.map(async (txItem) => {
      const { item: itemId, qty } = txItem;
      const quantity = Number(qty);
      let stockChange = 0;

      if (type === 'Sale' || type === 'PurchaseReturn') {
        stockChange = -quantity; // Stock kam hoga
      } else if (type === 'Purchase' || type === 'SalesReturn') {
        stockChange = quantity; // Stock badhega
      }

      return Item.updateOne(
        { _id: itemId, user: req.user._id }, // Security check: Item user ka hi ho
        { $inc: { currentStock: stockChange } }, // $inc = atomic increment/decrement
        { session }
      );
    });
    await Promise.all(stockUpdates);

    // 4. Update Party Balance (Ledger)
    let balanceChange = 0;
    const amount = Number(grandTotal);

    if (type === 'Sale' || type === 'PurchaseReturn') {
      balanceChange = amount; // Lene Hain (Balance badhega)
    } else if (type === 'Purchase' || type === 'SalesReturn') {
      balanceChange = -amount; // Dene Hain (Balance ghatega)
    }

    await Party.updateOne(
      { _id: party, user: req.user._id },
      { $inc: { balance: balanceChange } },
      { session }
    );

    // 5. Sab kuch safal raha, transaction ko commit karein
    await session.commitTransaction();
    res.status(201).json(createdTransaction);
  } catch (error) {
    // 6. Agar koi bhi error aaya, sab kuch rollback kar dein
    await session.abortTransaction();
    console.error(error);
    res.status(400);
    throw new Error('Transaction failed, rolling back changes. Error: ' + error.message);
  } finally {
    session.endSession();
  }
});

// @desc    Get all transactions (Tally "Day Book")
// @route   GET /api/transactions
// @access  Private
const getTransactions = asyncHandler(async (req, res) => {
  const transactions = await Transaction.find({ user: req.user._id })
    .populate('party', 'name type') // Party ka naam aur type bhi saath mein fetch karein
    .sort({ date: -1 }); // Naye transactions sabse upar

  res.status(200).json(transactions);
});

// @desc    Get a single transaction by ID
// @route   GET /api/transactions/:id
// @access  Private
const getTransactionById = asyncHandler(async (req, res) => {
  const transaction = await Transaction.findById(req.params.id)
    .populate('party', 'name email phone gstin')
    .populate('items.item', 'name hsnCode unit'); // Item details bhi fetch karein

  if (transaction && transaction.user.toString() === req.user._id.toString()) {
    res.status(200).json(transaction);
  } else {
    res.status(404);
    throw new Error('Transaction not found');
  }
});

export { createTransaction, getTransactions, getTransactionById };