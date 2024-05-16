const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();

const errorMessages = require("../constants/errorConstants");

const userDBController = require("../db/controllers/userDBController");
const profileDBController = require("../db/controllers/profileDBController");
const { userResponseDTO } = require("./dto/userDTO");

router.get("/me", (req, res, next) => {
  userDBController.findById(req.currentUserId)
    .then(user => {
      profileDBController.findByIdPopulated(user.profileId)
        .then(profile => {
          console.log(profile);
          const responseBody = userResponseDTO(user);
          console.log("GET /users/me || Response Status: 200 ## Response Body: " + JSON.stringify(responseBody));
          res.status(200).send(responseBody);
        });
    })
    .catch(error => {
      next(createHttpError(404, JSON.stringify([errorMessages.AUTH_API_F_0008()])));
    });
});
