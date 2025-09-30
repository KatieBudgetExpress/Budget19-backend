const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const Profil = sequelize.define(
  "Profil",
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
    tableName: "profils",
    underscored: true
  }
);

module.exports = Profil;
