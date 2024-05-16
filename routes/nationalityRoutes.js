const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();

const nationalityDBController = require("../db/controllers/nationalityDBController");

router.get("/", (req, res, next) => {
  nationalityDBController.findAllActive()
    .then(nationalities => {
      // Check if no exists nationalities active
      if (nationalities.length === 0) {
        console.log("GET /nationalities || Response Status: 204");
        return res.status(204).send();
      }

      const responseBody = {
        nationalities: nationalities.map(nationality => {
          return({
            nationalityId: nationality._id,
            nationalityCode: nationality.code,
            nationalityDescription: nationality.description
          });
        })
      };
      console.log("GET /nationalities || Response Status: 200 ## Response Body: " + JSON.stringify(responseBody));
      res.status(200).send(responseBody);
    })
    .catch(error => {
      next(createHttpError(500, error));
    });
});

module.exports = router;
