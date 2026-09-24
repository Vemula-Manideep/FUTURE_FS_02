const ApiError = require("../utils/ApiError");

const validate = (schema) => (req, _res, next) => {
  const parsed = schema.safeParse({
    body: req.body,
    query: req.query,
    params: req.params,
  });

  if (!parsed.success) {
    return next(new ApiError(400, "Validation failed", parsed.error.flatten()));
  }

  req.validated = parsed.data;
  next();
};

module.exports = validate;
