// controllers/sharedExpenseController.js
import SharedExpense from '../models/sharedExpenseModel.js';
import FamilyGroup from '../models/familyGroupModel.js';

export const createSharedExpense = async (req, res) => {
  try {
    const { familyGroupId, amount, category, description, splitType, splits } = req.body;
    
    // Validate family group membership
    const family = await FamilyGroup.findOne({
      _id: familyGroupId,
      'members.user': req.user.id
    });
    
    if (!family) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not a member of this family group' 
      });
    }

    // Create shared expense
    const sharedExpense = new SharedExpense({
      familyGroup: familyGroupId,
      paidBy: req.user.id,
      amount,
      category,
      description,
      splitType,
      splits: splits || family.members.map(member => ({
        user: member.user,
        amount: splitType === 'equal' ? amount / family.members.length : 0,
        status: 'pending'
      }))
    });
    
    await sharedExpense.save();

    // Optional: Emit socket event if you want to keep it here
    if (req.io) {
      req.io.to(`family_${familyGroupId}`).emit('shared_expense_created', sharedExpense);
    }

    res.status(201).json({ 
      success: true, 
      sharedExpense 
    });
  } catch (error) {
    console.error('Error creating shared expense:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const getSharedExpenses = async (req, res) => {
  try {
    const { familyGroupId } = req.params;
    
    // Validate family group membership
    const family = await FamilyGroup.findOne({
      _id: familyGroupId,
      'members.user': req.user.id
    });
    
    if (!family) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not a member of this family group' 
      });
    }

    const sharedExpenses = await SharedExpense.find({ 
      familyGroup: familyGroupId 
    }).populate('paidBy', 'name')
      .populate('splits.user', 'name');

    res.status(200).json({ 
      success: true, 
      sharedExpenses 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

export const updateSharedExpenseSplit = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { status } = req.body;

    const sharedExpense = await SharedExpense.findById(expenseId);
    
    if (!sharedExpense) {
      return res.status(404).json({ 
        success: false, 
        message: 'Shared expense not found' 
      });
    }

    // Find the user's split and update status
    const userSplit = sharedExpense.splits.find(
      split => split.user.toString() === req.user.id
    );

    if (!userSplit) {
      return res.status(403).json({ 
        success: false, 
        message: 'You are not part of this expense split' 
      });
    }

    userSplit.status = status;
    await sharedExpense.save();

    // Emit socket event
    req.io.to(`family_${sharedExpense.familyGroup}`).emit(
      'shared_expense_split_updated', 
      sharedExpense
    );

    res.status(200).json({ 
      success: true, 
      sharedExpense 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};