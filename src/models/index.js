const Budget = require("./Budget");
const Category = require("./Category");
const Transaction = require("./Transaction");

Budget.hasMany(Category, {
  foreignKey: {
    name: "budgetId",
    allowNull: false
  },
  as: "categories",
  onDelete: "CASCADE"
});
Category.belongsTo(Budget, {
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

Category.hasMany(Transaction, {
  foreignKey: {
    name: "categoryId",
    allowNull: false
  },
  as: "transactions",
  onDelete: "CASCADE"
});
Transaction.belongsTo(Category, {
  foreignKey: {
    name: "categoryId",
    allowNull: false
  },
  as: "category"
});

module.exports = {
  Budget,
  Category,
  Transaction
};
