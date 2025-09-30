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

test(
  "PUT /api/postes-budgetaires/:id rejects type change when transactions exist",
  async () => {
    const budget = await Budget.create({ name: "Type Change Budget" });
    const category = await Category.create({
      name: "Existing Category",
      type: "income",
      budgetId: budget.id
    });

    await Transaction.create({
      description: "Salary",
      amount: "1000.00",
      date: "2024-01-01",
      type: "income",
      budgetId: budget.id,
      categoryId: category.id
    });

    const response = await request(app)
      .put(`/api/postes-budgetaires/${category.id}`)
      .send({ type: "expense" })
      .expect(409);

    assert.equal(
      response.body.error.message,
      "Cannot change category type due to existing transactions"
    );
  }
);
