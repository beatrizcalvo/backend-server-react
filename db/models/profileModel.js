const mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "Please provide a first name!"],
    },
    lastName: {
      type: String,
      required: [true, "Please provide a last name!"],
    },
    secondLastName: { type: String },
    gender: {
      type: String,
      enum: ["Female", "Male"]
    }, 
    birthDate: {
      type: Date,
      max: new Date() 
    },
    firstNationality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nationality"
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: [true, "Please provide a role!"],
    }
  },
  { timestamps: true },
);

// Set database and collection name 
const appdb = mongoose.connection.useDb("reactApp");
const profilesModel = appdb.model("Profile", ProfileSchema);

module.exports = profilesModel;
