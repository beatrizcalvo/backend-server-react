const mongoose = require("mongoose");

const PostalAddressSchema = new mongoose.Schema(
  {
    profileId: {
      type: String,
      required: [true, "Please provide a profile id!"],
    },
    addressLine1: {
      type: String,
      required: [true, "Please provide an address line 1!"]
    },
    addressLine2: { type: String },
    city: {
      type: String,
      required: [true, "Please provide a city name!"]
    },
    zipCode: {
      type: String,
      required: [true, "Please provide a zip code for the city!"]
    },
    country: {
      type: String,
      required: [true, "Please provide a country code for the city!"]
    }
  },
  { timestamps: true }
);

// Set database and collection name 
const appdb = mongoose.connection.useDb("reactApp");
const postalAddressesModel = appdb.model("PostalAddress", PostalAddressSchema);

module.exports = postalAddressesModel;
