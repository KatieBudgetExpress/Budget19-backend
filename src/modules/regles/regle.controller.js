const { Regle, ActionSysteme } = require("../../models");
const HttpError = require("../../utils/httpError");

async function listRegles(req, res) {
  const regles = await Regle.findAll({
    include: [{ model: ActionSysteme, as: "actionSysteme" }],
    order: [["createdAt", "DESC"]]
  });

  res.json({ data: regles });
}

async function getRegle(req, res) {
  const { id } = req.params;
  const regle = await Regle.findByPk(id, {
    include: [{ model: ActionSysteme, as: "actionSysteme" }]
  });

  if (!regle) {
    throw new HttpError(404, "Règle introuvable");
  }

  res.json({ data: regle });
}

async function createRegle(req, res) {
  const {
    libelle,
    description,
    conditions = [],
    priorite,
    actif,
    actionSystemeId
  } = req.body;

  const actionSysteme = await ActionSysteme.findByPk(actionSystemeId);
  if (!actionSysteme) {
    throw new HttpError(404, "Action système associée introuvable");
  }

  const regle = await Regle.create({
    libelle,
    description,
    conditions,
    priorite,
    actif,
    actionSystemeId
  });

  const regleCree = await Regle.findByPk(regle.id, {
    include: [{ model: ActionSysteme, as: "actionSysteme" }]
  });

  res.status(201).json({ data: regleCree });
}

async function updateRegle(req, res) {
  const { id } = req.params;
  const regle = await Regle.findByPk(id);

  if (!regle) {
    throw new HttpError(404, "Règle introuvable");
  }

  const {
    libelle,
    description,
    conditions,
    priorite,
    actif,
    actionSystemeId
  } = req.body;

  if (actionSystemeId !== undefined) {
    const actionSysteme = await ActionSysteme.findByPk(actionSystemeId);
    if (!actionSysteme) {
      throw new HttpError(404, "Action système associée introuvable");
    }
  }

  const updateData = {};
  if (libelle !== undefined) updateData.libelle = libelle;
  if (description !== undefined) updateData.description = description;
  if (conditions !== undefined) updateData.conditions = conditions;
  if (priorite !== undefined) updateData.priorite = priorite;
  if (actif !== undefined) updateData.actif = actif;
  if (actionSystemeId !== undefined) updateData.actionSystemeId = actionSystemeId;

  await regle.update(updateData);

  const regleMiseAJour = await Regle.findByPk(regle.id, {
    include: [{ model: ActionSysteme, as: "actionSysteme" }]
  });

  res.json({ data: regleMiseAJour });
}

async function deleteRegle(req, res) {
  const { id } = req.params;
  const regle = await Regle.findByPk(id);

  if (!regle) {
    throw new HttpError(404, "Règle introuvable");
  }

  await regle.destroy();

  res.json({ data: null, message: "Règle supprimée" });
}

module.exports = {
  listRegles,
  getRegle,
  createRegle,
  updateRegle,
  deleteRegle
};
