const Profile = require("../models/profileModel");
const Role = require("../models/roleModel");

const NON_SELECTED_FIELDS = "-__v";

const findByIdPopulated = function (id) {
  return Profile.findById(id, NON_SELECTED_FIELDS).populate({
    path: "role",
    select: "code description"
  }).lean().exec();
};

module.exports = { findByIdPopulated }