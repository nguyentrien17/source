function normalizeJoiError(joiError) {
  const fieldErrors = {};
  const errorsList = [];

  for (const detail of joiError.details || []) {
    const rawPath = Array.isArray(detail.path) ? detail.path : [];
    const key = rawPath.length ? rawPath.join('.') : '_error';
    const message = String(detail.message || 'Dữ liệu không hợp lệ').replace(/"/g, '');

    errorsList.push(message);
    if (!fieldErrors[key]) fieldErrors[key] = [];
    fieldErrors[key].push(message);
  }

  return { fieldErrors, errorsList };
}

const DEFAULT_OPTIONS = {
  abortEarly: false,
  allowUnknown: true,
  stripUnknown: true,
};

/**
 * Validate request data bằng Joi.
 * - Backward-compatible: validate(schema) sẽ validate req.body.
 * - Nâng cao: validate({ body, params, query })
 */
const validate = (schemas, options = DEFAULT_OPTIONS) => (req, res, next) => {
  const schemaMap = schemas && typeof schemas.validate === 'function'
    ? { body: schemas }
    : (schemas || {});

  const aggregatedFieldErrors = {};
  const aggregatedErrorsList = [];

  for (const key of ['body', 'params', 'query']) {
    const schema = schemaMap[key];
    if (!schema) continue;

    const { value, error } = schema.validate(req[key] || {}, options);

    if (error) {
      const { fieldErrors, errorsList } = normalizeJoiError(error);
      for (const [field, msgs] of Object.entries(fieldErrors)) {
        const prefixedField = field === '_error' ? '_error' : field;
        if (!aggregatedFieldErrors[prefixedField]) aggregatedFieldErrors[prefixedField] = [];
        aggregatedFieldErrors[prefixedField].push(...msgs);
      }
      aggregatedErrorsList.push(...errorsList);
      continue;
    }

    // Gán lại giá trị đã được stripUnknown/convert.
    req[key] = value;
  }

  if (aggregatedErrorsList.length) {
    return res.status(422).json({
      success: false,
      code: 'VALIDATION_ERROR',
      message: 'Dữ liệu không hợp lệ',
      errors: aggregatedFieldErrors,
      errorsList: aggregatedErrorsList,
      status: 422,
    });
  }

  next();
};

module.exports = validate;