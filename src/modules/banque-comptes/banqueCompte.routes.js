const { Router } = require("express");
const { body, param } = require("express-validator");
const {
  listBanqueComptes,
  getBanqueCompte,
  createBanqueCompte,
  updateBanqueCompte,
  deleteBanqueCompte
} = require("./banqueCompte.controller");
const asyncHandler = require("../../utils/asyncHandler");
const validate = require("../../middlewares/validate");

const router = Router();

router.get("/", asyncHandler(listBanqueComptes));

router.get(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(getBanqueCompte)
);

router.post(
  "/",
  body("name").isString().trim().notEmpty(),
  body("accountNumber").isString().trim().notEmpty(),
  body("balance").optional().isDecimal().toFloat(),
  body("description").optional().isString().trim(),
  body("bankId").isInt().toInt(),
  validate,
  asyncHandler(createBanqueCompte)
);

router.put(
  "/:id",
  param("id").isInt().toInt(),
  body("name").optional().isString().trim().notEmpty(),
  body("accountNumber").optional().isString().trim().notEmpty(),
  body("balance").optional().isDecimal().toFloat(),
  body("description").optional().isString().trim(),
  body("bankId").optional().isInt().toInt(),
  validate,
  asyncHandler(updateBanqueCompte)
);

router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(deleteBanqueCompte)
);

module.exports = router;
