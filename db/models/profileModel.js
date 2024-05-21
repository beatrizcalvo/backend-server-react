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

// Returns a date in 'yyyy-MM-dd' format
ProfileSchema.methods.formatDate = function(dateProperty) {
  const newDate = new Date(this[dateProperty]);
  let formattedDate = `${newDate.getFullYear()}-${`0${newDate.getMonth() + 1}`.slice(-2)}-${`0${newDate.getDate()}`.slice(-2)}`;
  return formattedDate;
};

// Set database and collection name 
const appdb = mongoose.connection.useDb("reactApp");
const profilesModel = appdb.model("Profile", ProfileSchema);

module.exports = profilesModel;
