const { Bank } = require("../../models");
const HttpError = require("../../utils/httpError");

async function listBanques(req, res) {
  const banks = await Bank.findAll({
    order: [["createdAt", "DESC"]]
  });

  res.json({ data: banks });
}

async function getBanque(req, res) {
  const { id } = req.params;
  const bank = await Bank.findByPk(id);

  if (!bank) {
    throw new HttpError(404, "Bank not found");
  }

  res.json({ data: bank });
}

async function createBanque(req, res) {
  const {
    name,
    institution,
    accountNumber,
    balance = 0,
    description
  } = req.body;
  const bank = await Bank.create({
    name,
    institution,
    accountNumber,
    balance,
    description
  });

  res.status(201).json({ data: bank });
}

async function updateBanque(req, res) {
  const { id } = req.params;
  const bank = await Bank.findByPk(id);

  if (!bank) {
    throw new HttpError(404, "Bank not found");
  }

  const { name, institution, accountNumber, balance, description } = req.body;

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (institution !== undefined) updateData.institution = institution;
  if (accountNumber !== undefined) updateData.accountNumber = accountNumber;
  if (balance !== undefined) updateData.balance = balance;
  if (description !== undefined) updateData.description = description;

  await bank.update(updateData);

  res.json({ data: bank });
}

async function deleteBanque(req, res) {
  const { id } = req.params;
  const bank = await Bank.findByPk(id);

  if (!bank) {
    throw new HttpError(404, "Bank not found");
  }

  await bank.destroy();

  res.json({ data: null, message: "Bank deleted" });
}

module.exports = {
  listBanques,
  getBanque,
  createBanque,
  updateBanque,
  deleteBanque
};
