import mongoose from 'mongoose';

// Yeh ek chota schema hai jo har transaction ke andar items ko store karega
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
});

const transactionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // Kis party (customer/supplier) ke saath transaction hua
    party: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Party',
    },
    // Tally Analogy: Voucher Type
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
    // Ek array jo uss transaction ke saare items ko store karega
    items: [transactionItemSchema],
    
    // Bill Totals
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
    // Tally Analogy: Narration
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