import Expense from '../models/expenseModel.js';
import Budget from '../models/budgetsModel.js';
import { GoogleGenerativeAI } from "@google/generative-ai";


export async function analyzeExpenses(userId) {
    const expenses = await Expense.find({ user: userId }).sort('-date');
    const totalExpense = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const categorySums = {};
    
    expenses.forEach(expense => {
        if (categorySums[expense.category]) {
            categorySums[expense.category] += expense.amount;
        } else {
            categorySums[expense.category] = expense.amount;
        }
    });

    const topExpenseCategories = Object.entries(categorySums)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);

    return {
        totalExpense,
        topExpenseCategories
    };
}

export async function analyzeBudgetAdherence(userId) {
    const budgets = await Budget.find({ user: userId });
    const adherenceResults = [];

    for (const budget of budgets) {
        const expenses = await Expense.find({
            user: userId,
            category: budget.category,
            date: { $gte: budget.startDate }
        });

        const totalSpent = expenses.reduce((sum, expense) => sum + expense.amount, 0);
        const adherencePercentage = (totalSpent / budget.amount) * 100;

        adherenceResults.push({
            category: budget.category,
            budgetAmount: budget.amount,
            spent: totalSpent,
            adherencePercentage
        });
    }

    return adherenceResults;
}

export async function getFinancialAdvice(financialData) {

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  // For text-only input, use the gemini-pro model
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  const prompt = `
As a financial advisor, provide personalized advice based on the following financial data:

${JSON.stringify(financialData, null, 2)}

Please provide advice on:
1. Budgeting
2. Savings strategies
3. Investment recommendations
4. Debt management (if applicable)
5. Long-term financial planning

Give specific, actionable advice tailored to this individual's financial situation.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  const text = response.text();
  return text;
}