import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import { z } from "zod";

import Users from '../models/userModel.js';
import Expenses from '../models/expenseModel.js';
import Budgets from '../models/budgetsModel.js';
import Investment from '../models/InvestmentModel.js';
import Account from '../models/bankModel.js';
import Transaction from '../models/transactionModel.js';
import FamilyGroup from '../models/familyGroupModel.js';
import SharedExpense from '../models/sharedExpenseModel.js';
import Goal from '../models/Goal.js';

// Setup MCP Server
const server = new McpServer({
  name: "money-mentor",
  version: "1.0.0"
});

// Helper function to find user by phone (acting as WhatsApp identifier)
const findUser = async (phone) => {
  if (!phone) throw new Error("A phone number is required.");
  const user = await Users.findOne({ phone });
  if (!user) throw new Error(`User not found with phone number: ${phone}`);
  return user;
};

// Tool: add_expense
server.tool(
  "add_expense",
  "Add an expense for a user. Required inputs: userPhone, amount, category.",
  {
    userPhone: z.string().describe("User's WhatsApp phone number (must match DB)"),
    amount: z.number().describe("Amount of the expense in dollars"),
    category: z.string().describe("Category of the expense (e.g., Food, Travel, Groceries)"),
    description: z.string().optional().describe("Optional short description or note")
  },
  async ({ userPhone, amount, category, description }) => {
    try {
      const user = await findUser(userPhone);
      const newExpense = new Expenses({
        user: user._id,
        amount,
        category,
        description
      });
      await newExpense.save();
      return {
        content: [{ type: "text", text: `Successfully added expense of $${amount} for category '${category}'.` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error adding expense: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool: get_budget_status
server.tool(
  "get_budget_status",
  "Get the remaining budget for a specific category for the current month.",
  {
    userPhone: z.string().describe("User's WhatsApp phone number"),
    category: z.string().describe("Category of the budget (e.g., Groceries)")
  },
  async ({ userPhone, category }) => {
    try {
      const user = await findUser(userPhone);
      
      const budget = await Budgets.findOne({ user: user._id, category: new RegExp(`^${category}$`, 'i') });
      if (!budget) {
         return {
            content: [{ type: "text", text: `No budget set for category: ${category}.` }]
         };
      }
      
      // Calculate start and end of current month
      const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
      const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59);

      const expenses = await Expenses.aggregate([
        { 
          $match: { 
            user: user._id, 
            category: new RegExp(`^${category}$`, 'i'),
            date: { $gte: startOfMonth, $lte: endOfMonth }
          }
        },
        { 
          $group: { 
            _id: null, 
            totalSpent: { $sum: "$amount" } 
          }
        }
      ]);

      const totalSpent = expenses.length > 0 ? expenses[0].totalSpent : 0;
      const remaining = budget.amount - totalSpent;

      return {
        content: [{ type: "text", text: `Budget for ${category}: $${budget.amount}. You have spent $${totalSpent} this month. Remaining: $${remaining}.` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error getting budget status: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool: add_investment
server.tool(
  "add_investment",
  "Add a new investment to the user's portfolio.",
  {
    userPhone: z.string().describe("User's WhatsApp phone number"),
    symbol: z.string().describe("Stock ticker or Crypto symbol (e.g., AAPL, BTC)"),
    name: z.string().describe("Full name of the asset"),
    type: z.enum(['stock', 'bond', 'etf', 'mutual_fund', 'crypto', 'real_estate']),
    quantity: z.number().describe("Number of shares or units"),
    purchasePrice: z.number().describe("Price per share or unit at time of purchase"),
    currentPrice: z.number().optional().describe("Current market price, defaults to purchase price if unknown")
  },
  async ({ userPhone, symbol, name, type, quantity, purchasePrice, currentPrice }) => {
    try {
      const user = await findUser(userPhone);
      const newInv = new Investment({
        user: user._id,
        symbol,
        name,
        type,
        quantity,
        purchasePrice,
        purchaseDate: new Date(),
        currentPrice: currentPrice || purchasePrice
      });
      await newInv.save();
      return {
        content: [{ type: "text", text: `Successfully added investment: ${quantity} shares of ${symbol} (${name}) at $${purchasePrice}.` }]
      };
    } catch (error) {
      return {
        content: [{ type: "text", text: `Error adding investment: ${error.message}` }],
        isError: true
      };
    }
  }
);

// Tool: get_portfolio
server.tool(
  "get_portfolio",
  "Retrieve the overall investment portfolio for the user, showing holdings and performance.",
  {
    userPhone: z.string().describe("User's WhatsApp phone number")
  },
  async ({ userPhone }) => {
    try {
      const user = await findUser(userPhone);
      const investments = await Investment.find({ user: user._id });
      
      if (!investments || investments.length === 0) {
        return {
          content: [{ type: "text", text: "Your portfolio is currently empty." }]
        };
      }
      
      let totalValue = 0;
      let totalPurchase = 0;
      let breakdown = investments.map(inv => {
         // currentPrice & quantity are raw fields. virtuals might not be loaded properly in map iteration if not populated. Let's calculate manually to be safe.
         const currentValue = inv.quantity * inv.currentPrice;
         const purchaseValue = inv.quantity * inv.purchasePrice;
         const gainLoss = currentValue - purchaseValue;
         
         totalValue += currentValue;
         totalPurchase += purchaseValue;
         
         return `- ${inv.symbol} (${inv.name}): ${inv.quantity} shares, Current Value: $${currentValue.toFixed(2)} (Gain/Loss: $${gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)})`;
      }).join("\n");
      
      const overallReturn = totalPurchase > 0 ? (((totalValue - totalPurchase) / totalPurchase) * 100).toFixed(2) : 0;
      
      return {
        content: [{ type: "text", text: `Total Portfolio Value: $${totalValue.toFixed(2)} (Overall Return: ${overallReturn}%)\n\nHoldings:\n${breakdown}` }]
      };
    } catch (error) {
      return {
         content: [{ type: "text", text: `Error fetching portfolio: ${error.message}` }],
         isError: true
      };
    }
  }
);

// Tool: get_bank_balances
server.tool(
  "get_bank_balances",
  "Fetches live Plaid bank balances for the user to accurately determine how much cash they have.",
  { userPhone: z.string().describe("User's WhatsApp phone number") },
  async ({ userPhone }) => {
    try {
      const user = await findUser(userPhone);
      const accounts = await Account.find({ userId: user._id });
      if (!accounts || accounts.length === 0) {
        return { content: [{ type: "text", text: "You have no connected bank accounts via Plaid." }] };
      }
      const balances = accounts.map(acc => {
         return `- ${acc.institutionName} (${acc.accountName}): Available $${acc.balance.available || 0}, Current $${acc.balance.current || 0}`;
      }).join("\n");
      return { content: [{ type: "text", text: `Your connected bank balances are:\n${balances}` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error fetching balances: ${e.message}` }], isError: true };
    }
  }
);

// Tool: get_recent_bank_transactions
server.tool(
  "get_recent_bank_transactions",
  "Queries recent synced Plaid transactions to track spending history.",
  {
    userPhone: z.string().describe("User's phone number"),
    limit: z.number().optional().describe("Number of transactions to return (max 20)")
  },
  async ({ userPhone, limit = 5 }) => {
    try {
      const user = await findUser(userPhone);
      const limitVal = Math.min(limit, 20);
      const transactions = await Transaction.find({ userId: user._id })
        .sort({ date: -1 })
        .limit(limitVal);
        
      if (!transactions || transactions.length === 0) {
        return { content: [{ type: "text", text: "No recent transactions found." }] };
      }
      
      const history = transactions.map(t => {
         return `[${new Date(t.date).toLocaleDateString()}] $${t.amount} at ${t.merchantName || t.name} (Category: ${t.category ? t.category.join(", ") : 'Unknown'})`;
      }).join("\n");
      return { content: [{ type: "text", text: `Recent Transactions:\n${history}` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error fetching transactions: ${e.message}` }], isError: true };
    }
  }
);

// Tool: split_family_expense
server.tool(
  "split_family_expense",
  "Splits a shared family expense evenly among family group members and posts the dues.",
  {
    userPhone: z.string(),
    amount: z.number().describe("Total expense amount to be split"),
    category: z.string(),
    description: z.string().optional()
  },
  async ({ userPhone, amount, category, description }) => {
    try {
      const user = await findUser(userPhone);
      // Find the first family group where the user is a member
      const group = await FamilyGroup.findOne({ "members.user": user._id });
      
      if (!group) {
        return { content: [{ type: "text", text: "You don't belong to any Family Group. Please create or join one first in the Money-Mentor app." }] };
      }
      
      // Calculate split natively 
      const activeMembers = group.members.filter(m => m.status === 'active');
      const numMembers = activeMembers.length;
      if (numMembers === 0) throw new Error("No active members found in the family group.");
      
      const splitAmount = parseFloat((amount / numMembers).toFixed(2));
      const splitsArray = activeMembers.map(m => {
        const isPayer = m.user.toString() === user._id.toString();
        return {
          user: m.user,
          amount: splitAmount,
          status: isPayer ? 'paid' : 'pending' // Only the payer is instantly paid
        };
      });

      const newShared = new SharedExpense({
         familyGroup: group._id,
         paidBy: user._id,
         amount,
         category,
         description: description || 'Split via AI',
         splitType: 'equal',
         splits: splitsArray
      });
      await newShared.save();

      return { 
        content: [{ 
           type: "text", 
           text: `Successfully logged shared expense of $${amount} to group '${group.name}'. Each of the ${numMembers} members owes $${splitAmount}. The others have been marked as 'pending'.` 
        }] 
      };
    } catch (e) {
      return { content: [{ type: "text", text: `Error splitting expense: ${e.message}` }], isError: true };
    }
  }
);

// Tool: simulate_goal_impact
server.tool(
  "simulate_goal_impact",
  "Simulates how a financial change impacts a user's goals. Reads current goal progress to allow the AI to do math.",
  { userPhone: z.string() },
  async ({ userPhone }) => {
    try {
      const user = await findUser(userPhone);
      // Fetch user's family groups so we can find goals linked to those groups
      const groups = await FamilyGroup.find({ "members.user": user._id });
      const groupIds = groups.map(g => g._id);
      
      const allGoals = await Goal.find({ familyGroup: { $in: groupIds } });
      
      if (!allGoals || allGoals.length === 0) {
        return { content: [{ type: "text", text: "You have no active financial goals set." }] };
      }
      
      const goalSummaries = allGoals.map(g => {
         const remaining = g.targetAmount - g.currentAmount;
         const deadlineStr = g.deadline ? `Deadline: ${new Date(g.deadline).toLocaleDateString()}` : "No deadline set";
         return `- Goal '${g.name}': Target $${g.targetAmount}, Currently Saved $${g.currentAmount}. Remaining: $${remaining}. ${deadlineStr}. Status: ${g.status}.`;
      }).join("\n");
      
      return { 
         content: [{ 
            type: "text", 
            text: `Current Goals Data:\n${goalSummaries}\n\n*System Note to AI*: Use this goal data to mathematically simulate the impact of the user's hypothetical query.` 
         }] 
      };
    } catch (e) {
      return { content: [{ type: "text", text: `Error simulating goal: ${e.message}` }], isError: true };
    }
  }
);

// Tool: update_expense
server.tool(
  "update_expense",
  "Updates an existing expense amount. The AI MUST confirm with the user before executing.",
  {
    userPhone: z.string(),
    oldAmount: z.number().describe("The original amount of the expense"),
    category: z.string().describe("The category of the expense being updated"),
    newAmount: z.number().describe("The new amount to set")
  },
  async ({ userPhone, oldAmount, category, newAmount }) => {
    try {
      const user = await findUser(userPhone);
      const expense = await Expenses.findOne({ user: user._id, amount: oldAmount, category: new RegExp(`^${category}$`, 'i') }).sort({ date: -1 });
      
      if (!expense) {
         return { content: [{ type: "text", text: `Could not find an expense matching $${oldAmount} in '${category}' to update.` }] };
      }
      
      expense.amount = newAmount;
      await expense.save();
      
      return { content: [{ type: "text", text: `Successfully updated your ${category} expense from $${oldAmount} to $${newAmount}.` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error updating expense: ${e.message}` }], isError: true };
    }
  }
);

// Tool: delete_expense
server.tool(
  "delete_expense",
  "Deletes an existing expense. The AI MUST confirm with the user (e.g. 'Are you sure you want to delete this $50 Food expense?') before executing.",
  {
    userPhone: z.string(),
    amount: z.number().describe("The exact amount of the expense being deleted"),
    category: z.string().describe("The category of the expense being deleted")
  },
  async ({ userPhone, amount, category }) => {
    try {
      const user = await findUser(userPhone);
      const expense = await Expenses.findOne({ user: user._id, amount, category: new RegExp(`^${category}$`, 'i') }).sort({ date: -1 });
      
      if (!expense) {
         return { content: [{ type: "text", text: `Could not find an expense matching $${amount} in '${category}' to delete.` }] };
      }
      
      await Expenses.deleteOne({ _id: expense._id });
      
      return { content: [{ type: "text", text: `Successfully deleted the $${amount} expense in '${category}'.` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error deleting expense: ${e.message}` }], isError: true };
    }
  }
);

// Tool: update_budget
server.tool(
  "update_budget",
  "Updates the target limit amount for a specific budget category.",
  {
    userPhone: z.string(),
    category: z.string().describe("The budget category to update (e.g., Food, Entertainment)"),
    newAmount: z.number().describe("The new budget limit amount")
  },
  async ({ userPhone, category, newAmount }) => {
    try {
      const user = await findUser(userPhone);
      const budget = await Budgets.findOne({ user: user._id, category: new RegExp(`^${category}$`, 'i') });
      
      if (!budget) {
         return { content: [{ type: "text", text: `Could not find an active budget for '${category}'. Would you like to create one instead?` }] };
      }
      
      const oldAmount = budget.amount;
      budget.amount = newAmount;
      await budget.save();
      
      return { content: [{ type: "text", text: `Successfully updated your '${category}' budget from $${oldAmount} to $${newAmount}.` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error updating budget: ${e.message}` }], isError: true };
    }
  }
);

// Tool: delete_investment
server.tool(
  "delete_investment",
  "Removes an investment holding entirely from the portfolio. The AI MUST confirm with the user before executing.",
  {
    userPhone: z.string(),
    symbol: z.string().describe("The stock or crypto symbol to delete (e.g., AAPL)")
  },
  async ({ userPhone, symbol }) => {
    try {
      const user = await findUser(userPhone);
      const inv = await Investment.findOne({ user: user._id, symbol: new RegExp(`^${symbol}$`, 'i') }).sort({ purchaseDate: -1 });
      
      if (!inv) {
         return { content: [{ type: "text", text: `Could not find an investment record for symbol '${symbol}' to delete.` }] };
      }
      
      await Investment.deleteOne({ _id: inv._id });
      
      return { content: [{ type: "text", text: `Successfully removed '${symbol}' from your portfolio.` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error deleting investment: ${e.message}` }], isError: true };
    }
  }
);

// Tool: create_budget
server.tool(
  "create_budget",
  "Creates a new budget target limit for a specific category.",
  {
    userPhone: z.string(),
    category: z.string().describe("The budget category (e.g., Food, Entertainment, Rent)"),
    amount: z.number().describe("The budget limit amount for the month")
  },
  async ({ userPhone, category, amount }) => {
    try {
      const user = await findUser(userPhone);
      const existing = await Budgets.findOne({ user: user._id, category: new RegExp(`^${category}$`, 'i') });
      
      if (existing) {
         return { content: [{ type: "text", text: `A budget for '${category}' already exists ($${existing.amount}). Would you like to update it instead?` }] };
      }
      
      const newBudget = new Budgets({
         user: user._id,
         category: category,
         amount: amount
      });
      await newBudget.save();
      
      return { content: [{ type: "text", text: `Successfully created a new budget of $${amount} for '${category}'.` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error creating budget: ${e.message}` }], isError: true };
    }
  }
);

// Tool: update_investment
server.tool(
  "update_investment",
  "Updates the quantity of shares/units for an existing investment holding in the portfolio.",
  {
    userPhone: z.string(),
    symbol: z.string().describe("The stock or crypto symbol to update (e.g., AAPL)"),
    additionalShares: z.number().describe("The number of shares added (use negative number if shares were sold)")
  },
  async ({ userPhone, symbol, additionalShares }) => {
    try {
      const user = await findUser(userPhone);
      // Find the most recent holding of this symbol
      const inv = await Investment.findOne({ user: user._id, symbol: new RegExp(`^${symbol}$`, 'i') }).sort({ purchaseDate: -1 });
      
      if (!inv) {
         return { content: [{ type: "text", text: `Could not find an existing investment record for symbol '${symbol}'. Proceed with add_investment instead.` }] };
      }
      
      const oldQuantity = inv.quantity;
      const newQuantity = oldQuantity + additionalShares;
      
      if (newQuantity <= 0) {
         return { content: [{ type: "text", text: `This would bring your shares to ${newQuantity}. Please use 'delete_investment' instead if you sold your entire position.` }] };
      }
      
      inv.quantity = newQuantity;
      await inv.save();
      
      return { content: [{ type: "text", text: `Successfully updated '${symbol}'. Your total holdings changed from ${oldQuantity} to ${newQuantity} shares.` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error updating investment: ${e.message}` }], isError: true };
    }
  }
);

// Tool: get_family_dues
server.tool(
  "get_family_dues",
  "Retrieves all pending shared expenses that the user owes to others in their family group.",
  { userPhone: z.string() },
  async ({ userPhone }) => {
    try {
      const user = await findUser(userPhone);
      
      // Look for any SharedExpense where this user is in the 'splits' array, with 'pending' status.
      // And where the 'paidBy' is NOT the user themselves.
      const pendingExpenses = await SharedExpense.find({
        "splits.user": user._id,
        "splits.status": "pending",
        paidBy: { $ne: user._id }
      }).populate('paidBy', 'name');
      
      if (!pendingExpenses || pendingExpenses.length === 0) {
         return { content: [{ type: "text", text: "You have no pending family dues. You are all settled up!" }] };
      }
      
      const duesSummary = pendingExpenses.map(exp => {
         const userSplit = exp.splits.find(s => s.user.toString() === user._id.toString());
         const amountOwed = userSplit ? userSplit.amount : 0;
         return `- You owe ${exp.paidBy.name || 'a family member'} $${amountOwed} for '${exp.category}' (${exp.description || 'Shared Expense'}). Date: ${new Date(exp.date).toLocaleDateString()}`;
      }).join("\n");
      
      return { content: [{ type: "text", text: `Here are your pending family dues:\n${duesSummary}` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error fetching family dues: ${e.message}` }], isError: true };
    }
  }
);

// Tool: settle_shared_expense
server.tool(
  "settle_shared_expense",
  "Marks a pending shared family expense as 'paid' for this user.",
  {
    userPhone: z.string(),
    category: z.string().describe("The category of the shared expense to settle"),
    amountOwed: z.number().describe("The exact fractional amount the user owes (e.g. 15.50)")
  },
  async ({ userPhone, category, amountOwed }) => {
    try {
      const user = await findUser(userPhone);
      
      // Find the pending expense matching the exact owed amount and category
      const expense = await SharedExpense.findOne({
        category: new RegExp(`^${category}$`, 'i'),
        paidBy: { $ne: user._id },
        splits: { $elemMatch: { user: user._id, status: "pending", amount: amountOwed } }
      });
      
      if (!expense) {
         return { content: [{ type: "text", text: `Could not find a pending shared expense in '${category}' where you owe exactly $${amountOwed}.` }] };
      }
      
      // Update the embedded document array
      const splitIndex = expense.splits.findIndex(s => s.user.toString() === user._id.toString());
      if (splitIndex > -1) {
         expense.splits[splitIndex].status = "paid";
         await expense.save();
      }
      
      return { content: [{ type: "text", text: `Successfully settled! Your $${amountOwed} debt for '${category}' has been marked as paid.` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error settling family expense: ${e.message}` }], isError: true };
    }
  }
);

// Tool: add_goal_contribution
server.tool(
  "add_goal_contribution",
  "Logs money saved towards a financial Goal, increasing the progress bar natively.",
  {
    userPhone: z.string(),
    goalName: z.string().describe("The specific name of the Goal (e.g. 'Hawaii Trip')"),
    amount: z.number().describe("The amount of money being contributed tracking toward the goal")
  },
  async ({ userPhone, goalName, amount }) => {
    try {
      const user = await findUser(userPhone);
      const groups = await FamilyGroup.find({ "members.user": user._id });
      const groupIds = groups.map(g => g._id);
      
      const goal = await Goal.findOne({ 
         familyGroup: { $in: groupIds }, 
         name: new RegExp(`^${goalName}$`, 'i') 
      });
      
      if (!goal) {
         return { content: [{ type: "text", text: `Could not find an active Goal named '${goalName}'.` }] };
      }
      
      // Increment goal progress natively
      goal.currentAmount += amount;
      
      // Check if goal is met
      let congrats = "";
      if (goal.currentAmount >= goal.targetAmount && goal.status !== 'completed') {
         goal.status = 'completed';
         congrats = " 🎉 Congratulations! You have fully reached your Target Amount for this Goal!";
      }
      
      // Push contribution ledger
      goal.contributions.push({
         user: user._id,
         amount: amount,
         date: new Date()
      });
      
      await goal.save();
      
      return { content: [{ type: "text", text: `Successfully added $${amount} to '${goal.name}'. Current Progress: $${goal.currentAmount} / $${goal.targetAmount}.${congrats}` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error logging goal contribution: ${e.message}` }], isError: true };
    }
  }
);

// Tool: create_goal
server.tool(
  "create_goal",
  "Creates a new financial goal with a target amount.",
  {
    userPhone: z.string(),
    goalName: z.string().describe("Name of the goal (e.g., 'Car Downpayment')"),
    targetAmount: z.number().describe("The final total amount to be saved"),
    deadline: z.string().optional().describe("Optional ISO date string or human-readable date for goal timeline")
  },
  async ({ userPhone, goalName, targetAmount, deadline }) => {
    try {
      const user = await findUser(userPhone);
      const group = await FamilyGroup.findOne({ "members.user": user._id });
      
      if (!group) {
         return { content: [{ type: "text", text: "You must be in a Family Group to set a shared Goal." }] };
      }
      
      const newGoal = new Goal({
         name: goalName,
         targetAmount,
         familyGroup: group._id,
         deadline: deadline ? new Date(deadline) : undefined
      });
      await newGoal.save();
      
      return { content: [{ type: "text", text: `Successfully created the new Goal '${goalName}' with a target of $${targetAmount} in your group '${group.name}'.` }] };
    } catch (e) {
      return { content: [{ type: "text", text: `Error creating goal: ${e.message}` }], isError: true };
    }
  }
);

// Export the raw server instance for direct Stdio bridging
export { server };

// --- Server Integration ---
// Export a setup function to attach the SSE endpoint inside app.js
export const setupMcpServer = (app) => {
  // Use a Map to handle multiple sessions (better for remote use)
  const transports = new Map();

  // Endpoint for MCP Clients (OpenClaw/Claude) to connect via SSE
  app.get("/mcp/sse", async (req, res) => {
    try {
      // Create a unique transport for this connection
      // We point it to /mcp/messages for the POST communication
      const transport = new SSEServerTransport("/mcp/messages", res);
      
      const sessionID = Math.random().toString(36).substring(7);
      transports.set(sessionID, transport);

      await server.connect(transport);

      // Clean up when connection closes
      req.on('close', () => {
        transports.delete(sessionID);
      });
    } catch (error) {
      console.error("Error setting up MCP SSE Transport:", error);
      if (!res.headersSent) res.status(500).send("Internal Server Error");
    }
  });

  // IMPORTANT: Handle POST to /mcp/sse as a fallback
  // Some clients (like mcp-remote) might try to POST here 
  app.post("/mcp/sse", async (req, res) => {
     // Forward to the main message handler
     return app._router.handle(req, res, () => {});
  });

  // Main Endpoint for exchanging JSON-RPC messages with the Client
  app.post("/mcp/messages", async (req, res) => {
    try {
      // The SSEServerTransport class handles finding the correct session 
      // automatically if headers are set correctly.
      const sessionId = req.query.sessionId;
      await SSEServerTransport.handlePostMessage(req, res);
    } catch (error) {
       console.error("MCP handle message error:", error);
       if (!res.headersSent) res.status(500).send("Error handling message");
    }
  });
};
