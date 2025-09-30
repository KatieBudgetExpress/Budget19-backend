const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const BanqueCompte = sequelize.define(
  "BanqueCompte",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    balance: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0,
      validate: {
        isDecimal: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "banque_comptes",
    underscored: true
  }
);

module.exports = BanqueCompte;
