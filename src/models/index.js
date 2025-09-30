const Budget = require("../modules/budgets/budget.model");
const PosteBudgetaire = require(
  "../modules/postes-budgetaires/posteBudgetaire.model"
);
const SousPosteBudgetaire = require(
  "../modules/sous-postes-budgetaires/sousPosteBudgetaire.model"
);
const Transaction = require("./Transaction");
const Usager = require("./Usager");
const ActionSysteme = require("../modules/actions-systeme/actionSysteme.model");
const Bank = require("../modules/banques/banque.model");
const Banque = Bank;

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

const Category = PosteBudgetaire;
const SubCategory = SousPosteBudgetaire;

module.exports = {
  Budget,
  Category,
  SousPosteBudgetaire,
  SubCategory,
  Transaction,
  Usager,
  ActionSysteme,
  Bank,
  Banque
};
