const { createApp } = require("./app");
const { testConnection } = require("./config/database");

async function startServer() {
  await testConnection();

  const app = createApp();
  const port = process.env.PORT || 3000;

  app.listen(port, () => {
    console.log(`✅ Serveur lancé sur http://localhost:${port}`);
  });
}

if (require.main === module) {
  startServer();
}

module.exports = {
  startServer
};
