const { DataTypes } = require("sequelize");
const { sequelize } = require("../../config/database");

const ImportFile = sequelize.define(
  "ImportFile",
  {
    originalName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true
      }
    },
    storedName: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    status: {
      type: DataTypes.ENUM("pending", "processing", "completed", "failed"),
      allowNull: false,
      defaultValue: "pending",
      validate: {
        isIn: [["pending", "processing", "completed", "failed"]]
      }
    },
    size: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    mimeType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    processedAt: {
      type: DataTypes.DATE,
      allowNull: true
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  },
  {
    tableName: "import_files",
    underscored: true
  }
);

module.exports = ImportFile;
