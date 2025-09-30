process.env.SQLITE_STORAGE = ":memory:";
process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const { createApp } = require("../src/app");
const { sequelize } = require("../src/config/database");
const { Budget, Category, Transaction } = require("../src/models");

const app = createApp();

test.beforeEach(async () => {
  await sequelize.sync({ force: true });
});

test.after(async () => {
  await sequelize.close();
});

test("POST /api/transactions rejects mismatched category type", async () => {
  const budget = await Budget.create({ name: "Test Budget" });
  const incomeCategory = await Category.create({
    name: "Salary",
    type: "income",
    budgetId: budget.id
  });

  const response = await request(app)
    .post("/api/transactions")
    .send({
      description: "Groceries",
      amount: "50.00",
      date: "2024-01-01",
      type: "expense",
      budgetId: budget.id,
      categoryId: incomeCategory.id
    })
    .expect(400);

  assert.equal(
    response.body.error.message,
    "Transaction type does not match category type"
  );
});

test(
  "PUT /api/transactions rejects mismatch when updating transaction type",
  async () => {
    const budget = await Budget.create({ name: "Update Budget" });
    const incomeCategory = await Category.create({
      name: "Salary",
      type: "income",
      budgetId: budget.id
    });

    const transaction = await Transaction.create({
      description: "Paycheck",
      amount: "1000.00",
      date: "2024-01-01",
      type: "income",
      budgetId: budget.id,
      categoryId: incomeCategory.id
    });

    const response = await request(app)
      .put(`/api/transactions/${transaction.id}`)
      .send({
        type: "expense"
      })
      .expect(400);

    assert.equal(
      response.body.error.message,
      "Transaction type does not match category type"
    );
  }
);

test(
  "PUT /api/transactions rejects mismatch when changing category without updating type",
  async () => {
    const budget = await Budget.create({ name: "Category Change Budget" });
    const incomeCategory = await Category.create({
      name: "Salary",
      type: "income",
      budgetId: budget.id
    });
    const expenseCategory = await Category.create({
      name: "Food",
      type: "expense",
      budgetId: budget.id
    });

    const transaction = await Transaction.create({
      description: "Dinner",
      amount: "30.00",
      date: "2024-01-01",
      type: "expense",
      budgetId: budget.id,
      categoryId: expenseCategory.id
    });

    const response = await request(app)
      .put(`/api/transactions/${transaction.id}`)
      .send({
        categoryId: incomeCategory.id
      })
      .expect(400);

    assert.equal(
      response.body.error.message,
      "Transaction type does not match category type"
    );
  }
);
