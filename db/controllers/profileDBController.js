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
  const postalAddress = await PostalAddress.findOne({ profileId: profile._id }, NON_SELECTED_FIELDS).lean();
  if (postalAddress !== null) {
    const countryFind = await Nationality.findOne({ code: postalAddress.country }, "code country").lean();
    console.log(countryFind);
    console.log({ country: { code: countryFind.code, description: countryFind.country }});
    Object.assign(postalAddress, { country: { code: countryFind.code, description: countryFind.country }});
  }
  return { ...profile, postalAddress: postalAddress };
};

module.exports = { findByIdPopulated, findByIdWithPostalAddressPopulated }
