const Profile = require("../models/profileModel");
const Nationality = require("../models/nationalityModel");
const Role = require("../models/roleModel");
const PostalAddress = require("../models/postalAddressModel");

const NON_SELECTED_FIELDS = "-__v -createdAt -updatedAt";

const findByIdPopulated = function (id) {
  return Profile.findById(id, NON_SELECTED_FIELDS).populate([
    { path: "firstNationality", select: "code description", model: Nationality },
    { path: "role", select: "code description", model: Role }
  ]);
};

const findByIdWithPostalAddressPopulated = async function (id) {
  const profile = await findByIdPopulated(id).lean();
  const postalAddressFind = await PostalAddress.findOne({ profileId: profile._id }, NON_SELECTED_FIELDS).lean();
  const nationalityFind = await Nationality.findOne({ code: postalAddress.country }, "code country").lean();
  return { ...profile, postalAddress: postalAddressFind };
};

module.exports = { findByIdPopulated, findByIdWithPostalAddressPopulated }
