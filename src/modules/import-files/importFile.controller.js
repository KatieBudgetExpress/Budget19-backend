const { ImportFile } = require("../../models");
const HttpError = require("../../utils/httpError");

async function listImportFiles(req, res) {
  const files = await ImportFile.findAll({
    order: [["createdAt", "DESC"]]
  });

  res.json({ data: files });
}

async function getImportFile(req, res) {
  const { id } = req.params;
  const file = await ImportFile.findByPk(id);

  if (!file) {
    throw new HttpError(404, "Fichier d'import introuvable");
  }

  res.json({ data: file });
}

async function createImportFile(req, res) {
  const {
    originalName,
    storedName,
    status,
    size,
    mimeType,
    processedAt,
    errorMessage
  } = req.body;

  const existing = await ImportFile.findOne({ where: { storedName } });
  if (existing) {
    throw new HttpError(
      409,
      "Un fichier d'import avec ce nom stocké existe déjà"
    );
  }

  const file = await ImportFile.create({
    originalName,
    storedName,
    status,
    size,
    mimeType,
    processedAt,
    errorMessage
  });

  res.status(201).json({ data: file });
}

async function updateImportFile(req, res) {
  const { id } = req.params;
  const file = await ImportFile.findByPk(id);

  if (!file) {
    throw new HttpError(404, "Fichier d'import introuvable");
  }

  const {
    originalName,
    storedName,
    status,
    size,
    mimeType,
    processedAt,
    errorMessage
  } = req.body;

  if (storedName !== undefined && storedName !== file.storedName) {
    const existing = await ImportFile.findOne({ where: { storedName } });
    if (existing) {
      throw new HttpError(
        409,
        "Un fichier d'import avec ce nom stocké existe déjà"
      );
    }
  }

  const updateData = {};
  if (originalName !== undefined) updateData.originalName = originalName;
  if (storedName !== undefined) updateData.storedName = storedName;
  if (status !== undefined) updateData.status = status;
  if (size !== undefined) updateData.size = size;
  if (mimeType !== undefined) updateData.mimeType = mimeType;
  if (processedAt !== undefined) updateData.processedAt = processedAt;
  if (errorMessage !== undefined) updateData.errorMessage = errorMessage;

  await file.update(updateData);

  res.json({ data: file });
}

async function deleteImportFile(req, res) {
  const { id } = req.params;
  const file = await ImportFile.findByPk(id);

  if (!file) {
    throw new HttpError(404, "Fichier d'import introuvable");
  }

  await file.destroy();

  res.json({ data: null, message: "Fichier d'import supprimé" });
}

module.exports = {
  listImportFiles,
  getImportFile,
  createImportFile,
  updateImportFile,
  deleteImportFile
};
