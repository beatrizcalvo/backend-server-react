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
          console.log("GET /users/me ## currentUserId: " + req.currentUserId + " || Response Status: 200 ## Response Body: " + JSON.stringify(responseBody));
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
      console.log("DELETE /users/me ## currentUserId: " + req.currentUserId + " || Response Status: 204");
      res.status(204).send();
    })
    .catch(error => {
      next(createHttpError(404, JSON.stringify([errorMessages.AUTH_API_F_0008()])));
    });
});

router.patch("/me", validateRequest(updateSchema), async (req, res, next) => {
  try {
    // Check if nationality exits and is active
    let nationalityId = "";
    const nationalityCode = req.body.person?.firstNationality?.code;
    if (nationalityCode) {
      const nationalityFound = await nationalityDBController.findByCodeActive(nationalityCode);
      if (nationalityFound.length === 0) return next(createHttpError(404, JSON.stringify([errorMessages.AUTH_API_F_0011()])));
      nationalityId = nationalityFound[0]._id;
    }
    
    // Set update fields and remove undefined
    const newProfileFields = {
      ...(req.body.person?.personName && { ...req.body.person.personName }),
      ...(req.body.person?.gender && { gender: req.body.person.gender }),
      ...(req.body.person?.birthDate && { birthDate: req.body.person.birthDate }),
      ...(nationalityId && { nationality: nationalityId })
    };
    const newUserFields = {
      ...(req.body.active && { active: req.body.active }),
      ...(Object.keys(newProfileFields).length !== 0 && { profile: newProfileFields })
    };
    
    // Check if there are fields to update
    if (Object.keys(newUserFields).length === 0) {
      return next(createHttpError(400, JSON.stringify([errorMessages.AUTH_API_F_0012()])));
    }

    // Update user
    const result = await userDBController.updateUser(req.currentUserId, newUserFields);
    if (result.modifiedCount === 0) return next(createHttpError(400, JSON.stringify([errorMessages.AUTH_API_F_0013()])));
    console.log("PATCH /users/me ## currentUserId: " + req.currentUserId + " ## Request Body: " + JSON.stringify(req.body) + " || Response Status: 204");
    res.status(204).send();
  } catch (error) {
    next(createHttpError(500, error));
  }
});

module.exports = router;
