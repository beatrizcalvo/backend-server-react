const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();

const userDBController = require("../db/controllers/userDBController");

router.get("/me", (req, res, next) => {
  userDBController.findById(req.currentUserId)
    .then(user => {
      
    })
    .catch(error => {
      next(createHttpError(404, JSON.stringify([errorMessages.AUTH_API_F_0008()])));
    });
});
