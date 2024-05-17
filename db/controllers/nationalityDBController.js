const mongoose = require("mongoose");
const Nationality = require("../models/nationalityModel");

const NON_SELECTED_FIELDS = "-__v";

const findAllActive = function () {
  return Nationality.find({ active: true }, NON_SELECTED_FIELDS).sort({ description: 1 }).lean().exec();
};

const findByCodeActive = function (code) {
  return Nationality.find({ code: code, active: true }, NON_SELECTED_FIELDS).lean().exec();
};

module.exports = { findAllActive, findByCodeActive };
