const Joi = require("joi");

const updateSchema = Joi.object({    
  active: Joi.boolean().optional(),
  person: {
    personName: {
      firstName: Joi.string().min(3).optional(),
      lastName: Joi.string().min(3).optional(),
      secondLastName: Joi.string().allow("").optional()
    },
    gender: Joi.string().valid("Female", "Male").optional(),
    birthDate: Joi.date().iso().optional(),
    firstNationality: {
      code: Joi.string().min(2).max(2).optional()
    }
  },
  contactPoint: {
    postalAddress: {
      addressLines: Joi.array().items(Joi.string().allow("")).max(2).optional(),
      city: Joi.string().optional(),
      zipCode: Joi.string().regex(/^[0-9]{5}(?:-[0-9]{4})?$/i).when('city', { is: Joi.exist(), then: Joi.required() }),
      country: Joi.object().keys({
        code: Joi.string().min(2).max(2)
      }).when('city', { is: Joi.exist(), then: Joi.object().keys({ code: Joi.required() }).required() })
    }
  }
});

module.exports = { updateSchema }
