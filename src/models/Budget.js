const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Budget = sequelize.define(
  "Budget",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    totalAmount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true,
        min: 0
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "budgets",
    underscored: true
  }
);

module.exports = Budget;
