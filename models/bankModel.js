import mongoose from "mongoose";

const bankAccountSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  accountName: {
    type: String,
    required: true
  },
  accountType: {
    type: String,
    required: true
  },
  balance: {
    type: Number,
    required: true
  },
  institution: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  // This would be the token or ID provided by the banking API
  externalId: {
    type: String,
    required: true
  }
});

const BankAccounts = mongoose.model('BankAccount', bankAccountSchema);
export default BankAccounts;