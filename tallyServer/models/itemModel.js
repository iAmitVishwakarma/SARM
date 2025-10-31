import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    // Har item ek user (shop) se linked hoga
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // 'User' model se link karega
    },
    name: {
      type: String,
      required: true,
    },
    hsnCode: {
      type: String,
      default: '',
    },
    currentStock: {
      type: Number,
      required: true,
      default: 0,
    },
    purchaseRate: {
      type: Number,
      required: true,
      default: 0,
    },
    saleRate: {
      type: Number,
      required: true,
      default: 0,
    },
    // Tally Analogy: Unit of Measure (e.g., "pcs", "kg", "ft")
    unit: {
      type: String,
      required: true,
      default: 'pcs',
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;