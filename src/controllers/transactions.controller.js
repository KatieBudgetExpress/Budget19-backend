const { Budget, Category, Transaction } = require("../models");
const HttpError = require("../utils/httpError");

async function listTransactions(req, res) {
  const transactions = await Transaction.findAll({
    include: [
      { model: Budget, as: "budget" },
      { model: Category, as: "category" }
    ],
    order: [["date", "DESC"]]
  });

  res.json({ data: transactions });
}

async function getTransaction(req, res) {
  const { id } = req.params;
  const transaction = await Transaction.findByPk(id, {
    include: [
      { model: Budget, as: "budget" },
      { model: Category, as: "category" }
    ]
  });

  if (!transaction) {
    throw new HttpError(404, "Transaction not found");
  }

  res.json({ data: transaction });
}

async function createTransaction(req, res) {
  const { description, amount, date, type, budgetId, categoryId } = req.body;

  const budget = await Budget.findByPk(budgetId);
  if (!budget) {
    throw new HttpError(404, "Budget not found for provided budgetId");
  }

  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new HttpError(404, "Category not found for provided categoryId");
  }

  if (category.budgetId !== budget.id) {
    throw new HttpError(400, "Category does not belong to provided budget");
  }

  if (category.type !== type) {
    throw new HttpError(400, "Transaction type does not match category type");
  }

  const transaction = await Transaction.create({
    description,
    amount,
    date,
    type,
    budgetId,
    categoryId
  });

  res.status(201).json({ data: transaction });
}

async function updateTransaction(req, res) {
  const { id } = req.params;
  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    throw new HttpError(404, "Transaction not found");
  }

  const { description, amount, date, type, budgetId, categoryId } = req.body;

  let targetBudgetId = transaction.budgetId;
  if (budgetId !== undefined && budgetId !== transaction.budgetId) {
    const budget = await Budget.findByPk(budgetId);
    if (!budget) {
      throw new HttpError(404, "Budget not found for provided budgetId");
    }
    targetBudgetId = budget.id;
  }

  let targetCategoryId = transaction.categoryId;
  let targetCategory = null;
  if (categoryId !== undefined && categoryId !== transaction.categoryId) {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new HttpError(404, "Category not found for provided categoryId");
    }
    targetCategoryId = category.id;
    targetCategory = category;
  }

  if (!targetCategory) {
    targetCategory = await Category.findByPk(targetCategoryId);
  }

  if (!targetCategory) {
    throw new HttpError(404, "Category not found for provided categoryId");
  }

  const belongsToBudget = targetCategory.budgetId === targetBudgetId;
  if (!belongsToBudget) {
    const message =
      categoryId !== undefined && categoryId !== transaction.categoryId
        ? "Category does not belong to provided budget"
        : "Existing category does not belong to provided budget";
    throw new HttpError(400, message);
  }

  const targetType = type !== undefined ? type : transaction.type;
  if (targetCategory.type !== targetType) {
    throw new HttpError(400, "Transaction type does not match category type");
  }

  const updateData = {};
  if (description !== undefined) updateData.description = description;
  if (amount !== undefined) updateData.amount = amount;
  if (date !== undefined) updateData.date = date;
  if (type !== undefined) updateData.type = type;
  if (budgetId !== undefined) updateData.budgetId = budgetId;
  if (categoryId !== undefined) updateData.categoryId = categoryId;

  await transaction.update(updateData);

  res.json({ data: transaction });
}

async function deleteTransaction(req, res) {
  const { id } = req.params;
  const transaction = await Transaction.findByPk(id);

  if (!transaction) {
    throw new HttpError(404, "Transaction not found");
  }

  await transaction.destroy();

  res.json({ data: null, message: "Transaction deleted" });
}

module.exports = {
  listTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction
};
