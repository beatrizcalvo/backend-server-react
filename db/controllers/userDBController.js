const mongoose = require("mongoose");
const Users = require("../models/userModel");

const NON_SELECTED_FIELDS = "-__v";

const createUser = async function (firstName, lastName, email, password) {
  let session = await mongoose.startSession();
  session.startTransaction();
  try {
    // Save profile data
    
    // Commit the changes
    await session.commitTransaction();
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
