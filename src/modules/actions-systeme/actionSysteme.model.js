const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const ActionSysteme = sequelize.define(
  "ActionSysteme",
  {
    code: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    libelle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    actif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  },
  {
    tableName: "actions_systeme",
    underscored: true
  }
);

module.exports = ActionSysteme;
