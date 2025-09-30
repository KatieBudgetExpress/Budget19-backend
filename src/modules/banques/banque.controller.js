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
  const existingBank = await Bank.findOne({ where: { accountNumber } });

  if (existingBank) {
    throw new HttpError(409, "Account number already in use");
  }

  try {
    const bank = await Bank.create({
      name,
      institution,
      accountNumber,
      balance,
      description
    });

    res.status(201).json({ data: bank });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new HttpError(409, "Account number already in use");
    }

    throw error;
  }
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
  if (accountNumber !== undefined) {
    if (accountNumber !== bank.accountNumber) {
      const conflictingBank = await Bank.findOne({
        where: { accountNumber }
      });

      if (conflictingBank && conflictingBank.id !== bank.id) {
        throw new HttpError(409, "Account number already in use");
      }
    }

    updateData.accountNumber = accountNumber;
  }
  if (balance !== undefined) updateData.balance = balance;
  if (description !== undefined) updateData.description = description;

  try {
    await bank.update(updateData);

    res.json({ data: bank });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      throw new HttpError(409, "Account number already in use");
    }

    throw error;
  }
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
