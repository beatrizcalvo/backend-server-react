const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();

const errorMessages = require("../constants/errorConstants");

const userDBController = require("../db/controllers/userDBController");
const { userResponseDTO } = require("./dto/userDTO");

router.get("/me", (req, res, next) => {
  userDBController.findById(req.currentUserId)
    .then(user => {
      
    })
    .catch(error => {
      next(createHttpError(404, JSON.stringify([errorMessages.AUTH_API_F_0008()])));
    });
});
