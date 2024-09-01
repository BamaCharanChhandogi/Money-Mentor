import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  bankAccount: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'BankAccount'
  },
  amount: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  externalId: {
    type: String,
    required: true
  }
});

const Transactions = mongoose.model('Transaction', transactionSchema);
export default Transactions;