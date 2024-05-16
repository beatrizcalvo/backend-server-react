const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      lowercase: true, 
      required: [true, "Please provide an email!"],
      unique: [true, "Email already exists!"],
    },
    password: {
      type: String,
      required: [true, "Please provide a password!"],
    },
    active: {
      type: Boolean,
      default: true
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Profiles",
      required: [true, "Please provide a profile!"],
    },
  },
  { timestamps: true },
);

// users is collection name
const authdb = mongoose.connection.useDb("authDB");
const usersModel = authdb.model('users', UserSchema);

module.exports =  usersModel;
