process.env.SQLITE_STORAGE = ":memory:";
process.env.NODE_ENV = "test";

const test = require("node:test");
const assert = require("node:assert/strict");
const request = require("supertest");

const { createApp } = require("../src/app");
const { sequelize } = require("../src/config/database");
const { ActionSysteme, Regle } = require("../src/models");

const app = createApp();

let actionReference;

test.beforeEach(async () => {
  await sequelize.sync({ force: true });
  actionReference = await ActionSysteme.create({
    code: "ACTION_TEST",
    libelle: "Action de test",
    description: "Action utilisée pour les tests",
    actif: true
  });
});

test.after(async () => {
  await sequelize.close();
});

test("POST /api/regles crée une règle", async () => {
  const response = await request(app)
    .post("/api/regles")
    .send({
      libelle: "Règle de test",
      description: "Valide les transactions",
      conditions: [{ field: "montant", operator: ">", value: 100 }],
      priorite: 1,
      actif: true,
      actionSystemeId: actionReference.id
    })
    .expect(201);

  assert.equal(response.body.data.libelle, "Règle de test");
  assert.equal(response.body.data.actionSysteme.id, actionReference.id);
  assert.equal(Array.isArray(response.body.data.conditions), true);
});

test("GET /api/regles retourne la liste des règles", async () => {
  await Regle.create({
    libelle: "Règle existante",
    description: "Description",
    conditions: [],
    priorite: 2,
    actif: true,
    actionSystemeId: actionReference.id
  });

  const response = await request(app).get("/api/regles").expect(200);

  assert.equal(Array.isArray(response.body.data), true);
  assert.equal(response.body.data.length, 1);
  assert.equal(response.body.data[0].libelle, "Règle existante");
  assert.equal(response.body.data[0].actionSysteme.id, actionReference.id);
});

test("GET /api/regles/:id retourne une règle", async () => {
  const regle = await Regle.create({
    libelle: "Règle détaillée",
    description: "Avec conditions",
    conditions: [{ champ: "type", valeur: "DEPENSE" }],
    priorite: 3,
    actif: true,
    actionSystemeId: actionReference.id
  });

  const response = await request(app)
    .get(`/api/regles/${regle.id}`)
    .expect(200);

  assert.equal(response.body.data.id, regle.id);
  assert.equal(response.body.data.actionSysteme.id, actionReference.id);
  assert.equal(Array.isArray(response.body.data.conditions), true);
});

test("PUT /api/regles/:id met à jour une règle", async () => {
  const regle = await Regle.create({
    libelle: "Règle à modifier",
    description: "Avant modification",
    conditions: [],
    priorite: 1,
    actif: true,
    actionSystemeId: actionReference.id
  });

  const nouvelleAction = await ActionSysteme.create({
    code: "ACTION_ALERTE",
    libelle: "Action d'alerte",
    description: "Envoie une alerte",
    actif: true
  });

  const response = await request(app)
    .put(`/api/regles/${regle.id}`)
    .send({
      libelle: "Règle modifiée",
      conditions: [{ champ: "montant", operateur: ">", valeur: 500 }],
      actif: false,
      actionSystemeId: nouvelleAction.id
    })
    .expect(200);

  assert.equal(response.body.data.libelle, "Règle modifiée");
  assert.equal(response.body.data.actif, false);
  assert.equal(response.body.data.actionSysteme.id, nouvelleAction.id);
  assert.equal(Array.isArray(response.body.data.conditions), true);
  assert.equal(response.body.data.conditions[0].valeur, 500);
});

test("DELETE /api/regles/:id supprime une règle", async () => {
  const regle = await Regle.create({
    libelle: "Règle à supprimer",
    description: "Doit disparaître",
    conditions: [],
    priorite: 4,
    actif: true,
    actionSystemeId: actionReference.id
  });

  await request(app).delete(`/api/regles/${regle.id}`).expect(200);

  const remaining = await Regle.findByPk(regle.id);
  assert.equal(remaining, null);
});
