const mongoose = require("mongoose");
const Nationalities = require("../models/nationalityModel");

const NON_SELECTED_FIELDS = "-__v";

const findAllActive = function () {
  return Nationalities.find({ active: true }, NON_SELECTED_FIELDS).sort({ description: 1 }).lean().exec();
};

module.exports = { findAllActive };
