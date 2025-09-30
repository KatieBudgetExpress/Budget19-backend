const { Router } = require("express");
const { body, param } = require("express-validator");
const actionsSystemeController = require("./actionSysteme.controller");
const asyncHandler = require("../../utils/asyncHandler");
const validate = require("../../middlewares/validate");

const router = Router();

router.get("/", asyncHandler(actionsSystemeController.listActionsSysteme));

router.get(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(actionsSystemeController.getActionSysteme)
);

router.post(
  "/",
  body("code").isString().trim().notEmpty(),
  body("libelle").isString().trim().notEmpty(),
  body("description").optional({ nullable: true }).isString(),
  body("actif").optional().isBoolean().toBoolean(),
  validate,
  asyncHandler(actionsSystemeController.createActionSysteme)
);

router.put(
  "/:id",
  param("id").isInt().toInt(),
  body("code").optional().isString().trim().notEmpty(),
  body("libelle").optional().isString().trim().notEmpty(),
  body("description").optional({ nullable: true }).isString(),
  body("actif").optional().isBoolean().toBoolean(),
  validate,
  asyncHandler(actionsSystemeController.updateActionSysteme)
);

router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(actionsSystemeController.deleteActionSysteme)
);

module.exports = router;
