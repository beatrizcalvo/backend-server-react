const Profile = require("../models/profileModel");
const Nationality = require("../models/nationalityModel");
const Role = require("../models/roleModel");

const NON_SELECTED_FIELDS = "-__v";

const findByIdPopulated = function (id) {
  return Profile.findById(id, NON_SELECTED_FIELDS).populate([
    { path: "firstNationality", select: "_id code description", model: Nationality },
    { path: "role", select: "code description", model: Role }
  ]).lean().exec();
};

module.exports = { findByIdPopulated }
