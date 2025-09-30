const { Profil } = require("../../models");
const HttpError = require("../../utils/httpError");

async function listProfils(req, res) {
  const profils = await Profil.findAll({ order: [["createdAt", "DESC"]] });
  res.json({ data: profils });
}

async function getProfil(req, res) {
  const { id } = req.params;
  const profil = await Profil.findByPk(id);
  if (!profil) throw new HttpError(404, "Profil not found");
  res.json({ data: profil });
}

async function createProfil(req, res) {
  const { firstName, lastName, email } = req.body;
  const exists = await Profil.findOne({ where: { email } });
  if (exists) throw new HttpError(409, "Email already registered");
  const profil = await Profil.create({ firstName, lastName, email });
  res.status(201).json({ data: profil });
}

async function updateProfil(req, res) {
  const { id } = req.params;
  const profil = await Profil.findByPk(id);
  if (!profil) throw new HttpError(404, "Profil not found");

  const { firstName, lastName, email } = req.body;
  if (email !== undefined && email !== profil.email) {
    const exists = await Profil.findOne({ where: { email } });
    if (exists) throw new HttpError(409, "Email already registered");
  }

  const updateData = {};
  if (firstName !== undefined) updateData.firstName = firstName;
  if (lastName !== undefined) updateData.lastName = lastName;
  if (email !== undefined) updateData.email = email;

  await profil.update(updateData);
  res.json({ data: profil });
}

async function deleteProfil(req, res) {
  const { id } = req.params;
  const profil = await Profil.findByPk(id);
  if (!profil) throw new HttpError(404, "Profil not found");
  await profil.destroy();
  res.json({ data: null, message: "Profil deleted" });
}

module.exports = {
  listProfils,
  getProfil,
  createProfil,
  updateProfil,
  deleteProfil
};
