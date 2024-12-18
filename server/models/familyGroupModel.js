// models/familyGroupModel.js
import mongoose from "mongoose";

const familyGroupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member'
    }
  }],
  sharedExpenses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Expense'
  }],
  sharedBudget: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Budget'
  }
}, { timestamps: true });

const FamilyGroup = mongoose.model('FamilyGroup', familyGroupSchema);
export default FamilyGroup;