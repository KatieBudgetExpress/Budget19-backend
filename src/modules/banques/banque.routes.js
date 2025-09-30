const { Router } = require("express");
const { body, param } = require("express-validator");
const banqueController = require("./banque.controller");
const asyncHandler = require("../../utils/asyncHandler");
const validate = require("../../middlewares/validate");

const router = Router();

router.get("/", asyncHandler(banqueController.listBanques));

router.get(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(banqueController.getBanque)
);

router.post(
  "/",
  body("name").isString().trim().notEmpty(),
  body("institution").isString().trim().notEmpty(),
  body("swiftCode").optional().isString().trim(),
  validate,
  asyncHandler(banqueController.createBanque)
);

router.put(
  "/:id",
  param("id").isInt().toInt(),
  body("name").optional().isString().trim().notEmpty(),
  body("institution").optional().isString().trim().notEmpty(),
  body("swiftCode").optional().isString().trim(),
  validate,
  asyncHandler(banqueController.updateBanque)
);

router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(banqueController.deleteBanque)
);

module.exports = router;
