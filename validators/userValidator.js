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
      code: Joi.string().optional()
    }
  },
  contactPoint: {
    postalAddress: {
      addressLines: Joi.array().items(Joi.string().min(10)).max(2).optional(),
      city: Joi.string().optional(),
      zipCode: Joi.string().min(5).max(9).optional(),
      country: {
        code: Joi.string().optional()
      }
    }
  }
});

module.exports = { updateSchema }
