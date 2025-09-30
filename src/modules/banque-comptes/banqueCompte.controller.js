const { BanqueCompte, Bank } = require("../../models");
const HttpError = require("../../utils/httpError");

async function listBanqueComptes(req, res) {
  const accounts = await BanqueCompte.findAll({
    include: [
      {
        model: Bank,
        as: "bank"
      }
    ],
    order: [["createdAt", "DESC"]]
  });

  res.json({ data: accounts });
}

async function getBanqueCompte(req, res) {
  const { id } = req.params;
  const account = await BanqueCompte.findByPk(id, {
    include: [
      {
        model: Bank,
        as: "bank"
      }
    ]
  });

  if (!account) {
    throw new HttpError(404, "Bank account not found");
  }

  res.json({ data: account });
}

async function createBanqueCompte(req, res) {
  const { name, accountNumber, balance = 0, description, bankId } = req.body;

  const bank = await Bank.findByPk(bankId);

  if (!bank) {
    throw new HttpError(404, "Bank not found");
  }

  const account = await BanqueCompte.create({
    name,
    accountNumber,
    balance,
    description,
    bankId
  });

  const accountWithBank = await BanqueCompte.findByPk(account.id, {
    include: [
      {
        model: Bank,
        as: "bank"
      }
    ]
  });

  res.status(201).json({ data: accountWithBank });
}

async function updateBanqueCompte(req, res) {
  const { id } = req.params;
  const account = await BanqueCompte.findByPk(id);

  if (!account) {
    throw new HttpError(404, "Bank account not found");
  }

  const { name, accountNumber, balance, description, bankId } = req.body;

  if (bankId !== undefined) {
    const bank = await Bank.findByPk(bankId);

    if (!bank) {
      throw new HttpError(404, "Bank not found");
    }
  }

  const updateData = {};
  if (name !== undefined) updateData.name = name;
  if (accountNumber !== undefined) updateData.accountNumber = accountNumber;
  if (balance !== undefined) updateData.balance = balance;
  if (description !== undefined) updateData.description = description;
  if (bankId !== undefined) updateData.bankId = bankId;

  await account.update(updateData);

  const accountWithBank = await BanqueCompte.findByPk(id, {
    include: [
      {
        model: Bank,
        as: "bank"
      }
    ]
  });

  res.json({ data: accountWithBank });
}

async function deleteBanqueCompte(req, res) {
  const { id } = req.params;
  const account = await BanqueCompte.findByPk(id);

  if (!account) {
    throw new HttpError(404, "Bank account not found");
  }

  await account.destroy();

  res.json({ data: null, message: "Bank account deleted" });
}

module.exports = {
  listBanqueComptes,
  getBanqueCompte,
  createBanqueCompte,
  updateBanqueCompte,
  deleteBanqueCompte
};
