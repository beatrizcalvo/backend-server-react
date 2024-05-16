require("dotenv").config();

const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const errorMessages = require("../constants/errorConstants");
const validateRequest = require("../middlewares/validateRequest");
const { loginSchema, registerSchema, refreshSchema } = require("../validators/authValidator");

router.post("/register", validateRequest(registerSchema), (req, res, next) => {
  const firstName = req.body.firstName.trim();
  const lastName = req.body.lastName.trim();
  const email = req.body.email.trim().toLowerCase();
  const password = req.body.password;

  // Hash the password
  bcrypt.hash(password, 10)
    .then(hashedPassword => {
      const capitalizedFirstName = firstName.charAt(0).toUpperCase() + firstName.slice(1);
      const capitalizedLastName = lastName.charAt(0).toUpperCase() + lastName.slice(1);

      // Save the new user
      res.status(201).send({});
    })
    .catch(error => {
      next(createHttpError(500, error));
    });
});

module.exports = router;
