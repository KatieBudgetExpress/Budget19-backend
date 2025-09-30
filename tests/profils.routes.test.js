process.env.SQLITE_STORAGE = ":memory:";
process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const { createApp } = require("../src/app");
const { sequelize } = require("../src/config/database");
const { Profil } = require("../src/models");

const app = createApp();

test.beforeEach(async () => {
  await sequelize.sync({ force: true });
});

test.after(async () => {
  await sequelize.close();
});

test("POST /api/profils crée un profil", async () => {
  const response = await request(app)
    .post("/api/profils")
    .send({
      firstName: "Jean",
      lastName: "Dupont",
      email: "jean.dupont@example.com"
    })
    .expect(201);

  assert.equal(response.body.data.firstName, "Jean");
  assert.equal(response.body.data.email, "jean.dupont@example.com");
});

test("POST /api/profils rejette les doublons d'email", async () => {
  await Profil.create({
    firstName: "Marie",
    lastName: "Durand",
    email: "marie@example.com"
  });

  const response = await request(app)
    .post("/api/profils")
    .send({
      firstName: "Marie",
      lastName: "Durand",
      email: "marie@example.com"
    })
    .expect(409);

  assert.equal(response.body.error.message, "Email already registered");
});
