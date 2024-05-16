const mongoose = require("mongoose");
const UserToken = require("../models/userTokenModel");

const NON_SELECTED_FIELDS = "-__v";

const updateToken = function (userId, token) {
  return UserToken.findOneAndUpdate(
    { userId: userId }, 
    { token: token }, 
    { 
      new: true,
      select: NON_SELECTED_FIELDS,
      upsert: true 
    }
  ).lean().exec();
};

const findByToken = function (token) {
  return UserToken.findOne({ token: token }, NON_SELECTED_FIELDS).lean().exec();
};

module.exports = { updateToken, findByToken };
