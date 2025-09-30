const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const SousPosteBudgetaire = sequelize.define(
  "SubCategory",
  {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    categoryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "category_id",
      references: {
        model: "categories",
        key: "id"
      },
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    }
  },
  {
    tableName: "sub_categories",
    underscored: true
  }
);

module.exports = SousPosteBudgetaire;
