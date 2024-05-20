const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();

const errorMessages = require("../constants/errorConstants");
const validateRequest = require("../middlewares/validateRequest");
const { updateSchema } = require("../validators/userValidator");

const userDBController = require("../db/controllers/userDBController");
const profileDBController = require("../db/controllers/profileDBController");
const { userResponseDTO } = require("./dto/userDTO");

router.get("/me", (req, res, next) => {
  userDBController.findById(req.currentUserId)
    .then(user => {
      profileDBController.findByIdPopulated(user.profileId)
        .then(profile => {
          const responseBody = userResponseDTO(user, profile);
          console.log("GET /users/me || Response Status: 200 ## Response Body: " + JSON.stringify(responseBody));
          res.status(200).send(responseBody);
        });
    })
    .catch(error => {
      next(createHttpError(404, JSON.stringify([errorMessages.AUTH_API_F_0008()])));
    });
});

router.delete("/me", (req, res, next) => {
  userDBController.deleteUser(req.currentUserId)
    .then(result => {
      console.log("DELETE /users/me || Response Status: 204");
      res.status(204).send();
    })
    .catch(error => {
      next(createHttpError(404, JSON.stringify([errorMessages.AUTH_API_F_0008()])));
    });
});

router.patch("/me", validateRequest(updateSchema), async (req, res, next) => {
  try {
    const newUserFields = {
      ...((req.body.active !== null) && { active: req.body.active })
    };
    console.log(newUserFields);
    
    // Check if there are fields to update
    if (Object.keys(newUserFields).length === 0) {
      return next(createHttpError(400, JSON.stringify([errorMessages.AUTH_API_F_0012()])));
    }

    // Update user
    const userUpdated = await userDBController.updateUser(req.currentUserId, newUserFields);
    res.status(204).send();
  } catch (error) {
    next(createHttpError(500, error));
  }
});

module.exports = router;
