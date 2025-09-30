const { Budget, Category, Transaction } = require("../models");
const HttpError = require("../utils/httpError");

async function listCategories(req, res) {
  const categories = await Category.findAll({
    include: [
      { model: Budget, as: "budget" },
      { model: Transaction, as: "transactions" }
    ],
    order: [["createdAt", "DESC"]]
  });

  res.json({ data: categories });
}

async function getCategory(req, res) {
  const { id } = req.params;
  const category = await Category.findByPk(id, {
    include: [
      { model: Budget, as: "budget" },
      { model: Transaction, as: "transactions" }
    ]
  });

  if (!category) {
    throw new HttpError(404, "Category not found");
  }

  res.json({ data: category });
}

async function createCategory(req, res) {
  const { name, type, budgetId } = req.body;

  const budget = await Budget.findByPk(budgetId);
  if (!budget) {
    throw new HttpError(404, "Budget not found for provided budgetId");
  }

  const category = await Category.create({ name, type, budgetId });
  res.status(201).json({ data: category });
}

async function updateCategory(req, res) {
  const { id } = req.params;
  const category = await Category.findByPk(id);

  if (!category) {
    throw new HttpError(404, "Category not found");
  }

  const { name, type, budgetId } = req.body;

  if (budgetId !== undefined && budgetId !== category.budgetId) {
    const budget = await Budget.findByPk(budgetId);
    if (!budget) {
      throw new HttpError(404, "Budget not found for provided budgetId");
    }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (type !== undefined) updateData.type = type;
  if (budgetId !== undefined) updateData.budgetId = budgetId;

  await category.update(updateData);

  res.json({ data: category });
}

async function deleteCategory(req, res) {
  const { id } = req.params;
  const category = await Category.findByPk(id);

  if (!category) {
    throw new HttpError(404, "Category not found");
  }

  await category.destroy();

  res.json({ data: null, message: "Category deleted" });
}

module.exports = {
  listCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory
};
