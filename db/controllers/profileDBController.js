const Profile = require("../models/profileModel");
const Nationality = require("../models/nationalityModel");
const Role = require("../models/roleModel");

const NON_SELECTED_FIELDS = "-__v";

const findByIdPopulated = function (id) {
  return Profile.findById(id, NON_SELECTED_FIELDS).populate([
    { path: "firstNationality", select: "code description", model: Nationality },
    { path: "role", select: "code description", model: Role }
  ]).formatDate("birthDate");
};

module.exports = { findByIdPopulated }
