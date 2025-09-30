const express = require("express");
const cors = require("cors");
const budgetsRouter = require("./routes/budgets.routes");
const categoriesRouter = require("./routes/categories.routes");
const transactionsRouter = require("./routes/transactions.routes");
const HttpError = require("./utils/httpError");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.json({ message: "Backend Budget19 est en marche 🚀" });
  });

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use("/api/budgets", budgetsRouter);
  app.use("/api/categories", categoriesRouter);
  app.use("/api/transactions", transactionsRouter);

  app.use((req, res, next) => {
    next(new HttpError(404, "Resource not found"));
  });

  app.use((err, req, res, next) => {
    const status = err.status || 500;
    const response = {
      error: {
        message: err.message || "Internal Server Error"
      }
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
  createApp
};
