require("dotenv").config();

const express = require("express");
const router = express.Router();

const errorMessages = require("../constants/errorConstants");
const validateRequest = require("../middlewares/validateRequest");
const { loginSchema, registerSchema, refreshSchema } = require("../validators/authValidator");

router.post("/register", validateRequest(registerSchema), (req, res, next) => {
  console.log(req.headers);
  res.status(201).send({});
});

module.exports = router;
