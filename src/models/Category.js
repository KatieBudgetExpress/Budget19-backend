const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");

const Category = sequelize.define(
  "Category",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    type: {
      type: DataTypes.ENUM("income", "expense"),
      allowNull: false
    }
  },
  {
    tableName: "categories",
    underscored: true
  }
);

module.exports = Category;
