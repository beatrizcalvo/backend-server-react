const mongoose = require("mongoose");
const User = require("../models/userModel");
const LogsUser = require("../models/logsUserModel");
const Profile = require("../models/profileModel");
const Role = require("../models/roleModel");

const NON_SELECTED_FIELDS = "-__v";

const createUser = async function (firstName, lastName, email, password) {
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Save profile data
    const role = await Role.findOne({ name: "user", active: true }).exec();
    const profile = await Profile({ firstName: firstName, lastName: lastName, role: role }).save({ session });

    // Save user data
    const result = await User({ email: email, password: password, profileId: profile._id }).save({ session });

    // Save user creation in logs
    await LogsUser({ email: email, operationType: "A", active: true, firstName: firstName, lastName: lastName }).save({ session });
    
    // Commit the changes
    await session.commitTransaction();
    return result;
  } catch (error) {
    // Rollback any changes made in the database
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = { 
  createUser
};
