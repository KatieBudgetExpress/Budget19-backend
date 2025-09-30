const express = require("express");
const cors = require("cors");

function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Backend Budget19 est en marche 🚀");
  });

  app.get("/health", (req, res) => {
    res.json({ status: "ok" });
  });

  return app;
}

module.exports = {
  createApp
};
