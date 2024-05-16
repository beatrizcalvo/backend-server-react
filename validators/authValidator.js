const Joi = require('joi');

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const registerSchema = Joi.object({
    firstName: Joi.string().min(3).required(),
    lastName: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
});

const refreshSchema = Joi.object({
    refresh_token: Joi.string().min(1).required()
});

module.exports = { loginSchema, registerSchema, refreshSchema };
