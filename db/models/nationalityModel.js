const mongoose = require("mongoose");

const NationalitySchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Please provide a nacionality code!"],
      unique: [true, "Nacionality code already exists!"]
    },
    description: {
      type: String,
      required: [true, "Please provide a nacionality description!"],
      unique: [true, "Nacionality description already exists!"]
    },
    country: {
      type: String,
      required: [true, "Please provide a country!"],
      unique: [true, "Country already exists!"]
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  { timestamps: true }
);

// Set database and collection name 
const appdb = mongoose.connection.useDb("reactApp");
const nationalitiesModel = appdb.model("Nationality", NationalitySchema);

module.exports = nationalitiesModel;
