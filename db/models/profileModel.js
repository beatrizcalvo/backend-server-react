const mongoose = require("mongoose");

const Role = require("./roleModel");

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
    nationality: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Nationalities"
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Roles",
      required: [true, "Please provide a role!"],
    }
  },
  { timestamps: true },
);

// profiles is collection name
const db = mongoose.connection.useDb("reactApp");
const profilesModel = db.model("Profiles", ProfileSchema);

module.exports =  db.model.Profiles || profilesModel;
