const { Router } = require("express");
const { body, param } = require("express-validator");
const usagersController = require("../controllers/usagers.controller");
const asyncHandler = require("../utils/asyncHandler");
const validate = require("../middlewares/validate");

const router = Router();

router.get("/", asyncHandler(usagersController.listUsagers));

router.get(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(usagersController.getUsager)
);

router.post(
  "/",
  body("firstName").isString().trim().notEmpty(),
  body("lastName").isString().trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  validate,
  asyncHandler(usagersController.createUsager)
);

router.put(
  "/:id",
  param("id").isInt().toInt(),
  body("firstName").optional().isString().trim().notEmpty(),
  body("lastName").optional().isString().trim().notEmpty(),
  body("email").optional().isEmail().normalizeEmail(),
  validate,
  asyncHandler(usagersController.updateUsager)
);

router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(usagersController.deleteUsager)
);

module.exports = router;
