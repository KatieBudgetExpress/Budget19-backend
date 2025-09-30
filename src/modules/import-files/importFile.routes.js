const { Router } = require("express");
const { body, param } = require("express-validator");
const importFilesController = require("./importFile.controller");
const asyncHandler = require("../../utils/asyncHandler");
const validate = require("../../middlewares/validate");

const router = Router();

const statusValues = ["pending", "processing", "completed", "failed"];

router.get("/", asyncHandler(importFilesController.listImportFiles));

router.get(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(importFilesController.getImportFile)
);

router.post(
  "/",
  body("originalName").isString().trim().notEmpty(),
  body("storedName").isString().trim().notEmpty(),
  body("status").optional().isIn(statusValues),
  body("size").isInt({ min: 0 }).toInt(),
  body("mimeType").optional({ nullable: true }).isString().trim().notEmpty(),
  body("processedAt").optional({ nullable: true }).isISO8601().toDate(),
  body("errorMessage").optional({ nullable: true }).isString(),
  validate,
  asyncHandler(importFilesController.createImportFile)
);

router.put(
  "/:id",
  param("id").isInt().toInt(),
  body("originalName").optional().isString().trim().notEmpty(),
  body("storedName").optional().isString().trim().notEmpty(),
  body("status").optional().isIn(statusValues),
  body("size").optional().isInt({ min: 0 }).toInt(),
  body("mimeType").optional({ nullable: true }).isString().trim().notEmpty(),
  body("processedAt").optional({ nullable: true }).isISO8601().toDate(),
  body("errorMessage").optional({ nullable: true }).isString(),
  validate,
  asyncHandler(importFilesController.updateImportFile)
);

router.delete(
  "/:id",
  param("id").isInt().toInt(),
  validate,
  asyncHandler(importFilesController.deleteImportFile)
);

module.exports = router;
