const mongoose = require("mongoose");

const ContactPointSchema = new mongoose.Schema(
  {
    addressLine1: {
      type: String,
      required: [true, "Please provide an address line 1!"],
    },
    addressLine2: { type: String }
  },
  { timestamps: true }
);

// Set database and collection name 
const appdb = mongoose.connection.useDb("reactApp");
const contactPointsModel = appdb.model("ContactPoint", ContactPointSchema);

module.exports = contactPointsModel;
