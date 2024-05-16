const mongoose = require("mongoose");
const { nationalitiesModel } = require("../models/nationalityModel");

const NON_SELECTED_FIELDS = "-__v";

const findAllActive = function () {
  return nationalitiesModel.find({ active: true }, NON_SELECTED_FIELDS).sort({ description: 1 }).lean().exec();
};

module.exports = { findAllActive };
