const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Usager = sequelize.define(
  "Usager",
  {
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    }
  },
  {
    tableName: "usagers",
    underscored: true
  }
);

module.exports = Usager;
