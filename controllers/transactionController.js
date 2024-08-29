import Transaction from "../models/transactionModel.js";

export const addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({
      ...req.body,
      user: req.user._id,
    });
    await transaction.save();
    res.status(201).send(transaction);
  } catch (error) {
    res.status(400).send(error);
  }
};
export const getTransaction = async (req, res) => {
  try {
    const transactions = await Transaction.find({
      user: req.user._id,
    }).populate("bankAccount");
    res.send(transactions);
  } catch (error) {
    res.status(500).send();
  }
};
export const getTransactionById = async (req, res) => {
  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate("bankAccount");
    if (!transaction) {
      return res.status(404).send();
    }
    res.send(transaction);
  } catch (error) {
    res.status(500).send();
  }
};
export const updateTransaction = async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["category", "description"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!transaction) {
      return res.status(404).send();
    }

    updates.forEach((update) => (transaction[update] = req.body[update]));
    await transaction.save();
    res.send(transaction);
  } catch (error) {
    res.status(400).send(error);
  }
};
