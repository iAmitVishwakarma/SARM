import mongoose from 'mongoose';

const partySchema = new mongoose.Schema(
  {
    // Har party bhi ek user se linked hogi
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    // Tally Analogy: Group (Sundry Debtor or Sundry Creditor)
    type: {
      type: String,
      required: true,
      enum: ['Debtor', 'Creditor'], // Sirf ye do values ho sakti hain
    },
    phone: {
      type: String,
      default: '',
    },
    gstin: {
      type: String,
      default: '',
    },
    // Tally Analogy: Ledger Balance (kitna lena hai / dena hai)
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Party = mongoose.model('Party', partySchema);
export default Party;