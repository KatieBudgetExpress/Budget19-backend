const express = require("express");
const cors = require("cors");

// Import des routes
const budgetsRouter = require("./modules/budgets/budget.routes");
const posteBudgetaireRouter = require("./modules/postes-budgetaires/posteBudgetaire.routes");
const sousPosteBudgetaireRouter = require("./modules/sous-postes-budgetaires/sousPosteBudgetaire.routes");
const actionsSystemeRouter = require("./modules/actions-systeme/actionSysteme.routes");
const reglesRouter = require("./modules/regles/regle.routes");
const transactionsRouter = require("./routes/transactions.routes");
const profilsRouter = require("./modules/profils/profil.routes");
const banquesRouter = require("./modules/banques/banque.routes");
const banqueComptesRouter = require("./modules/banque-comptes/banqueCompte.routes");
const importFilesRouter = require("./routes/importFile.routes");

// ✅ Ajout Notifications
const notificationsRouter = require("./modules/notifications/notification.routes");

const HttpError = require("./utils/httpError");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Route simple pour tester
  app.get("/", (req, res) => {
    res.json({ message: "Backend Budget19 est en marche 🚀" });
  });

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // 🔗 Routes API
  app.use("/api/budgets", budgetsRouter);
  app.use("/api/postes-budgetaires", posteBudgetaireRouter);
  app.use("/api/categories", posteBudgetaireRouter);
  app.use("/api/sous-postes-budgetaires", sousPosteBudgetaireRouter);
  app.use("/api/actions-systeme", actionsSystemeRouter);
  app.use("/api/regles", reglesRouter);
  app.use("/api/transactions", transactionsRouter);
  app.use("/api/profils", profilsRouter);
  app.use("/api/banques", banquesRouter);
  app.use("/api/banque-comptes", banqueComptesRouter);
  app.use("/api/import-files", importFilesRouter);

  // ✅ Nouvelle route Notifications
  app.use("/api/notifications", notificationsRouter);

  // Gestion 404
  app.use((req, res, next) => {
    next(new HttpError(404, "Resource not found"));
  });

  // Gestion erreurs
  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const response = {
      error: {
        message: err.message || "Internal Server Error",
      },
    };

    if (err.details) {
      response.error.details = err.details;
    }

    if (process.env.NODE_ENV === "development") {
      response.error.stack = err.stack;
    }

    res.status(status).json(response);
  });

  return app;
}

module.exports = {
  createApp,
};
