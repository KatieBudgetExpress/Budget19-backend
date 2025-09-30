const { Category, SousPosteBudgetaire } = require("../../models");
const HttpError = require("../../utils/httpError");

async function listSousPostes(req, res) {
  const sousPostes = await SousPosteBudgetaire.findAll({
    include: [{ model: Category, as: "category" }],
    order: [["createdAt", "DESC"]]
  });

  res.json({ data: sousPostes });
}

async function getSousPoste(req, res) {
  const { id } = req.params;
  const sousPoste = await SousPosteBudgetaire.findByPk(id, {
    include: [{ model: Category, as: "category" }]
  });

  if (!sousPoste) {
    throw new HttpError(404, "Sous-poste budgétaire introuvable");
  }

  res.json({ data: sousPoste });
}

async function createSousPoste(req, res) {
  const { name, categoryId } = req.body;

  const category = await Category.findByPk(categoryId);
  if (!category) {
    throw new HttpError(404, "Poste budgétaire introuvable pour le categoryId fourni");
  }

  const sousPoste = await SousPosteBudgetaire.create({ name, categoryId });
  res.status(201).json({ data: sousPoste });
}

async function updateSousPoste(req, res) {
  const { id } = req.params;
  const sousPoste = await SousPosteBudgetaire.findByPk(id);

  if (!sousPoste) {
    throw new HttpError(404, "Sous-poste budgétaire introuvable");
  }

  const { name, categoryId } = req.body;

  if (categoryId !== undefined && categoryId !== sousPoste.categoryId) {
    const category = await Category.findByPk(categoryId);
    if (!category) {
      throw new HttpError(404, "Poste budgétaire introuvable pour le categoryId fourni");
    }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (categoryId !== undefined) updateData.categoryId = categoryId;

  await sousPoste.update(updateData);

  res.json({ data: sousPoste });
}

async function deleteSousPoste(req, res) {
  const { id } = req.params;
  const sousPoste = await SousPosteBudgetaire.findByPk(id);

  if (!sousPoste) {
    throw new HttpError(404, "Sous-poste budgétaire introuvable");
  }

  await sousPoste.destroy();

  res.json({ data: null, message: "Sous-poste budgétaire supprimé" });
}

module.exports = {
  listSousPostes,
  getSousPoste,
  createSousPoste,
  updateSousPoste,
  deleteSousPoste
};
