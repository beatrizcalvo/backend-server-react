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
    profileId: {
      type: String,
      required: [true, "Please provide a profile id!"],
    },
  },
  { timestamps: true },
);

module.exports =  mongoose.model("User", UserSchema);
