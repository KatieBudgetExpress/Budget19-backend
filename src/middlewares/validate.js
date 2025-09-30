const { validationResult } = require("express-validator");
const HttpError = require("../utils/httpError");

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const extractedErrors = errors.array().map((error) => ({
      field: error.param,
      message: error.msg
    }));
    return next(new HttpError(422, "Validation failed", extractedErrors));
  }
  return next();
}

module.exports = validate;
