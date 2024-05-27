const createHttpError = require('http-errors');
const Joi = require('joi');

const errorMessages = require("../constants/errorConstants");

const validateRequest = (schema) => function (req, res, next) { 
  try {
    // Delete withespaces in all input body fields
    req.body = trimObjValues(req.body);

    // Validate all input body fields
    const result = schema.validate(req.body, { abortEarly: false});
    if (result.error) return next(createHttpError(400, createValidationErrors(result.error)));
    next();    
  } catch (error) {
    next(createHttpError(500, error));
  }
};

const trimObjValues = function (obj) {
  if (Object.prototype.toString.call(obj) === "[object String]") return obj.trim();
  if (Object.prototype.toString.call(obj) === "[object Object]") 
    return Object.fromEntries(Object.keys(obj).map(key => [key, trimObjValues(obj[key])]));
  if (Object.prototype.toString.call(obj) === "[object Array]")
    return obj.map(item => trimObjValues(item));
  return obj;
};

const createValidationErrors = function (error) {
  const listErrors = [];
  error.details.map(err => {
    console.log(err);
    const field = err.path.join(".");
    switch (err.type) {
      case "any.empty":
      case "any.required":
      case "string.empty":
        listErrors.push(errorMessages.AUTH_API_F_0001(field));
        break;
      case "any.only":
        listErrors.push(errorMessages.AUTH_API_F_0010(field, err.context.valids.join(", ")));
        break;
      case "array.base":
      case "date.base":
      case "date.format": 
      case "string.base":
      case "string.email":
        listErrors.push(errorMessages.AUTH_API_F_0002(field));
        break;
      case "string.min":
        listErrors.push(errorMessages.AUTH_API_F_0003(field, err.context.limit));
        break;
      case "array.max":
        listErrors.push(errorMessages.AUTH_API_F_0014(field, err.context.limit));
        break;
      case "object.unknown":
        listErrors.push(errorMessages.AUTH_API_F_0004(field));
        break;
      default: 
        break;
    }
  });
  return JSON.stringify(listErrors);
};

module.exports = validateRequest;
