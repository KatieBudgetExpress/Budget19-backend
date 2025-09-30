const { ActionSysteme } = require("../../models");
const HttpError = require("../../utils/httpError");

async function listActionsSysteme(req, res) {
  const actions = await ActionSysteme.findAll({
    order: [["createdAt", "DESC"]]
  });

  res.json({ data: actions });
}

async function getActionSysteme(req, res) {
  const { id } = req.params;
  const action = await ActionSysteme.findByPk(id);

  if (!action) {
    throw new HttpError(404, "Action système introuvable");
  }

  res.json({ data: action });
}

async function createActionSysteme(req, res) {
  const { code, libelle, description, actif } = req.body;

  const existing = await ActionSysteme.findOne({ where: { code } });
  if (existing) {
    throw new HttpError(409, "Une action système avec ce code existe déjà");
  }

  const action = await ActionSysteme.create({
    code,
    libelle,
    description,
    actif
  });

  res.status(201).json({ data: action });
}

async function updateActionSysteme(req, res) {
  const { id } = req.params;
  const action = await ActionSysteme.findByPk(id);

  if (!action) {
    throw new HttpError(404, "Action système introuvable");
  }

  const { code, libelle, description, actif } = req.body;

  if (code !== undefined && code !== action.code) {
    const existing = await ActionSysteme.findOne({ where: { code } });
    if (existing) {
      throw new HttpError(409, "Une action système avec ce code existe déjà");
    }
  }

  const updateData = {};
  if (code !== undefined) updateData.code = code;
  if (libelle !== undefined) updateData.libelle = libelle;
  if (description !== undefined) updateData.description = description;
  if (actif !== undefined) updateData.actif = actif;

  await action.update(updateData);

  res.json({ data: action });
}

async function deleteActionSysteme(req, res) {
  const { id } = req.params;
  const action = await ActionSysteme.findByPk(id);

  if (!action) {
    throw new HttpError(404, "Action système introuvable");
  }

  await action.destroy();

  res.json({ data: null, message: "Action système supprimée" });
}

module.exports = {
  listActionsSysteme,
  getActionSysteme,
  createActionSysteme,
  updateActionSysteme,
  deleteActionSysteme
};
