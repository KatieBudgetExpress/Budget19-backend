const { Router } = require("express");
const { body, param } = require("express-validator");
const posteBudgetaireController = require("./posteBudgetaire.controller");
const asyncHandler = require("../../utils/asyncHandler");
const validate = require("../../middlewares/validate");

const router = Router();

router.get("/", asyncHandler(posteBudgetaireController.listCategories));

router.get(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(posteBudgetaireController.getCategory)
);

router.post(
  "/",
  body("name").isString().trim().notEmpty(),
  body("type").isIn(["income", "expense"]),
  body("budgetId").isInt().toInt(),
  validate,
  asyncHandler(posteBudgetaireController.createCategory)
);

router.put(
  "/:id",
  param("id").isInt().toInt(),
  body("name").optional().isString().trim().notEmpty(),
  body("type").optional().isIn(["income", "expense"]),
  body("budgetId").optional().isInt().toInt(),
  validate,
  asyncHandler(posteBudgetaireController.updateCategory)
);

router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(posteBudgetaireController.deleteCategory)
);

module.exports = router;
