const sanitizeValue = (value) => {
  if (Array.isArray(value)) return value.map(sanitizeValue);
  if (!value || typeof value !== "object") return value;

  return Object.entries(value).reduce((safe, [key, nested]) => {
    if (key.startsWith("$") || key.includes(".")) return safe;
    safe[key] = sanitizeValue(nested);
    return safe;
  }, {});
};

const sanitizeRequest = (req, _res, next) => {
  if (req.body) req.body = sanitizeValue(req.body);
  if (req.params) req.params = sanitizeValue(req.params);
  next();
};

module.exports = sanitizeRequest;
