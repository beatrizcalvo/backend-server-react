const mongoose = require("mongoose");
const User = require("../models/userModel");

const NON_SELECTED_FIELDS = "-__v";

const createUser = async function (firstName, lastName, email, password) {
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Save profile data

    // Save user data
    const user = User({ email: email, password: password, profileId: "1" });
    const result = await user.save({ session });
    
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
