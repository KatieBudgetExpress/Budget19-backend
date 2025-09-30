process.env.SQLITE_STORAGE = ":memory:";
process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const { createApp } = require("../src/app");
const { sequelize } = require("../src/config/database");
const { Bank, BanqueCompte } = require("../src/models");

const app = createApp();

test.beforeEach(async () => {
  await sequelize.sync({ force: true });
});

test.after(async () => {
  await sequelize.close();
});

test(
  "POST /api/banque-comptes applique les validations de champs obligatoires",
  async () => {
    const bank = await Bank.create({
      name: "Banque Mère",
      institution: "Institution Mère",
      accountNumber: "BANK-001"
    });

    const response = await request(app)
      .post("/api/banque-comptes")
      .send({
        name: "Compte courant",
        description: "Compte principal",
        bankId: bank.id
      })
      .expect(422);

    assert.equal(response.body.error.message, "Validation failed");
    const count = await BanqueCompte.count();
    assert.equal(count, 0);
  }
);

test("POST /api/banque-comptes crée un compte bancaire lié à une banque", async () => {
  const bank = await Bank.create({
    name: "Banque Principale",
    institution: "Institution Principale",
    accountNumber: "BANK-POST"
  });

  const response = await request(app)
    .post("/api/banque-comptes")
    .send({
      name: "Compte Épargne",
      accountNumber: "ACC-001",
      description: "Compte épargne principal",
      bankId: bank.id
    })
    .expect(201);

  assert.equal(response.body.data.name, "Compte Épargne");
  assert.equal(Number(response.body.data.balance), 0);
  assert.equal(response.body.data.bank.id, bank.id);
});

test("GET /api/banque-comptes retourne la liste des comptes", async () => {
  const bank = await Bank.create({
    name: "Banque Liste",
    institution: "Institution Liste",
    accountNumber: "BANK-LIST"
  });

  await BanqueCompte.create({
    name: "Compte Salaire",
    accountNumber: "ACC-LIST",
    bankId: bank.id
  });

  const response = await request(app).get("/api/banque-comptes").expect(200);

  assert.equal(Array.isArray(response.body.data), true);
  assert.equal(response.body.data.length, 1);
  assert.equal(response.body.data[0].bank.id, bank.id);
});

test("PUT /api/banque-comptes/:id met à jour le solde et la description", async () => {
  const bank = await Bank.create({
    name: "Banque Update",
    institution: "Institution Update",
    accountNumber: "BANK-UPD"
  });

  const account = await BanqueCompte.create({
    name: "Compte Initial",
    accountNumber: "ACC-UPD",
    bankId: bank.id
  });

  const response = await request(app)
    .put(`/api/banque-comptes/${account.id}`)
    .send({
      balance: "2500.50",
      description: "Compte mis à jour"
    })
    .expect(200);

  assert.equal(Number(response.body.data.balance), 2500.5);
  assert.equal(response.body.data.description, "Compte mis à jour");
});

test("DELETE /api/banque-comptes/:id supprime le compte", async () => {
  const bank = await Bank.create({
    name: "Banque Delete",
    institution: "Institution Delete",
    accountNumber: "BANK-DEL"
  });

  const account = await BanqueCompte.create({
    name: "Compte À Supprimer",
    accountNumber: "ACC-DEL",
    bankId: bank.id
  });

  await request(app).delete(`/api/banque-comptes/${account.id}`).expect(200);

  const exists = await BanqueCompte.findByPk(account.id);
  assert.equal(exists, null);
});
