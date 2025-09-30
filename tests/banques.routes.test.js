process.env.SQLITE_STORAGE = ":memory:";
process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const { createApp } = require("../src/app");
const { sequelize } = require("../src/config/database");
const { Bank } = require("../src/models");

const app = createApp();

test.beforeEach(async () => {
  await sequelize.sync({ force: true });
});

test.after(async () => {
  await sequelize.close();
});

test("POST /api/banques applique les validations des champs obligatoires", async () => {
  const response = await request(app)
    .post("/api/banques")
    .send({
      name: "Banque Centrale",
      institution: "Institution Centrale",
      description: "Compte principal"
    })
    .expect(422);

  assert.equal(response.body.error.message, "Validation failed");
  const count = await Bank.count();
  assert.equal(count, 0);
});

test("POST /api/banques accepte un solde optionnel et fournit une valeur par défaut", async () => {
  const response = await request(app)
    .post("/api/banques")
    .send({
      name: "Banque Principale",
      institution: "Institution Principale",
      accountNumber: "ACC-001",
      description: "Compte courant"
    })
    .expect(201);

  assert.equal(response.body.data.accountNumber, "ACC-001");
  assert.equal(Number(response.body.data.balance), 0);
  assert.equal(response.body.data.description, "Compte courant");
});

test("POST /api/banques renvoie 409 lorsqu'un numero de compte existe déjà", async () => {
  await Bank.create({
    name: "Banque Originale",
    institution: "Institution Originale",
    accountNumber: "ACC-EXISTANT"
  });

  const response = await request(app)
    .post("/api/banques")
    .send({
      name: "Banque Duplicate",
      institution: "Institution Duplicate",
      accountNumber: "ACC-EXISTANT"
    })
    .expect(409);

  assert.equal(response.body.error.message, "Account number already in use");
  const count = await Bank.count();
  assert.equal(count, 1);
});

test("PUT /api/banques/:id met à jour le solde décimal et la description", async () => {
  const bank = await Bank.create({
    name: "Banque Mise à Jour",
    institution: "Institution Mise à Jour",
    accountNumber: "ACC-INIT"
  });

  const response = await request(app)
    .put(`/api/banques/${bank.id}`)
    .send({
      balance: "150.75",
      description: "Compte mis à jour"
    })
    .expect(200);

  assert.equal(Number(response.body.data.balance), 150.75);
  assert.equal(response.body.data.description, "Compte mis à jour");
});

test("PUT /api/banques/:id renvoie 409 lorsqu'un numero de compte est déjà utilisé", async () => {
  const firstBank = await Bank.create({
    name: "Banque 1",
    institution: "Institution 1",
    accountNumber: "ACC-1"
  });

  const bankToUpdate = await Bank.create({
    name: "Banque 2",
    institution: "Institution 2",
    accountNumber: "ACC-2"
  });

  const response = await request(app)
    .put(`/api/banques/${bankToUpdate.id}`)
    .send({ accountNumber: firstBank.accountNumber })
    .expect(409);

  assert.equal(response.body.error.message, "Account number already in use");
  await bankToUpdate.reload();
  assert.equal(bankToUpdate.accountNumber, "ACC-2");
});

test("PUT /api/banques/:id rejette un solde non décimal", async () => {
  const bank = await Bank.create({
    name: "Banque Invalid Update",
    institution: "Institution Invalid Update",
    accountNumber: "ACC-INVALID"
  });

  const response = await request(app)
    .put(`/api/banques/${bank.id}`)
    .send({
      balance: "abc",
      description: "Description invalide"
    })
    .expect(422);

  assert.equal(response.body.error.message, "Validation failed");
  await bank.reload();
  assert.equal(Number(bank.balance), 0);
  assert.equal(bank.description, null);
});

