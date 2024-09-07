import Investment from "../models/InvestmentModel.js";
import { getStockPrice } from "../services/stockService.js";
export const addInvestments = async (req, res) => {
  try {
    const investment = new Investment({
      ...req.body,
      user: req.user._id,
    });
    await investment.save();
    res.status(201).send(investment);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const getInvestments = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id });
    res.send(investments);
  } catch (error) {
    res.status(500).send();
  }
};
export const getInvestmentsById = async (req, res) => {
  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!investment) {
      return res.status(404).send();
    }
    res.send(investment);
  } catch (error) {
    res.status(500).send();
  }
};
export const updateInvestments = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["quantity", "currentPrice", "lastUpdated"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const investment = await Investment.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!investment) {
      return res.status(404).send();
    }

    updates.forEach((update) => (investment[update] = req.body[update]));
    await investment.save();
    res.send(investment);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const deleteInvestment = async (req, res) => {
  try {
    const investment = await Investment.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!investment) {
      return res.status(404).send();
    }
    res.send(investment);
  } catch (error) {
    res.status(500).send();
  }
};
// get portfolio summary
export const getPortfolioSummary = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id });

    let totalValue = 0;
    let totalCost = 0;
    let performanceSummary = [];

    investments.forEach((investment) => {
      const currentValue = investment.quantity * investment.currentPrice;
      const cost = investment.quantity * investment.purchasePrice;
      const profit = currentValue - cost;
      const percentageReturn = ((currentValue - cost) / cost) * 100;

      totalValue += currentValue;
      totalCost += cost;

      performanceSummary.push({
        symbol: investment.symbol,
        currentValue,
        cost,
        profit,
        percentageReturn,
      });
    });

    const overallPerformance = {
      totalValue,
      totalCost,
      totalProfit: totalValue - totalCost,
      overallReturn: ((totalValue - totalCost) / totalCost) * 100,
    };

    res.send({ performanceSummary, overallPerformance });
  } catch (error) {
    res.status(500).send();
  }
};
// update price
export const updatePrice = async (req, res) => {
  try {
    const investments = await Investment.find({ user: req.user._id });
    
    for (let investment of investments) {
      const currentPrice = await getStockPrice(investment.symbol);
      console.log(`Updating price for ${investment.symbol} to ${currentPrice}`);
      investment.currentPrice = currentPrice;
      investment.lastUpdated = new Date();
      await investment.save();
    }

    res.send({ message: 'Investment prices updated successfully' });
  } catch (error) {
    res.status(500).send();
  }
};
