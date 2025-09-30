const { Router } = require("express");
const { body, param } = require("express-validator");
const sousPosteBudgetaireController = require("./sousPosteBudgetaire.controller");
const asyncHandler = require("../../utils/asyncHandler");
const validate = require("../../middlewares/validate");

const router = Router();

router.get("/", asyncHandler(sousPosteBudgetaireController.listSousPostes));

router.get(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(sousPosteBudgetaireController.getSousPoste)
);

router.post(
  "/",
  body("name").isString().trim().notEmpty(),
  body("categoryId").isInt().toInt(),
  validate,
  asyncHandler(sousPosteBudgetaireController.createSousPoste)
);

router.put(
  "/:id",
  param("id").isInt().toInt(),
  body("name").optional().isString().trim().notEmpty(),
  body("categoryId").optional().isInt().toInt(),
  validate,
  asyncHandler(sousPosteBudgetaireController.updateSousPoste)
);

router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(sousPosteBudgetaireController.deleteSousPoste)
);

module.exports = router;
