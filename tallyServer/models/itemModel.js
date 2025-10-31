import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
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
    unit: {
      type: String,
      required: true,
      default: 'pcs',
    },
    // --- NEW FIELD ---
    gstRate: {
      type: Number, // Store GST as a percentage, e.g., 18 for 18%
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Item = mongoose.model('Item', itemSchema);
export default Item;