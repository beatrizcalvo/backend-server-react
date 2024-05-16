const Profile = require("../models/profileModel");

const NON_SELECTED_FIELDS = "-__v";

const findByIdPopulated = function (id) {
  return Profile.findById(id, NON_SELECTED_FIELDS).populate({
    path: "role",
    model: "roles",
    select: "code description"
  }).lean().exec();
};

module.exports = { findByIdPopulated }
