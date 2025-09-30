const { Router } = require("express");
const { body, param } = require("express-validator");
const budgetsController = require("../controllers/budgets.controller");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate");

const router = Router();

router.get("/", asyncHandler(budgetsController.listBudgets));

router.get(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(budgetsController.getBudget)
);

router.post(
  "/",
  body("name").isString().trim().notEmpty(),
  body("totalAmount").optional().isDecimal(),
  body("description").optional().isString(),
  validate,
  asyncHandler(budgetsController.createBudget)
);

router.put(
  "/:id",
  param("id").isInt().toInt(),
  body("name").optional().isString().trim().notEmpty(),
  body("totalAmount").optional().isDecimal(),
  body("description").optional().isString(),
  validate,
  asyncHandler(budgetsController.updateBudget)
);

router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(budgetsController.deleteBudget)
);

module.exports = router;
