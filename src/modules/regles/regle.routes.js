const { Router } = require("express");
const { body, param } = require("express-validator");
const regleController = require("./regle.controller");
const asyncHandler = require("../../utils/asyncHandler");
const validate = require("../../middlewares/validate");

const router = Router();

router.get("/", asyncHandler(regleController.listRegles));

router.get(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(regleController.getRegle)
);

router.post(
  "/",
  body("libelle").isString().trim().notEmpty(),
  body("description").optional({ nullable: true }).isString(),
  body("conditions").optional().isArray(),
  body("priorite").optional().isInt().toInt(),
  body("actif").optional().isBoolean().toBoolean(),
  body("actionSystemeId").isInt().toInt(),
  validate,
  asyncHandler(regleController.createRegle)
);

router.put(
  "/:id",
  param("id").isInt().toInt(),
  body("libelle").optional().isString().trim().notEmpty(),
  body("description").optional({ nullable: true }).isString(),
  body("conditions").optional().isArray(),
  body("priorite").optional().isInt().toInt(),
  body("actif").optional().isBoolean().toBoolean(),
  body("actionSystemeId").optional().isInt().toInt(),
  validate,
  asyncHandler(regleController.updateRegle)
);

router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(regleController.deleteRegle)
);

module.exports = router;
