const { Usager } = require("../models");
const HttpError = require("../utils/httpError");

async function listUsagers(req, res) {
  const usagers = await Usager.findAll({ order: [["createdAt", "DESC"]] });
  res.json({ data: usagers });
}

async function getUsager(req, res) {
  const { id } = req.params;
  const usager = await Usager.findByPk(id);
  if (!usager) throw new HttpError(404, "Usager not found");
  res.json({ data: usager });
}

async function createUsager(req, res) {
  const { firstName, lastName, email } = req.body;
  const exists = await Usager.findOne({ where: { email } });
  if (exists) throw new HttpError(409, "Email already registered");
  const usager = await Usager.create({ firstName, lastName, email });
  res.status(201).json({ data: usager });
}

async function updateUsager(req, res) {
  const { id } = req.params;
  const usager = await Usager.findByPk(id);
  if (!usager) throw new HttpError(404, "Usager not found");

  const { firstName, lastName, email } = req.body;
  if (email !== undefined && email !== usager.email) {
    const exists = await Usager.findOne({ where: { email } });
    if (exists) throw new HttpError(409, "Email already registered");
  }

  const updateData = {};
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (email !== undefined) updateData.email = email;

  await usager.update(updateData);
  res.json({ data: usager });
}

async function deleteUsager(req, res) {
  const { id } = req.params;
  const usager = await Usager.findByPk(id);
  if (!usager) throw new HttpError(404, "Usager not found");
  await usager.destroy();
  res.json({ data: null, message: "Usager deleted" });
}

module.exports = {
  listUsagers,
  getUsager,
  createUsager,
  updateUsager,
  deleteUsager
};
