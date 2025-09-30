const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: process.env.SQLITE_STORAGE || "./database.sqlite",
  logging: process.env.NODE_ENV === "development" ? console.log : false
});

async function testConnection() {
  try {
    await sequelize.authenticate();
    console.log("✅ Connexion à SQLite réussie");
  } catch (error) {
    console.error("❌ Erreur de connexion :", error);
    throw error;
  }
}

module.exports = {
  sequelize,
  testConnection
};
