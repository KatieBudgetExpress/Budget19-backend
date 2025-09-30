process.env.SQLITE_STORAGE = ":memory:";
process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const { createApp } = require("../src/app");
const { sequelize } = require("../src/config/database");
const { ImportFile } = require("../src/models");

const app = createApp();

const basePayload = {
  originalName: "transactions.csv",
  storedName: "import_2024_01.csv",
  status: "pending",
  size: 1024,
  mimeType: "text/csv"
};

test.beforeEach(async () => {
  await sequelize.sync({ force: true });
});

test.after(async () => {
  await sequelize.close();
});

test("POST /api/import-files crée un fichier d'import", async () => {
  const response = await request(app)
    .post("/api/import-files")
    .send(basePayload)
    .expect(201);

  assert.equal(response.body.data.originalName, basePayload.originalName);
  assert.equal(response.body.data.storedName, basePayload.storedName);
  assert.equal(response.body.data.status, basePayload.status);
  assert.equal(response.body.data.size, basePayload.size);
  assert.equal(response.body.data.mimeType, basePayload.mimeType);
});

test("GET /api/import-files retourne la liste des fichiers", async () => {
  await ImportFile.create(basePayload);

  const response = await request(app).get("/api/import-files").expect(200);

  assert.equal(Array.isArray(response.body.data), true);
  assert.equal(response.body.data.length, 1);
  assert.equal(response.body.data[0].storedName, basePayload.storedName);
});

test("PUT /api/import-files/:id met à jour un fichier", async () => {
  const file = await ImportFile.create(basePayload);
  const processedAt = new Date().toISOString();

  const response = await request(app)
    .put(`/api/import-files/${file.id}`)
    .send({
      status: "completed",
      processedAt,
      errorMessage: null
    })
    .expect(200);

  assert.equal(response.body.data.status, "completed");
  assert.equal(
    new Date(response.body.data.processedAt).toISOString().slice(0, -5),
    new Date(processedAt).toISOString().slice(0, -5)
  );
});

test("DELETE /api/import-files/:id supprime un fichier", async () => {
  const file = await ImportFile.create(basePayload);

  await request(app).delete(`/api/import-files/${file.id}`).expect(200);

  const remaining = await ImportFile.findByPk(file.id);
  assert.equal(remaining, null);
});
