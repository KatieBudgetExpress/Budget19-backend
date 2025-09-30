const { Budget, Category, Transaction } = require("../models");
const HttpError = require("../utils/httpError");

async function listBudgets(req, res) {
  const budgets = await Budget.findAll({
    include: [
      { model: Category, as: "categories" },
      { model: Transaction, as: "transactions" }
    ],
    order: [["createdAt", "DESC"]]
  });

  res.json({ data: budgets });
}

async function getBudget(req, res) {
  const { id } = req.params;
  const budget = await Budget.findByPk(id, {
    include: [
      { model: Category, as: "categories" },
      { model: Transaction, as: "transactions" }
    ]
  });

  if (!budget) {
    throw new HttpError(404, "Budget not found");
  }

  res.json({ data: budget });
}

async function createBudget(req, res) {
  const { name, totalAmount, description } = req.body;
  const budget = await Budget.create({ name, totalAmount, description });
  res.status(201).json({ data: budget });
}

async function updateBudget(req, res) {
  const { id } = req.params;
  const budget = await Budget.findByPk(id);

  if (!budget) {
    throw new HttpError(404, "Budget not found");
  }

  const { name, totalAmount, description } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (totalAmount !== undefined) updateData.totalAmount = totalAmount;
  if (description !== undefined) updateData.description = description;

  await budget.update(updateData);

  res.json({ data: budget });
}

async function deleteBudget(req, res) {
  const { id } = req.params;
  const budget = await Budget.findByPk(id);

  if (!budget) {
    throw new HttpError(404, "Budget not found");
  }

  await budget.destroy();

  res.json({ data: null, message: "Budget deleted" });
}

module.exports = {
  listBudgets,
  getBudget,
  createBudget,
  updateBudget,
  deleteBudget
};
