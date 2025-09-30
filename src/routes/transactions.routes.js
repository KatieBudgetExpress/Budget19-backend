const { Router } = require("express");
const { body, param } = require("express-validator");
const transactionsController = require("../controllers/transactions.controller");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate");

const router = Router();

router.get("/", asyncHandler(transactionsController.listTransactions));

router.get(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(transactionsController.getTransaction)
);

router.post(
  "/",
  body("description").isString().trim().notEmpty(),
  body("amount").isDecimal(),
  body("date").optional().isISO8601(),
  body("type").isIn(["income", "expense"]),
  body("budgetId").isInt().toInt(),
  body("categoryId").isInt().toInt(),
  validate,
  asyncHandler(transactionsController.createTransaction)
);

router.put(
  "/:id",
  param("id").isInt().toInt(),
  body("description").optional().isString().trim().notEmpty(),
  body("amount").optional().isDecimal(),
  body("date").optional().isISO8601(),
  body("type").optional().isIn(["income", "expense"]),
  body("budgetId").optional().isInt().toInt(),
  body("categoryId").optional().isInt().toInt(),
  validate,
  asyncHandler(transactionsController.updateTransaction)
);

router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(transactionsController.deleteTransaction)
);

module.exports = router;
