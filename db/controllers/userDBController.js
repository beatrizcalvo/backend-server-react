const mongoose = require("mongoose");
const User = require("../models/userModel");
const UserToken = require("../models/userTokenModel");
const LogsUser = require("../models/logsUserModel");
const Profile = require("../models/profileModel");
const Role = require("../models/roleModel");

const profileDBController = require("./profileDBController");

const NON_SELECTED_FIELDS = "-__v";

// Remove in objFieldsModif fields with equal value in objDB
const verifyFieldsModif = function (objFieldsModif, objDB) {
  Object.entries(objFieldsModif).forEach(([key, value]) => value === objDB[key] && delete objFieldsModif[key]);
};

const createUser = async function (firstName, lastName, email, password) {
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Save profile data
    const role = await Role.findOne({ code: "01", active: true }).exec();
    const profile = await Profile({ firstName: firstName, lastName: lastName, role: role }).save({ session });

    // Save user data
    const result = await User({ email: email, password: password, profileId: profile._id }).save({ session });

    // Save user creation in logs
    await LogsUser({ email: email, operationType: "A", active: true, firstName: firstName, lastName: lastName, role: role.code }).save({ session });
    
    // Commit the changes
    await session.commitTransaction();
    return result;
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
    const { profile: updateFieldsProfile, ...updateFieldsUser } = updateFields;

    // Find user to update, verify modifications and update if needed
    const userToUpdate = await User.findById(id).lean().exec();
    if (updateFieldsUser !== null) {
      verifyFieldsModif(updateFieldsUser, userToUpdate);
      if (Object.keys(updateFieldsUser).length !== 0) {
        await User.updateOne({ _id: userToUpdate._id }, updateFieldsUser).session(session).lean().exec();
        console.log("Update user with id=" + userToUpdate._id + " fields=" + JSON.stringify(Object.keys(updateFieldsUser)));
        modifiedCount += Object.keys(updateFieldsUser).length;
      }
    }

    // Find profile to update, verify modifications and update if needed
    const profileToUpdate = await Profile.findById(userToUpdate.profileId).lean().exec();
    if (updateFieldsProfile !== null) {
      verifyFieldsModif(updateFieldsProfile, profileToUpdate);
    }

    // Save user update in logs
    if (modifiedCount !== 0) 
      await LogsUser({ email: userToUpdate.email, operationType: "M", active: (updateFieldsUser?.active !== null) ? updateFieldsUser.active : userToUpdate.active })
        .save({ session });

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
    await LogsUser.deleteMany({ email: userDeleted.email }).session(session).exec();
    console.log("Deleted all logsUser with email=" + userDeleted.email);

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
