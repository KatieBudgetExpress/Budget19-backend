process.env.SQLITE_STORAGE = ":memory:";
process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const { createApp } = require("../src/app");
const { sequelize } = require("../src/config/database");
const { ActionSysteme } = require("../src/models");

const app = createApp();

test.beforeEach(async () => {
  await sequelize.sync({ force: true });
});

test.after(async () => {
  await sequelize.close();
});

test("POST /api/actions-systeme crée une action système", async () => {
  const response = await request(app)
    .post("/api/actions-systeme")
    .send({
      code: "USER_CREATE",
      libelle: "Création d'utilisateur",
      description: "Création d'un nouvel usager",
      actif: true
    })
    .expect(201);

  assert.equal(response.body.data.code, "USER_CREATE");
  assert.equal(response.body.data.libelle, "Création d'utilisateur");
  assert.equal(response.body.data.description, "Création d'un nouvel usager");
  assert.equal(response.body.data.actif, true);
});

test("GET /api/actions-systeme retourne la liste des actions", async () => {
  await ActionSysteme.create({
    code: "BUDGET_EXPORT",
    libelle: "Export de budget",
    description: "Export CSV des budgets",
    actif: true
  });

  const response = await request(app).get("/api/actions-systeme").expect(200);

  assert.equal(Array.isArray(response.body.data), true);
  assert.equal(response.body.data.length, 1);
  assert.equal(response.body.data[0].code, "BUDGET_EXPORT");
});

test("PUT /api/actions-systeme/:id met à jour une action", async () => {
  const action = await ActionSysteme.create({
    code: "BUDGET_IMPORT",
    libelle: "Import budget",
    description: "Import des budgets",
    actif: true
  });

  const response = await request(app)
    .put(`/api/actions-systeme/${action.id}`)
    .send({
      libelle: "Importation de budget",
      actif: false
    })
    .expect(200);

  assert.equal(response.body.data.libelle, "Importation de budget");
  assert.equal(response.body.data.actif, false);
});

test("DELETE /api/actions-systeme/:id supprime une action", async () => {
  const action = await ActionSysteme.create({
    code: "TRANSACTION_DELETE",
    libelle: "Suppression de transaction",
    description: "Suppression d'une transaction",
    actif: true
  });

  await request(app).delete(`/api/actions-systeme/${action.id}`).expect(200);

  const remaining = await ActionSysteme.findByPk(action.id);
  assert.equal(remaining, null);
});
