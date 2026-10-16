import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Helper to find user by phone or email
async function findUser(db, identifier) {
  if (!identifier) throw new Error('A user phone number or email is required.');
  const user = await db.collection('users').findOne({
    $or: [{ phone: identifier }, { email: identifier }]
  });
  if (!user) throw new Error(`User not found with identifier: ${identifier}`);
  return user;
}

const ok = (text) => ({ content: [{ type: 'text', text }] });
const err = (text) => ({ content: [{ type: 'text', text }], isError: true });

// --- 18 FINANCIAL TOOLS DEFINITIONS ---
export const MCP_TOOLS = [
  {
    name: 'add_expense',
    description: 'Add an expense for a user. Required: userPhone (or email), amount, category.',
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string', description: "User's WhatsApp phone number or registered email" },
        amount: { type: 'number', description: 'Amount in dollars/currency' },
        category: { type: 'string', description: 'Expense category (Food, Travel, etc.)' },
        description: { type: 'string', description: 'Optional note' }
      },
      required: ['userPhone', 'amount', 'category']
    }
  },
  {
    name: 'get_budget_status',
    description: 'Get remaining budget for a category for the current month.',
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string', description: "User's phone or email" },
        category: { type: 'string', description: 'Budget category (e.g. Groceries, Housing & Rent)' }
      },
      required: ['userPhone', 'category']
    }
  },
  {
    name: 'create_budget',
    description: 'Creates a new monthly budget limit for a specific category.',
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string' },
        category: { type: 'string' },
        amount: { type: 'number', description: 'Budget limit for the month' }
      },
      required: ['userPhone', 'category', 'amount']
    }
  },
  {
    name: 'update_budget',
    description: 'Updates the limit amount for an existing budget category.',
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string' },
        category: { type: 'string' },
        newAmount: { type: 'number' }
      },
      required: ['userPhone', 'category', 'newAmount']
    }
  },
  {
    name: 'update_expense',
    description: 'Updates an existing expense amount. AI must confirm with user first.',
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string' },
        oldAmount: { type: 'number' },
        category: { type: 'string' },
        newAmount: { type: 'number' }
      },
      required: ['userPhone', 'oldAmount', 'category', 'newAmount']
    }
  },
  {
    name: 'delete_expense',
    description: 'Deletes an existing expense. AI must confirm with user before executing.',
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string' },
        amount: { type: 'number' },
        category: { type: 'string' }
      },
      required: ['userPhone', 'amount', 'category']
    }
  },
  {
    name: 'add_investment',
    description: "Add a new investment to the user's portfolio.",
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string' },
        symbol: { type: 'string', description: 'Ticker or crypto symbol (e.g. AAPL, BTC, TCS.NS)' },
        name: { type: 'string', description: 'Full asset name' },
        type: { type: 'string', enum: ['stock', 'bond', 'etf', 'mutual_fund', 'crypto', 'real_estate'] },
        quantity: { type: 'number' },
        purchasePrice: { type: 'number' },
        currentPrice: { type: 'number' }
      },
      required: ['userPhone', 'symbol', 'name', 'type', 'quantity', 'purchasePrice']
    }
  },
  {
    name: 'get_portfolio',
    description: "Retrieve user's investment portfolio with holdings and performance.",
    inputSchema: {
      type: 'object',
      properties: { userPhone: { type: 'string' } },
      required: ['userPhone']
    }
  },
  {
    name: 'update_investment',
    description: 'Updates the quantity of shares for an existing investment.',
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string' },
        symbol: { type: 'string' },
        additionalShares: { type: 'number', description: 'Shares added (negative = sold)' }
      },
      required: ['userPhone', 'symbol', 'additionalShares']
    }
  },
  {
    name: 'delete_investment',
    description: 'Removes an investment from the portfolio. AI must confirm with user first.',
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string' },
        symbol: { type: 'string' }
      },
      required: ['userPhone', 'symbol']
    }
  },
  {
    name: 'get_bank_balances',
    description: 'Fetches live Plaid bank balances for the user.',
    inputSchema: {
      type: 'object',
      properties: { userPhone: { type: 'string' } },
      required: ['userPhone']
    }
  },
  {
    name: 'get_recent_bank_transactions',
    description: 'Queries recent synced Plaid transactions to track spending history.',
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string' },
        limit: { type: 'number', description: 'Number of transactions to return (max 20)' }
      },
      required: ['userPhone']
    }
  },
  {
    name: 'split_family_expense',
    description: "Splits a shared family expense evenly among group members.",
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string' },
        amount: { type: 'number' },
        category: { type: 'string' },
        description: { type: 'string' }
      },
      required: ['userPhone', 'amount', 'category']
    }
  },
  {
    name: 'get_family_dues',
    description: "Retrieves all pending shared expenses the user owes to family group members.",
    inputSchema: {
      type: 'object',
      properties: { userPhone: { type: 'string' } },
      required: ['userPhone']
    }
  },
  {
    name: 'settle_shared_expense',
    description: "Marks a pending shared family expense as 'paid' for the user.",
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string' },
        category: { type: 'string' },
        amountOwed: { type: 'number' }
      },
      required: ['userPhone', 'category', 'amountOwed']
    }
  },
  {
    name: 'simulate_goal_impact',
    description: "Simulates how a financial change impacts a user's goals. Reads current goal progress.",
    inputSchema: {
      type: 'object',
      properties: { userPhone: { type: 'string' } },
      required: ['userPhone']
    }
  },
  {
    name: 'add_goal_contribution',
    description: 'Logs money saved towards a financial goal, increasing its progress.',
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string' },
        goalName: { type: 'string', description: "Name of the goal (e.g. 'Hawaii Trip')" },
        amount: { type: 'number' }
      },
      required: ['userPhone', 'goalName', 'amount']
    }
  },
  {
    name: 'create_goal',
    description: 'Creates a new financial goal with a target amount for the family group.',
    inputSchema: {
      type: 'object',
      properties: {
        userPhone: { type: 'string' },
        goalName: { type: 'string' },
        targetAmount: { type: 'number' },
        deadline: { type: 'string', description: 'Optional ISO date string' }
      },
      required: ['userPhone', 'goalName', 'targetAmount']
    }
  }
];

// --- TOOL EXECUTION LOGIC ---
export async function executeMcpTool(name, args) {
  const db = mongoose.connection.db;
  if (!db) throw new Error('Database not connected');

  if (name === 'add_expense') {
    const { userPhone, amount, category, description } = args;
    const user = await findUser(db, userPhone);
    await db.collection('expenses').insertOne({
      user: user._id,
      amount,
      category,
      description: description || '',
      date: new Date()
    });
    return ok(`Successfully added expense of $${amount} for category '${category}'.`);
  }

  if (name === 'get_budget_status') {
    const { userPhone, category } = args;
    const user = await findUser(db, userPhone);
    const budget = await db.collection('budgets').findOne({
      user: user._id,
      category: new RegExp(`^${category}$`, 'i')
    });
    if (!budget) return ok(`No budget set for category: ${category}.`);

    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);
    const agg = await db.collection('expenses').aggregate([
      { $match: { user: user._id, category: new RegExp(`^${category}$`, 'i'), date: { $gte: startOfMonth, $lte: endOfMonth } } },
      { $group: { _id: null, totalSpent: { $sum: '$amount' } } }
    ]).toArray();
    const totalSpent = agg.length > 0 ? agg[0].totalSpent : 0;
    const remaining = budget.amount - totalSpent;
    return ok(`Budget for ${category}: $${budget.amount}. Spent this month: $${totalSpent}. Remaining: $${remaining}.`);
  }

  if (name === 'create_budget') {
    const { userPhone, category, amount } = args;
    const user = await findUser(db, userPhone);
    await db.collection('budgets').updateOne(
      { user: user._id, category: new RegExp(`^${category}$`, 'i') },
      { $set: { amount, period: 'monthly', startDate: new Date() } },
      { upsert: true }
    );
    return ok(`Successfully set a monthly budget of $${amount} for '${category}'.`);
  }

  if (name === 'update_budget') {
    const { userPhone, category, newAmount } = args;
    const user = await findUser(db, userPhone);
    const result = await db.collection('budgets').updateOne(
      { user: user._id, category: new RegExp(`^${category}$`, 'i') },
      { $set: { amount: newAmount } }
    );
    if (result.matchedCount === 0) return ok(`No existing budget found for '${category}' to update.`);
    return ok(`Budget for '${category}' successfully updated to $${newAmount}.`);
  }

  if (name === 'update_expense') {
    const { userPhone, oldAmount, category, newAmount } = args;
    const user = await findUser(db, userPhone);
    const expense = await db.collection('expenses').findOne(
      { user: user._id, amount: oldAmount, category: new RegExp(`^${category}$`, 'i') },
      { sort: { date: -1 } }
    );
    if (!expense) return ok(`Could not find an expense matching $${oldAmount} in '${category}'.`);
    await db.collection('expenses').updateOne({ _id: expense._id }, { $set: { amount: newAmount } });
    return ok(`Successfully updated your ${category} expense from $${oldAmount} to $${newAmount}.`);
  }

  if (name === 'delete_expense') {
    const { userPhone, amount, category } = args;
    const user = await findUser(db, userPhone);
    const expense = await db.collection('expenses').findOne(
      { user: user._id, amount, category: new RegExp(`^${category}$`, 'i') },
      { sort: { date: -1 } }
    );
    if (!expense) return ok(`Could not find an expense matching $${amount} in '${category}'.`);
    await db.collection('expenses').deleteOne({ _id: expense._id });
    return ok(`Successfully deleted the $${amount} expense in '${category}'.`);
  }

  if (name === 'add_investment') {
    const { userPhone, symbol, name: iName, type, quantity, purchasePrice, currentPrice } = args;
    const user = await findUser(db, userPhone);
    await db.collection('investments').insertOne({
      user: user._id,
      symbol,
      name: iName,
      type,
      quantity,
      purchasePrice,
      currentPrice: currentPrice || purchasePrice,
      purchaseDate: new Date()
    });
    return ok(`Successfully added investment: ${quantity} shares of ${symbol} (${iName}) at $${purchasePrice}.`);
  }

  if (name === 'get_portfolio') {
    const { userPhone } = args;
    const user = await findUser(db, userPhone);
    const investments = await db.collection('investments').find({ user: user._id }).toArray();
    if (!investments.length) return ok('Your portfolio is currently empty.');
    let totalValue = 0, totalPurchase = 0;
    const breakdown = investments.map(inv => {
      const currentValue = inv.quantity * inv.currentPrice;
      const purchaseValue = inv.quantity * inv.purchasePrice;
      const gainLoss = currentValue - purchaseValue;
      totalValue += currentValue;
      totalPurchase += purchaseValue;
      return `- ${inv.symbol} (${inv.name}): ${inv.quantity} shares, Current Value: $${currentValue.toFixed(2)} (Gain/Loss: ${gainLoss >= 0 ? '+' : ''}$${gainLoss.toFixed(2)})`;
    }).join('\n');
    const overallReturn = totalPurchase > 0 ? (((totalValue - totalPurchase) / totalPurchase) * 100).toFixed(2) : '0.00';
    return ok(`Total Portfolio Value: $${totalValue.toFixed(2)} (Overall Return: ${overallReturn}%)\n\nHoldings:\n${breakdown}`);
  }

  if (name === 'update_investment') {
    const { userPhone, symbol, additionalShares } = args;
    const user = await findUser(db, userPhone);
    const inv = await db.collection('investments').findOne(
      { user: user._id, symbol: new RegExp(`^${symbol}$`, 'i') },
      { sort: { purchaseDate: -1 } }
    );
    if (!inv) return ok(`Could not find investment for '${symbol}'.`);
    const newQuantity = inv.quantity + additionalShares;
    if (newQuantity <= 0) return ok(`This would bring shares to ${newQuantity}. Use 'delete_investment' for full sell.`);
    await db.collection('investments').updateOne({ _id: inv._id }, { $set: { quantity: newQuantity } });
    return ok(`Updated '${symbol}' from ${inv.quantity} to ${newQuantity} shares.`);
  }

  if (name === 'delete_investment') {
    const { userPhone, symbol } = args;
    const user = await findUser(db, userPhone);
    const inv = await db.collection('investments').findOne(
      { user: user._id, symbol: new RegExp(`^${symbol}$`, 'i') },
      { sort: { purchaseDate: -1 } }
    );
    if (!inv) return ok(`Could not find investment for '${symbol}'.`);
    await db.collection('investments').deleteOne({ _id: inv._id });
    return ok(`Successfully removed '${symbol}' from your portfolio.`);
  }

  if (name === 'get_bank_balances') {
    const { userPhone } = args;
    const user = await findUser(db, userPhone);
    const accounts = await db.collection('accounts').find({ userId: user._id }).toArray();
    if (!accounts.length) return ok('You have no connected bank accounts via Plaid.');
    const balances = accounts.map(a => `- ${a.institutionName} (${a.accountName}): Available $${a.balance?.available || 0}, Current $${a.balance?.current || 0}`).join('\n');
    return ok(`Your connected bank balances:\n${balances}`);
  }

  if (name === 'get_recent_bank_transactions') {
    const { userPhone, limit = 5 } = args;
    const user = await findUser(db, userPhone);
    const limitVal = Math.min(limit, 20);
    const transactions = await db.collection('transactions').find({ userId: user._id }).sort({ date: -1 }).limit(limitVal).toArray();
    if (!transactions.length) return ok('No recent transactions found.');
    const history = transactions.map(t =>
      `[${new Date(t.date).toLocaleDateString()}] $${t.amount} at ${t.merchantName || t.name} (Category: ${Array.isArray(t.category) ? t.category.join(', ') : (t.category || 'Unknown')})`
    ).join('\n');
    return ok(`Recent Transactions:\n${history}`);
  }

  if (name === 'split_family_expense') {
    const { userPhone, amount, category, description } = args;
    const user = await findUser(db, userPhone);
    const group = await db.collection('familygroups').findOne({ 'members.user': user._id });
    if (!group) return ok("You don't belong to any Family Group. Please create or join one first in the Money-Mentor app.");
    const activeMembers = group.members.filter(m => m.status === 'active');
    if (!activeMembers.length) throw new Error('No active members found in the family group.');
    const splitAmount = parseFloat((amount / activeMembers.length).toFixed(2));
    const splits = activeMembers.map(m => ({
      user: m.user,
      amount: splitAmount,
      status: m.user.toString() === user._id.toString() ? 'paid' : 'pending'
    }));
    await db.collection('sharedexpenses').insertOne({
      familyGroup: group._id,
      paidBy: user._id,
      amount,
      category,
      description: description || '',
      date: new Date(),
      splits
    });
    return ok(`Split $${amount} for '${category}' among ${activeMembers.length} members ($${splitAmount} each).`);
  }

  if (name === 'get_family_dues') {
    const { userPhone } = args;
    const user = await findUser(db, userPhone);
    const dues = await db.collection('sharedexpenses').find({
      'splits': { $elemMatch: { user: user._id, status: 'pending' } }
    }).toArray();
    if (!dues.length) return ok('You have no pending family dues.');
    let totalDue = 0;
    const list = dues.map(d => {
      const mySplit = d.splits.find(s => s.user.toString() === user._id.toString());
      totalDue += mySplit.amount;
      return `- ${d.category} ($${d.amount} total): You owe $${mySplit.amount} (Note: ${d.description || 'None'})`;
    }).join('\n');
    return ok(`You owe a total of $${totalDue.toFixed(2)} in family shared expenses:\n${list}`);
  }

  if (name === 'settle_shared_expense') {
    const { userPhone, category, amountOwed } = args;
    const user = await findUser(db, userPhone);
    const expense = await db.collection('sharedexpenses').findOne({
      category: new RegExp(`^${category}$`, 'i'),
      'splits': { $elemMatch: { user: user._id, amount: amountOwed, status: 'pending' } }
    });
    if (!expense) return ok(`Could not find a pending shared expense of $${amountOwed} for '${category}'.`);
    await db.collection('sharedexpenses').updateOne(
      { _id: expense._id, 'splits.user': user._id },
      { $set: { 'splits.$.status': 'paid' } }
    );
    return ok(`Successfully settled your $${amountOwed} share for '${category}'.`);
  }

  if (name === 'simulate_goal_impact') {
    const { userPhone } = args;
    const user = await findUser(db, userPhone);
    const group = await db.collection('familygroups').findOne({ 'members.user': user._id });
    if (!group) return ok("You don't belong to any Family Group to track goals.");
    const goals = await db.collection('goals').find({ familyGroup: group._id }).toArray();
    if (!goals.length) return ok('No active goals found for your family group.');
    const summary = goals.map(g => {
      const remaining = g.targetAmount - (g.currentAmount || 0);
      return `- Goal '${g.name}': Target $${g.targetAmount}, Saved $${g.currentAmount || 0}, Remaining: $${remaining}. Deadline: ${g.deadline ? new Date(g.deadline).toLocaleDateString() : 'None'}. Status: ${g.status}.`;
    }).join('\n');
    return ok(`Current Goals Data:\n${summary}\n\n*System Note to AI*: Use this to simulate the impact of the user's hypothetical query.`);
  }

  if (name === 'add_goal_contribution') {
    const { userPhone, goalName, amount } = args;
    const user = await findUser(db, userPhone);
    const group = await db.collection('familygroups').findOne({ 'members.user': user._id });
    if (!group) return ok("You don't belong to any Family Group.");
    const goal = await db.collection('goals').findOne({
      familyGroup: group._id,
      name: new RegExp(`^${goalName}$`, 'i')
    });
    if (!goal) return ok(`Could not find goal '${goalName}'.`);
    const newAmount = (goal.currentAmount || 0) + amount;
    const isCompleted = newAmount >= goal.targetAmount;
    await db.collection('goals').updateOne(
      { _id: goal._id },
      {
        $set: { currentAmount: newAmount, ...(isCompleted ? { status: 'completed' } : {}) },
        $push: { contributions: { user: user._id, amount, date: new Date() } }
      }
    );
    return ok(`Added $${amount} towards '${goal.name}'. New total: $${newAmount}/${goal.targetAmount}.${isCompleted ? ' 🎉 Goal reached!' : ''}`);
  }

  if (name === 'create_goal') {
    const { userPhone, goalName, targetAmount, deadline } = args;
    const user = await findUser(db, userPhone);
    let group = await db.collection('familygroups').findOne({ 'members.user': user._id });
    if (!group) {
      const newGroup = await db.collection('familygroups').insertOne({
        name: `${user.name || 'My'} Family`,
        owner: user._id,
        members: [{ user: user._id, role: 'owner', status: 'active', joinedAt: new Date() }],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      group = { _id: newGroup.insertedId };
    }
    await db.collection('goals').insertOne({
      name: goalName,
      targetAmount,
      currentAmount: 0,
      familyGroup: group._id,
      deadline: deadline ? new Date(deadline) : null,
      status: 'in_progress',
      contributions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return ok(`Successfully created goal '${goalName}' with a target of $${targetAmount}.`);
  }

  throw new Error(`Unknown MCP tool: ${name}`);
}

// --- EXPRESS HTTP MCP ENDPOINT (JSON-RPC 2.0) ---
router.all('/', async (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json({
      service: 'Money-Mentor Model Context Protocol (MCP) Server',
      version: '2.0.0',
      toolsCount: MCP_TOOLS.length,
      protocol: 'JSON-RPC 2.0',
      description: 'Send JSON-RPC 2.0 POST requests with initialize, tools/list, or tools/call'
    });
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const body = req.body;
  if (!body) {
    return res.status(400).json({ jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } });
  }

  // MCP: initialize
  if (body.method === 'initialize') {
    return res.json({
      jsonrpc: '2.0',
      id: body.id,
      result: {
        protocolVersion: '2024-11-05',
        capabilities: { tools: {} },
        serverInfo: { name: 'money-mentor-express-mcp', version: '2.0.0' }
      }
    });
  }

  // MCP: tools/list
  if (body.method === 'tools/list') {
    return res.json({
      jsonrpc: '2.0',
      id: body.id,
      result: { tools: MCP_TOOLS }
    });
  }

  // MCP: tools/call
  if (body.method === 'tools/call') {
    const { name, arguments: args } = body.params || {};
    try {
      const result = await executeMcpTool(name, args || {});
      return res.json({ jsonrpc: '2.0', id: body.id, result });
    } catch (toolErr) {
      return res.json({
        jsonrpc: '2.0',
        id: body.id,
        result: { content: [{ type: 'text', text: `Error: ${toolErr.message}` }], isError: true }
      });
    }
  }

  // Default acknowledgement for notifications
  return res.json({ jsonrpc: '2.0', id: body.id ?? null, result: {} });
});

export default router;
