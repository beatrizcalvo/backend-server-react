const mongoose = require("mongoose");
const User = require("../models/userModel");
const UserToken = require("../models/userTokenModel");
const LogsUser = require("../models/logsUserModel");
const Profile = require("../models/profileModel");
const Role = require("../models/roleModel");

const NON_SELECTED_FIELDS = "-__v";

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
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    
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
