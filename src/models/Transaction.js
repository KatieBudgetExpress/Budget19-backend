const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Transaction = sequelize.define(
  "Transaction",
  {
    description: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        isDecimal: true
      }
    },
    date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    type: {
      type: DataTypes.ENUM("income", "expense"),
      allowNull: false
    }
  },
  {
    tableName: "transactions",
    underscored: true
  }
);

module.exports = Transaction;
