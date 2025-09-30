const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Regle = sequelize.define(
  "Regle",
  {
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
    conditions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: []
    },
    priorite: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actif: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    actionSystemeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "actions_systeme",
        key: "id"
      }
    }
  },
  {
    tableName: "regles",
    underscored: true
  }
);

module.exports = Regle;
