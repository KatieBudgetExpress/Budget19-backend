const { createApp } = require("./app");
const { sequelize, testConnection } = require("./config/database");
require("./models");

async function startServer() {
  try {
    await testConnection();
    await sequelize.sync();
  } catch (error) {
    console.error("❌ Impossible de préparer la base de données :", error);
    throw error;
  }

  const app = createApp();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${port}`);
  });
}
if (require.main === module) {
  startServer().catch(() => {
    process.exit(1);
  });
}

module.exports = {
  startServer
};
