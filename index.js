const express = require("express");
const cors = require("cors");
const { Sequelize } = require("sequelize");

// Initialisation de l'app Express
const app = express();
app.use(cors());
app.use(express.json());

// Connexion à la base SQLite
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "./database.sqlite"
});

// Test de connexion
sequelize.authenticate()
  .then(() => console.log("✅ Connexion à SQLite réussie"))
  .catch(err => console.error("❌ Erreur de connexion :", err));

// Route simple pour tester
app.get("/", (req, res) => {
  res.send("Backend Budget19 est en marche 🚀");
});

// Démarrage du serveur
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Serveur lancé sur http://localhost:${PORT}`);
});
