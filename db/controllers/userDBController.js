const mongoose = require("mongoose");
const User = require("../models/userModel");
const UserToken = require("../models/userTokenModel");
const LogsUser = require("../models/logsUserModel");
const Profile = require("../models/profileModel");
const Nationality = require("../models/nationalityModel");
const Role = require("../models/roleModel");
const PostalAddress = require("../models/postalAddressModel");

const profileDBController = require("./profileDBController");

const NON_SELECTED_FIELDS = "-__v";

// Format date to yyyy-MM-dd
const formatDate = function (dateString) {
  return new Date(dateString).toISOString().slice(0, 10);
};

// Remove in objFieldsModif fields with equal value in objDB
const verifyFieldsModif = function (objFieldsModif, objDB) {
  Object.entries(objFieldsModif).forEach(([key, value]) => {
    const newValue = ((Object.prototype.toString.call(value) === "[object Object]") && value._id.toString()) 
      || value;
    const oldValue = ((Object.prototype.toString.call(objDB[key]) === "[object Date]") && formatDate(objDB[key])) 
      || ((Object.prototype.toString.call(objDB[key]) === "[object Object]") && objDB[key]._id.toString())
      || objDB[key];
    newValue === oldValue && delete objFieldsModif[key];
  });
};

// Generate a register associated with the data
const generateRegData = function (tableCode, data) {
  if (tableCode === "01") {
    return data.firstName + "#" + data.lastName + "#" + (data.secondLastName || "") + "#" + (data.gender || "") + "#" + 
      (data.birthDate && formatDate(data.birthDate) || "") + "#" + (data.firstNationality?.description || "") + "#" + 
      data.role.code;
  }
  if (tableCode === "02") {
    return data.addressLine1 + "#" + (data.addressLine2 || "") + "#" + data.city + "#" + data.zipCode + "#" + data.country;
  }
  return null;    
};

const createUser = async function (firstName, lastName, email, password) {
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Save user and profile data
    const roleFind = await Role.findOne({ code: "01", active: true }).exec();
    const newProfile = await Profile({ firstName: firstName, lastName: lastName, role: roleFind }).save({ session });
    console.log("Created profile with id=" + newProfile._id);
    const newUser = await User({ email: email, password: password, profileId: newProfile._id }).save({ session });
    console.log("Created user with id=" + newUser._id);

    // Save user creation in logs
    const newLogsUser = await LogsUser({ userEmail: email, operationType: "A", codeTableOperation: "01", dataNext: generateRegData("01", newProfile) }).save({ session });
    console.log("Created logsuser with id=" + newLogsUser._id + ", operationType=A and codeTableOperation=01");
    
    // Commit the changes
    await session.commitTransaction();
    return newUser;
  } catch (error) {
    // Rollback any changes made in the database
    console.log("Rollback all changes made in the database");
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const updateUser = async function (id, updateFields) {
  let modifiedCount = 0;
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Separate field for update profile and for update user
    const { profile: updateFieldsProfile, postalAddress: updateFieldsPostalAddress, ...updateFieldsUser } = updateFields;

    // Find user to update, verify modifications and update if needed
    const userToUpdate = await User.findById(id);
    if (updateFieldsUser !== null) {
      verifyFieldsModif(updateFieldsUser, userToUpdate);
      if (Object.keys(updateFieldsUser).length !== 0) {
        await User.updateOne({ _id: userToUpdate._id }, updateFieldsUser).session(session);
        console.log("Updated user with id=" + userToUpdate._id + " fields=" + JSON.stringify(Object.keys(updateFieldsUser)));
        modifiedCount += Object.keys(updateFieldsUser).length;
      }
    }

    // Find postal address to update, verify modifications and update if needed
    if (updateFieldsPostalAddress !== undefined && updateFieldsPostalAddress !== null) {
      const postalAddressToUpdate = await PostalAddress.findOne({ profileId: userToUpdate.profileId });
      if (postalAddressToUpdate === null) {
        // Insert new postal address
        const newPostalAddress = await PostalAddress({ profileId: userToUpdate.profileId, addressLine1: updateFieldsPostalAddress.addressLine1, addressLine2: updateFieldsPostalAddress.addressLine2, 
                                                      city: updateFieldsPostalAddress.city, zipCode: updateFieldsPostalAddress.zipCode, country: updateFieldsPostalAddress.country }).save({ session });
        console.log("Created postaladdress with id=" + newPostalAddress._id);
        const newLogsUser = await LogsUser({ userEmail: userToUpdate.email, operationType: "A", codeTableOperation: "02", dataNext: generateRegData("02", newPostalAddress) }).save({ session });
        console.log("Created logsuser with id=" + newLogsUser._id + ", operationType=A and codeTableOperation=02");
        modifiedCount += Object.keys(updateFieldsPostalAddress).length;
      } else {
        // Update postal address
        verifyFieldsModif(updateFieldsPostalAddress, postalAddressToUpdate);
        if (Object.keys(updateFieldsPostalAddress).length !== 0) {
          const updatedPostalAddress = await PostalAddress.findByIdAndUpdate(postalAddressToUpdate._id, updateFieldsPostalAddress, { new: true });
          console.log("Updated postaladdress with id=" + updatedPostalAddress._id + " fields=" + JSON.stringify(Object.keys(updateFieldsPostalAddress)));
          const newLogsUser = await LogsUser({ userEmail: userToUpdate.email, operationType: "M", codeTableOperation: "02", dataPrevious: generateRegData("02", postalAddressToUpdate), 
                                            dataNext: generateRegData("02", updatedPostalAddress) }).save({ session });        
          console.log("Created logsuser with id=" + newLogsUser._id + ", operationType=M and codeTableOperation=02");
          modifiedCount += Object.keys(updateFieldsPostalAddress).length;
        }
      }      
    }

    // Find profile to update, verify modifications and update if needed
    if (updateFieldsProfile !== undefined && updateFieldsProfile !== null) {
      const profileToUpdate = await profileDBController.findByIdPopulated(userToUpdate.profileId);
      verifyFieldsModif(updateFieldsProfile, profileToUpdate);
      if (Object.keys(updateFieldsProfile).length !== 0) {
        const updatedProfile = await Profile.findByIdAndUpdate(profileToUpdate._id, updateFieldsProfile, { new: true })
          .populate([
            { path: "firstNationality", select: "code description", model: Nationality },
            { path: "role", select: "code description", model: Role }
          ]).session(session);
        console.log("Updated profile with id=" + updatedProfile._id + " fields=" + JSON.stringify(Object.keys(updateFieldsProfile)));
        // Save user update in logs
        const newLogsUser = await LogsUser({ userEmail: userToUpdate.email, operationType: "M", codeTableOperation: "01", dataPrevious: generateRegData("01", profileToUpdate), 
                                            dataNext: generateRegData("01", updatedProfile) }).save({ session });
        console.log("Created logsuser with id=" + newLogsUser._id + ", operationType=M and codeTableOperation=01");
        modifiedCount += Object.keys(updateFieldsProfile).length;
      }
    }

    // Commit the changes
    await session.commitTransaction();
    return { modifiedCount: modifiedCount }; 
  } catch (error) {
    console.log(error);
    // Rollback any changes made in the database
    console.log("Rollback all changes made in the database");
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }  
};

const deleteUser = async function (id) {
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Delete User & UserToken (Login values)
    const userDeleted = await User.findByIdAndDelete(id).session(session).lean().exec();
    console.log("Deleted user with id=" + userDeleted._id);
    await UserToken.findOneAndDelete({ userId: userDeleted._id }).session(session).exec();
    console.log("Deleted userToken with userId=" + userDeleted._id);

    // Delete Profile, PostalAddress & LogsUser
    await Profile.findByIdAndDelete(userDeleted.profileId).session(session).exec();
    console.log("Deleted profile with id=" + userDeleted.profileId);
    const resultDeleted = await PostalAddress.deleteOne({ profileId: userDeleted.profileId }).session(session).exec();
    if (resultDeleted.deletedCount > 0) console.log("Deleted postaladdress with profileId=" + userDeleted.profileId);
    await LogsUser.deleteMany({ userEmail: userDeleted.email }).session(session).exec();
    console.log("Deleted all logsUser with userEmail=" + userDeleted.email);

    // Commit the changes
    await session.commitTransaction();
    return userDeleted; 
  } catch (error) {
    // Rollback any changes made in the database
    console.log("Rollback all changes made in the database");
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

const findByEmail = function (email) {
  return User.findOne({ email: email }, NON_SELECTED_FIELDS).lean().exec();
};

const findById = function (id) {
  return User.findById(id, NON_SELECTED_FIELDS).lean().exec();
};

module.exports = { 
  createUser, updateUser, deleteUser, 
  findByEmail, findById
};
