import mongoose from 'mongoose';

// --- UPDATED SUB-SCHEMA ---
const transactionItemSchema = new mongoose.Schema({
  item: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Item',
  },
  qty: {
    type: Number,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  // Item-level total (qty * rate)
  total: {
    type: Number,
    required: true,
  },
  // --- NEW FIELD ---
  gstAmount: {
    type: Number,
    required: true,
    default: 0,
  }
});

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    party: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Party',
    },
    type: {
      type: String,
      required: true,
      enum: ['Sale', 'Purchase', 'SalesReturn', 'PurchaseReturn', 'Payment', 'Receipt'],
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    items: [transactionItemSchema],
    
    subTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    totalGst: {
      type: Number,
      required: true,
      default: 0,
    },
    grandTotal: {
      type: Number,
      required: true,
      default: 0,
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model('Transaction', transactionSchema);
export default Transaction;