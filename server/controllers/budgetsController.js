import Budget from "../models/budgetsModel.js";
export const postBudget = async (req, res) => {
  try {
    const budget = new Budget({
      ...req.body,
      user: req.user._id,
    });
    await budget.save();
    res.status(201).send(budget);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user._id });
    res.send(budgets);
  } catch (error) {
    res.status(500).send();
  }
};
export const getSpecificBudget = async (req, res) => {
  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!budget) {
      return res.status(404).send();
    }
    res.send(budget);
  } catch (error) {
    res.status(500).send();
  }
};
export const updateBudget = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["category", "amount", "period", "startDate"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
);

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!budget) {
      return res.status(404).send();
    }

    updates.forEach((update) => (budget[update] = req.body[update]));
    await budget.save();
    res.send(budget);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    
    if (!budget) {
      return res.status(404).send();
    }
    res.send(budget);
  } catch (error) {
    res.status(500).send();
  }
};
