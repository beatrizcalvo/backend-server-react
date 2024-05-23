const mongoose = require("mongoose");
const User = require("../models/userModel");
const UserToken = require("../models/userTokenModel");
const LogsUser = require("../models/logsUserModel");
const Profile = require("../models/profileModel");
const Role = require("../models/roleModel");

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

// Generate a CSV register associated with the data
const generateCSV = function (data) {
  return data.firstName + "#" + data.lastName + "#" + (data.secondLastName || "") + "#" + (data.gender || "") + "#" + (data.birthDate && formatDate(data.birthDate) || "") + 
    "#" + (data.firstNationality?.description || "") + "#" + data.role.code;
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
    await LogsUser({ userEmail: email, operationType: "A", codeTableOperation: "01", dataNext: generateCSV(newProfile) }).save({ session });
    
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
    const { profile: updateFieldsProfile, contactPoint: updateFieldsContactPoint, ...updateFieldsUser } = updateFields;

    // Find user to update, verify modifications and update if needed
    const userToUpdate = await User.findById(id).lean().exec();
    if (updateFieldsUser !== null) {
      verifyFieldsModif(updateFieldsUser, userToUpdate);
      if (Object.keys(updateFieldsUser).length !== 0) {
        await User.updateOne({ _id: userToUpdate._id }, updateFieldsUser).session(session);
        console.log("Update user with id=" + userToUpdate._id + " fields=" + JSON.stringify(Object.keys(updateFieldsUser)));
        modifiedCount += Object.keys(updateFieldsUser).length;
      }
    }

    // Find profile to update, verify modifications and update if needed
    let profileToUpdate = await profileDBController.findByIdPopulated(userToUpdate.profileId);
    if (updateFieldsProfile !== null) {
      verifyFieldsModif(updateFieldsProfile, profileToUpdate);
      if (Object.keys(updateFieldsProfile).length !== 0) {
        await Profile.updateOne({ _id: profileToUpdate._id }, updateFieldsProfile).session(session);
        console.log("Update profile with id=" + profileToUpdate._id + " fields=" + JSON.stringify(Object.keys(updateFieldsProfile)));
        modifiedCount += Object.keys(updateFieldsProfile).length;
      }
    }

    // Save user update in logs
    if (modifiedCount !== 0) {
      
    }

    // Commit the changes
    await session.commitTransaction();
    return { modifiedCount: modifiedCount }; 
  } catch (error) {
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

    // Delete Profile & LogsUser
    await Profile.findByIdAndDelete(userDeleted.profileId).session(session).exec();
    console.log("Deleted profile with id=" + userDeleted.profileId);
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
