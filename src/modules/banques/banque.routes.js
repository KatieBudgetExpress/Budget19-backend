const { Router } = require("express");
const { body, param } = require("express-validator");
const {
  listBanques,
  getBanque,
  createBanque,
  updateBanque,
  deleteBanque
} = require("./banque.controller");
const asyncHandler = require("../../utils/asyncHandler");
const validate = require("../../middlewares/validate");

const router = Router();

router.get("/", asyncHandler(listBanques));

router.get(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(getBanque)
);

router.post(
  "/",
  body("name").isString().trim().notEmpty(),
  body("institution").isString().trim().notEmpty(),
  body("swiftCode").optional().isString().trim(),
  validate,
  asyncHandler(createBanque)
);

router.put(
  "/:id",
  param("id").isInt().toInt(),
  body("name").optional().isString().trim().notEmpty(),
  body("institution").optional().isString().trim().notEmpty(),
  body("swiftCode").optional().isString().trim(),
  validate,
  asyncHandler(updateBanque)
);

router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(deleteBanque)
);

module.exports = router;
