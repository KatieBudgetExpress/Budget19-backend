const Budget = require("../modules/budgets/budget.model");
const PosteBudgetaire = require(
  "../modules/postes-budgetaires/posteBudgetaire.model"
);
const Transaction = require("./Transaction");
const Usager = require("./Usager");

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

module.exports = {
  Budget,
  Category,
  Transaction,
  Usager
};
