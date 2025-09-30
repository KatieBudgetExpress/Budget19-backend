const Budget = require("../modules/budgets/budget.model");
const PosteBudgetaire = require(
  "../modules/postes-budgetaires/posteBudgetaire.model"
);
const SousPosteBudgetaire = require(
  "../modules/sous-postes-budgetaires/sousPosteBudgetaire.model"
);
const Transaction = require("./Transaction");
const Profil = require("../modules/profils/profil.model");
const ActionSysteme = require("../modules/actions-systeme/actionSysteme.model");
const Bank = require("../modules/banques/banque.model");
const BanqueCompte = require("../modules/banque-comptes/banqueCompte.model");
const Banque = Bank;
const ImportFile = require("../modules/import-files/importFile.model");

Budget.hasMany(PosteBudgetaire, {
  foreignKey: {
    name: "budgetId",
    allowNull: false
  },
  as: "categories",
  onDelete: "CASCADE"
});
PosteBudgetaire.belongsTo(Budget, {
  foreignKey: {
    name: "budgetId",
    allowNull: false
  },
  as: "budget"
});

PosteBudgetaire.hasMany(SousPosteBudgetaire, {
  foreignKey: {
    name: "categoryId",
    allowNull: false
  },
  as: "subCategories",
  onDelete: "CASCADE"
});
SousPosteBudgetaire.belongsTo(PosteBudgetaire, {
  foreignKey: {
    name: "categoryId",
    allowNull: false
  },
  as: "category"
});

Budget.hasMany(Transaction, {
  foreignKey: {
    name: "budgetId",
    allowNull: false
  },
  as: "transactions",
  onDelete: "CASCADE"
});
Transaction.belongsTo(Budget, {
  foreignKey: {
    name: "budgetId",
    allowNull: false
  },
  as: "budget"
});

PosteBudgetaire.hasMany(Transaction, {
  foreignKey: {
    name: "categoryId",
    allowNull: false
  },
  as: "transactions",
  onDelete: "CASCADE"
});
Transaction.belongsTo(PosteBudgetaire, {
  foreignKey: {
    name: "categoryId",
    allowNull: false
  },
  as: "category"
});

Bank.hasMany(BanqueCompte, {
  foreignKey: {
    name: "bankId",
    allowNull: false
  },
  as: "accounts",
  onDelete: "CASCADE"
});
BanqueCompte.belongsTo(Bank, {
  foreignKey: {
    name: "bankId",
    allowNull: false
  },
  as: "bank"
});

const Category = PosteBudgetaire;
const SubCategory = SousPosteBudgetaire;

module.exports = {
  Budget,
  Category,
  SousPosteBudgetaire,
  SubCategory,
  Transaction,
  Profil,
  ActionSysteme,
  Bank,
  Banque,
  BanqueCompte,
  ImportFile
};
