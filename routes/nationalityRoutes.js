const createHttpError = require('http-errors');
const express = require("express");
const router = express.Router();

const nationalityDBController = require("../db/controllers/nationalityDBController");

router.get("/", (req, res, next) => {
  nationalityDBController.findAllActive()
    .then(nationalities => {
      // Check if no exists nationalities active
      res.status(200).send({});
    })
    .catch(error => {
      next(createHttpError(500, error));
    });
});

module.exports = router;
