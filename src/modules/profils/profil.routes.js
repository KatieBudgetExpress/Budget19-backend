const { Router } = require("express");
const { body, param } = require("express-validator");
const profilController = require("./profil.controller");
const asyncHandler = require("../../utils/asyncHandler");
const validate = require("../../middlewares/validate");

const router = Router();

router.get("/", asyncHandler(profilController.listProfils));

router.get(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(profilController.getProfil)
);

router.post(
  "/",
  body("firstName").isString().trim().notEmpty(),
  body("lastName").isString().trim().notEmpty(),
  body("email").isEmail().normalizeEmail(),
  validate,
  asyncHandler(profilController.createProfil)
);

router.put(
  "/:id",
  param("id").isInt().toInt(),
  body("firstName").optional().isString().trim().notEmpty(),
  body("lastName").optional().isString().trim().notEmpty(),
  body("email").optional().isEmail().normalizeEmail(),
  validate,
  asyncHandler(profilController.updateProfil)
);

router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(profilController.deleteProfil)
);

module.exports = router;
