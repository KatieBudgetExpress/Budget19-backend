process.env.SQLITE_STORAGE = ":memory:";
process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const { createApp } = require("../src/app");
const { sequelize } = require("../src/config/database");
const { Budget } = require("../src/models");

const app = createApp();

test.beforeEach(async () => {
  await sequelize.sync({ force: true });
});

test.after(async () => {
  await sequelize.close();
});

test("POST /api/budgets rejette un total négatif", async () => {
  const response = await request(app)
    .post("/api/budgets")
    .send({
      name: "Budget Vacances",
      totalAmount: -50
    })
    .expect(422);

  assert.equal(response.body.error.message, "Validation failed");
  const count = await Budget.count();
  assert.equal(count, 0);
});

test("PUT /api/budgets/:id rejette un total négatif", async () => {
  const budget = await Budget.create({
    name: "Budget Initial",
    totalAmount: 100
  });

  const response = await request(app)
    .put(`/api/budgets/${budget.id}`)
    .send({
      totalAmount: -1
    })
    .expect(422);

  assert.equal(response.body.error.message, "Validation failed");
  await budget.reload();
  assert.equal(Number(budget.totalAmount), 100);
});
